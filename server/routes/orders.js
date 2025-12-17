const express = require('express');
const { db } = require('../config/database');
const { authenticateToken, authorizeRole, auditLog, requiresManagerAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/orders - Get all orders (with filters)
router.get('/', authenticateToken, (req, res) => {
    try {
        const { status, table_id, waiter_id } = req.query;
        
        let query = `
            SELECT o.*, t.table_number, u.full_name as waiter_name
            FROM orders o
            LEFT JOIN tables t ON o.table_id = t.id
            LEFT JOIN users u ON o.waiter_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            query += ' AND o.status = ?';
            params.push(status);
        }
        if (table_id) {
            query += ' AND o.table_id = ?';
            params.push(table_id);
        }
        if (waiter_id) {
            query += ' AND o.waiter_id = ?';
            params.push(waiter_id);
        }

        query += ' ORDER BY o.created_at DESC';

        const orders = db.prepare(query).all(...params);

        // Get items for each order
        orders.forEach(order => {
            order.items = db.prepare(`
                SELECT oi.*, mi.name_en, mi.name_es, mi.category_en
                FROM order_items oi
                JOIN menu_items mi ON oi.menu_item_id = mi.id
                WHERE oi.order_id = ?
            `).all(order.id);
        });

        res.json({ orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to get orders' });
    }
});

// GET /api/orders/:id - Get specific order
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const order = db.prepare(`
            SELECT o.*, t.table_number, u.full_name as waiter_name
            FROM orders o
            LEFT JOIN tables t ON o.table_id = t.id
            LEFT JOIN users u ON o.waiter_id = u.id
            WHERE o.id = ?
        `).get(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Get order items
        order.items = db.prepare(`
            SELECT oi.*, mi.name_en, mi.name_es, mi.category_en, mi.price as current_price
            FROM order_items oi
            JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE oi.order_id = ?
        `).all(order.id);

        res.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to get order' });
    }
});

// POST /api/orders - Create new order
router.post('/', authenticateToken, authorizeRole('admin', 'manager', 'waiter'), auditLog('CREATE_ORDER', 'order'), (req, res) => {
    try {
        const { table_id, customer_name, party_size, allergies, celebration } = req.body;

        if (!table_id) {
            return res.status(400).json({ error: 'Table ID required' });
        }

        const table = db.prepare('SELECT * FROM tables WHERE id = ?').get(table_id);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${table.table_number}`;

        const insertOrder = db.prepare(`
            INSERT INTO orders (order_number, table_id, waiter_id, customer_name, customer_party_size, customer_allergies, customer_celebration, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        `);

        const result = insertOrder.run(orderNumber, table_id, req.user.id, customer_name, party_size, allergies, celebration);

        // Update table status
        db.prepare('UPDATE tables SET status = "occupied" WHERE id = ?').run(table_id);

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);

        res.json({ message: 'Order created', order });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// POST /api/orders/:id/items - Add items to order
router.post('/:id/items', authenticateToken, authorizeRole('admin', 'manager', 'waiter', 'customer'), auditLog('ADD_ORDER_ITEMS', 'order'), (req, res) => {
    try {
        const { items } = req.body; // [{menu_item_id, quantity, options, special_instructions}]
        const orderId = req.params.id;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Items array required' });
        }

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const insertItem = db.prepare(`
            INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal, category, special_instructions, options, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `);

        const addedItems = [];

        items.forEach(item => {
            const menuItem = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(item.menu_item_id);
            if (!menuItem) {
                throw new Error(`Menu item ${item.menu_item_id} not found`);
            }

            const quantity = item.quantity || 1;
            const unitPrice = menuItem.price;
            const subtotal = unitPrice * quantity;
            const category = menuItem.category_en;

            const result = insertItem.run(
                orderId,
                item.menu_item_id,
                quantity,
                unitPrice,
                subtotal,
                category,
                item.special_instructions || null,
                item.options ? JSON.stringify(item.options) : null
            );

            addedItems.push({
                id: result.lastInsertRowid,
                menu_item_id: item.menu_item_id,
                name: menuItem.name_en,
                quantity,
                unit_price: unitPrice,
                subtotal
            });
        });

        // Update order totals
        updateOrderTotals(orderId);

        res.json({ message: 'Items added to order', items: addedItems });
    } catch (error) {
        console.error('Add items error:', error);
        res.status(500).json({ error: error.message || 'Failed to add items' });
    }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', authenticateToken, authorizeRole('admin', 'manager', 'waiter', 'kitchen', 'bar'), auditLog('UPDATE_ORDER_STATUS', 'order'), (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'paid', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        db.prepare('UPDATE orders SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, orderId);

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        res.json({ message: 'Order status updated', order });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// PUT /api/orders/:id/items/:itemId - Update order item status
router.put('/:id/items/:itemId', authenticateToken, authorizeRole('admin', 'manager', 'kitchen', 'bar'), auditLog('UPDATE_ITEM_STATUS', 'order_item'), (req, res) => {
    try {
        const { status } = req.body;
        const { itemId } = req.params;

        const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        db.prepare('UPDATE order_items SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, itemId);

        res.json({ message: 'Item status updated' });
    } catch (error) {
        console.error('Update item status error:', error);
        res.status(500).json({ error: 'Failed to update item status' });
    }
});

// DELETE /api/orders/:id - Cancel order
router.delete('/:id', authenticateToken, authorizeRole('admin', 'manager'), requiresManagerAuth, auditLog('CANCEL_ORDER', 'order'), (req, res) => {
    try {
        const orderId = req.params.id;

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Cancel order
        db.prepare('UPDATE orders SET status = "cancelled", updated_at = datetime("now") WHERE id = ?').run(orderId);

        // Free table
        db.prepare('UPDATE tables SET status = "available" WHERE id = ?').run(order.table_id);

        res.json({ message: 'Order cancelled' });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

// GET /api/orders/kitchen/pending - Get kitchen orders
router.get('/kitchen/pending', authenticateToken, authorizeRole('admin', 'manager', 'kitchen'), (req, res) => {
    try {
        const items = db.prepare(`
            SELECT 
                oi.*,
                mi.name_en,
                mi.name_es,
                o.order_number,
                o.customer_name,
                t.table_number,
                o.created_at as order_time
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN menu_items mi ON oi.menu_item_id = mi.id
            JOIN tables t ON o.table_id = t.id
            WHERE oi.category NOT IN ('Margaritas', 'Bar', 'Cocktails', 'Beer', 'Wine')
            AND oi.status IN ('pending', 'preparing')
            AND o.status != 'cancelled'
            ORDER BY oi.created_at ASC
        `).all();

        res.json({ items });
    } catch (error) {
        console.error('Get kitchen orders error:', error);
        res.status(500).json({ error: 'Failed to get kitchen orders' });
    }
});

// GET /api/orders/bar/pending - Get bar orders
router.get('/bar/pending', authenticateToken, authorizeRole('admin', 'manager', 'bar'), (req, res) => {
    try {
        const items = db.prepare(`
            SELECT 
                oi.*,
                mi.name_en,
                mi.name_es,
                o.order_number,
                o.customer_name,
                t.table_number,
                o.created_at as order_time
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN menu_items mi ON oi.menu_item_id = mi.id
            JOIN tables t ON o.table_id = t.id
            WHERE oi.category IN ('Margaritas', 'Bar', 'Cocktails', 'Beer', 'Wine')
            AND oi.status IN ('pending', 'preparing')
            AND o.status != 'cancelled'
            ORDER BY oi.created_at ASC
        `).all();

        res.json({ items });
    } catch (error) {
        console.error('Get bar orders error:', error);
        res.status(500).json({ error: 'Failed to get bar orders' });
    }
});

// Helper function to update order totals
function updateOrderTotals(orderId) {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ? AND status != "cancelled"').all(orderId);
    
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.16; // 16% IVA
    const total = subtotal + tax;

    db.prepare(`
        UPDATE orders 
        SET subtotal = ?, tax = ?, total = ?, updated_at = datetime("now")
        WHERE id = ?
    `).run(subtotal, tax, total, orderId);
}

module.exports = router;
