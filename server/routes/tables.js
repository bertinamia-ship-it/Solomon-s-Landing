const express = require('express');
const { db } = require('../config/database');
const { authenticateToken, authorizeRole, auditLog } = require('../middleware/auth');

const router = express.Router();

// GET /api/tables - Get all tables
router.get('/', authenticateToken, (req, res) => {
    try {
        const tables = db.prepare('SELECT * FROM tables ORDER BY table_number').all();
        res.json({ tables });
    } catch (error) {
        console.error('Get tables error:', error);
        res.status(500).json({ error: 'Failed to get tables' });
    }
});

// GET /api/tables/:id - Get specific table
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const table = db.prepare('SELECT * FROM tables WHERE id = ?').get(req.params.id);
        
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        // Get current order if table is occupied
        let currentOrder = null;
        if (table.status === 'occupied' || table.status === 'waiting_payment') {
            currentOrder = db.prepare(`
                SELECT o.*, u.full_name as waiter_name
                FROM orders o
                LEFT JOIN users u ON o.waiter_id = u.id
                WHERE o.table_id = ? AND o.status != 'paid' AND o.status != 'cancelled'
                ORDER BY o.created_at DESC
                LIMIT 1
            `).get(table.id);

            if (currentOrder) {
                // Get order items
                currentOrder.items = db.prepare(`
                    SELECT oi.*, mi.name_en, mi.name_es, mi.category_en
                    FROM order_items oi
                    JOIN menu_items mi ON oi.menu_item_id = mi.id
                    WHERE oi.order_id = ?
                `).all(currentOrder.id);
            }
        }

        res.json({ table, currentOrder });
    } catch (error) {
        console.error('Get table error:', error);
        res.status(500).json({ error: 'Failed to get table' });
    }
});

// PUT /api/tables/:id - Update table
router.put('/:id', authenticateToken, authorizeRole('admin', 'manager', 'waiter'), auditLog('UPDATE_TABLE', 'table'), (req, res) => {
    try {
        const { status, ipad_id, capacity, location } = req.body;
        const tableId = req.params.id;

        const table = db.prepare('SELECT * FROM tables WHERE id = ?').get(tableId);
        
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (status !== undefined) {
            updates.push('status = ?');
            values.push(status);
        }
        if (ipad_id !== undefined) {
            updates.push('ipad_id = ?');
            values.push(ipad_id);
        }
        if (capacity !== undefined) {
            updates.push('capacity = ?');
            values.push(capacity);
        }
        if (location !== undefined) {
            updates.push('location = ?');
            values.push(location);
        }

        updates.push('updated_at = datetime("now")');
        values.push(tableId);

        const updateQuery = `UPDATE tables SET ${updates.join(', ')} WHERE id = ?`;
        db.prepare(updateQuery).run(...values);

        const updatedTable = db.prepare('SELECT * FROM tables WHERE id = ?').get(tableId);
        res.json({ message: 'Table updated', table: updatedTable });

    } catch (error) {
        console.error('Update table error:', error);
        res.status(500).json({ error: 'Failed to update table' });
    }
});

// POST /api/tables/:id/occupy - Occupy a table (start new order)
router.post('/:id/occupy', authenticateToken, authorizeRole('admin', 'manager', 'waiter'), auditLog('OCCUPY_TABLE', 'table'), (req, res) => {
    try {
        const { customer_name, party_size, allergies, celebration } = req.body;
        const tableId = req.params.id;

        const table = db.prepare('SELECT * FROM tables WHERE id = ?').get(tableId);
        
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        if (table.status !== 'available') {
            return res.status(400).json({ error: 'Table is not available' });
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${table.table_number}`;

        // Create new order
        const insertOrder = db.prepare(`
            INSERT INTO orders (order_number, table_id, waiter_id, customer_name, customer_party_size, customer_allergies, customer_celebration, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        `);

        const result = insertOrder.run(orderNumber, tableId, req.user.id, customer_name, party_size, allergies, celebration);

        // Update table status
        db.prepare('UPDATE tables SET status = "occupied", updated_at = datetime("now") WHERE id = ?').run(tableId);

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);

        res.json({ message: 'Table occupied', order });

    } catch (error) {
        console.error('Occupy table error:', error);
        res.status(500).json({ error: 'Failed to occupy table' });
    }
});

// POST /api/tables/:id/free - Free a table
router.post('/:id/free', authenticateToken, authorizeRole('admin', 'manager', 'waiter'), auditLog('FREE_TABLE', 'table'), (req, res) => {
    try {
        const tableId = req.params.id;

        const table = db.prepare('SELECT * FROM tables WHERE id = ?').get(tableId);
        
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        // Update table status
        db.prepare('UPDATE tables SET status = "available", updated_at = datetime("now") WHERE id = ?').run(tableId);

        res.json({ message: 'Table freed' });

    } catch (error) {
        console.error('Free table error:', error);
        res.status(500).json({ error: 'Failed to free table' });
    }
});

module.exports = router;
