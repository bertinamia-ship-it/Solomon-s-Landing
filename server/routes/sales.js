const express = require('express');
const { db } = require('../config/database');
const { authenticateToken, authorizeRole, auditLog, requiresManagerAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/sales/complete - Complete order and create sale
router.post('/complete', authenticateToken, authorizeRole('admin', 'manager', 'waiter'), auditLog('COMPLETE_SALE', 'sale'), (req, res) => {
    try {
        const { order_id, payment_method, tip, discount, discount_reason, manager_pin } = req.body;

        if (!order_id || !payment_method) {
            return res.status(400).json({ error: 'Order ID and payment method required' });
        }

        const order = db.prepare(`
            SELECT o.*, t.table_number, u.full_name as waiter_name
            FROM orders o
            LEFT JOIN tables t ON o.table_id = t.id
            LEFT JOIN users u ON o.waiter_id = u.id
            WHERE o.id = ?
        `).get(order_id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.status === 'paid') {
            return res.status(400).json({ error: 'Order already paid' });
        }

        // Get order items
        const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order_id);
        
        // Calculate totals
        let subtotal = order.subtotal || 0;
        let tax = order.tax || subtotal * 0.16;
        let tipAmount = tip || 0;
        let discountAmount = discount || 0;

        // If discount > 0, requires manager authorization
        if (discountAmount > 0) {
            if (!manager_pin) {
                return res.status(403).json({ error: 'Manager PIN required for discounts' });
            }

            const manager = db.prepare('SELECT * FROM users WHERE pin = ? AND role IN ("admin", "manager") AND active = 1').get(manager_pin);
            if (!manager) {
                return res.status(403).json({ error: 'Invalid manager PIN' });
            }

            // Log discount
            db.prepare(`
                INSERT INTO discounts (order_id, type, amount, reason, authorized_by, applied_by)
                VALUES (?, 'discount', ?, ?, ?, ?)
            `).run(order_id, discountAmount, discount_reason || 'Manual discount', manager.id, req.user.id);
        }

        const total = subtotal + tax + tipAmount - discountAmount;

        // Create sale record
        const insertSale = db.prepare(`
            INSERT INTO sales (
                order_id, table_number, waiter_id, waiter_name,
                subtotal, tax, tip, discount, total, payment_method, items_json, shift
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const shift = getCurrentShift();
        const itemsJson = JSON.stringify(items);

        const result = insertSale.run(
            order_id,
            order.table_number,
            order.waiter_id,
            order.waiter_name,
            subtotal,
            tax,
            tipAmount,
            discountAmount,
            total,
            payment_method,
            itemsJson,
            shift
        );

        // Update order
        db.prepare(`
            UPDATE orders 
            SET status = 'paid', tip = ?, discount = ?, total = ?, completed_at = datetime("now"), updated_at = datetime("now")
            WHERE id = ?
        `).run(tipAmount, discountAmount, total, order_id);

        // Free table
        db.prepare('UPDATE tables SET status = "available", updated_at = datetime("now") WHERE id = ?').run(order.table_id);

        const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(result.lastInsertRowid);

        res.json({ 
            message: 'Sale completed',
            sale,
            receipt: {
                order_number: order.order_number,
                table: order.table_number,
                waiter: order.waiter_name,
                subtotal,
                tax,
                tip: tipAmount,
                discount: discountAmount,
                total,
                payment_method,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Complete sale error:', error);
        res.status(500).json({ error: 'Failed to complete sale' });
    }
});

// GET /api/sales - Get sales with filters
router.get('/', authenticateToken, authorizeRole('admin', 'manager'), (req, res) => {
    try {
        const { start_date, end_date, waiter_id, payment_method } = req.query;
        
        let query = 'SELECT * FROM sales WHERE 1=1';
        const params = [];

        if (start_date) {
            query += ' AND date(timestamp) >= date(?)';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND date(timestamp) <= date(?)';
            params.push(end_date);
        }
        if (waiter_id) {
            query += ' AND waiter_id = ?';
            params.push(waiter_id);
        }
        if (payment_method) {
            query += ' AND payment_method = ?';
            params.push(payment_method);
        }

        query += ' ORDER BY timestamp DESC';

        const sales = db.prepare(query).all(...params);

        // Calculate summary
        const summary = {
            total_sales: sales.reduce((sum, s) => sum + s.total, 0),
            total_tips: sales.reduce((sum, s) => sum + (s.tip || 0), 0),
            total_discounts: sales.reduce((sum, s) => sum + (s.discount || 0), 0),
            count: sales.length
        };

        res.json({ sales, summary });
    } catch (error) {
        console.error('Get sales error:', error);
        res.status(500).json({ error: 'Failed to get sales' });
    }
});

// GET /api/sales/metrics - Get sales metrics
router.get('/metrics', authenticateToken, authorizeRole('admin', 'manager'), (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().toISOString().slice(0, 7);

        // Today's sales
        const todaySales = db.prepare(`
            SELECT 
                COUNT(*) as count,
                SUM(total) as total,
                SUM(tip) as tips,
                AVG(total) as average_ticket
            FROM sales
            WHERE date(timestamp) = date(?)
        `).get(today);

        // This month's sales
        const monthSales = db.prepare(`
            SELECT 
                COUNT(*) as count,
                SUM(total) as total,
                SUM(tip) as tips
            FROM sales
            WHERE strftime('%Y-%m', timestamp) = ?
        `).get(thisMonth);

        // Sales by category
        const categoryBreakdown = db.prepare(`
            SELECT 
                json_extract(value, '$.category') as category,
                SUM(CAST(json_extract(value, '$.subtotal') as REAL)) as total
            FROM sales,
                json_each(items_json)
            WHERE date(timestamp) = date(?)
            GROUP BY category
        `).all(today);

        // Top selling items
        const topItems = db.prepare(`
            SELECT 
                json_extract(value, '$.menu_item_id') as item_id,
                json_extract(value, '$.name_en') as name,
                SUM(CAST(json_extract(value, '$.quantity') as INTEGER)) as quantity_sold,
                SUM(CAST(json_extract(value, '$.subtotal') as REAL)) as revenue
            FROM sales,
                json_each(items_json)
            WHERE date(timestamp) = date(?)
            GROUP BY item_id
            ORDER BY quantity_sold DESC
            LIMIT 10
        `).all(today);

        // Sales by waiter
        const waiterStats = db.prepare(`
            SELECT 
                waiter_name,
                COUNT(*) as orders,
                SUM(total) as total_sales,
                SUM(tip) as total_tips,
                AVG(total) as avg_ticket
            FROM sales
            WHERE date(timestamp) = date(?)
            GROUP BY waiter_id
            ORDER BY total_sales DESC
        `).all(today);

        res.json({
            today: todaySales,
            month: monthSales,
            category_breakdown: categoryBreakdown,
            top_items: topItems,
            waiter_stats: waiterStats
        });
    } catch (error) {
        console.error('Get metrics error:', error);
        res.status(500).json({ error: 'Failed to get metrics' });
    }
});

// Helper function to determine current shift
function getCurrentShift() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'breakfast';
    if (hour >= 14 && hour < 18) return 'lunch';
    return 'dinner';
}

module.exports = router;
