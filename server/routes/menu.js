const express = require('express');
const { db } = require('../config/database');
const { authenticateToken, authorizeRole, auditLog } = require('../middleware/auth');

const router = express.Router();

// GET /api/menu - Get all menu items
router.get('/', (req, res) => {
    try {
        const { category, available } = req.query;
        
        let query = 'SELECT * FROM menu_items WHERE 1=1';
        const params = [];

        if (category) {
            query += ' AND (category_en = ? OR category_es = ?)';
            params.push(category, category);
        }
        if (available !== undefined) {
            query += ' AND available = ?';
            params.push(available === 'true' ? 1 : 0);
        }

        query += ' ORDER BY id';

        const items = db.prepare(query).all(...params);

        // Get options for each item
        items.forEach(item => {
            item.options = db.prepare('SELECT * FROM menu_options WHERE menu_item_id = ?').all(item.id);
        });

        res.json({ items });
    } catch (error) {
        console.error('Get menu error:', error);
        res.status(500).json({ error: 'Failed to get menu' });
    }
});

// GET /api/menu/:id - Get specific menu item
router.get('/:id', (req, res) => {
    try {
        const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
        
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        item.options = db.prepare('SELECT * FROM menu_options WHERE menu_item_id = ?').all(item.id);

        res.json({ item });
    } catch (error) {
        console.error('Get menu item error:', error);
        res.status(500).json({ error: 'Failed to get menu item' });
    }
});

// POST /api/menu - Create menu item
router.post('/', authenticateToken, authorizeRole('admin', 'manager'), auditLog('CREATE_MENU_ITEM', 'menu'), (req, res) => {
    try {
        const { 
            name_en, name_es, description_en, description_es,
            category_en, category_es, price, cost, available,
            featured, is_new, icons, image_url, prep_time, allergens, tags
        } = req.body;

        if (!name_en || !name_es || !category_en || !category_es || !price) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const insert = db.prepare(`
            INSERT INTO menu_items (
                name_en, name_es, description_en, description_es,
                category_en, category_es, price, cost, available,
                featured, is_new, icons, image_url, prep_time, allergens, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = insert.run(
            name_en, name_es, description_en || '', description_es || '',
            category_en, category_es, price, cost || null, available !== false ? 1 : 0,
            featured ? 1 : 0, is_new ? 1 : 0, icons || null, image_url || null,
            prep_time || null, allergens || null, tags || null
        );

        const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(result.lastInsertRowid);
        res.json({ message: 'Menu item created', item });
    } catch (error) {
        console.error('Create menu item error:', error);
        res.status(500).json({ error: 'Failed to create menu item' });
    }
});

// PUT /api/menu/:id - Update menu item
router.put('/:id', authenticateToken, authorizeRole('admin', 'manager'), auditLog('UPDATE_MENU_ITEM', 'menu'), (req, res) => {
    try {
        const itemId = req.params.id;
        const updates = req.body;

        const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        const allowedFields = [
            'name_en', 'name_es', 'description_en', 'description_es',
            'category_en', 'category_es', 'price', 'cost', 'available',
            'featured', 'is_new', 'icons', 'image_url', 'prep_time', 'allergens', 'tags'
        ];

        const updateFields = [];
        const values = [];

        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key)) {
                updateFields.push(`${key} = ?`);
                values.push(updates[key]);
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        updateFields.push('updated_at = datetime("now")');
        values.push(itemId);

        const updateQuery = `UPDATE menu_items SET ${updateFields.join(', ')} WHERE id = ?`;
        db.prepare(updateQuery).run(...values);

        const updatedItem = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(itemId);
        res.json({ message: 'Menu item updated', item: updatedItem });
    } catch (error) {
        console.error('Update menu item error:', error);
        res.status(500).json({ error: 'Failed to update menu item' });
    }
});

// DELETE /api/menu/:id - Delete menu item
router.delete('/:id', authenticateToken, authorizeRole('admin'), auditLog('DELETE_MENU_ITEM', 'menu'), (req, res) => {
    try {
        const itemId = req.params.id;

        const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        db.prepare('DELETE FROM menu_items WHERE id = ?').run(itemId);
        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        console.error('Delete menu item error:', error);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

// POST /api/menu/bulk-price-update - Update prices by percentage
router.post('/bulk-price-update', authenticateToken, authorizeRole('admin', 'manager'), auditLog('BULK_PRICE_UPDATE', 'menu'), (req, res) => {
    try {
        const { percentage, category } = req.body;

        if (!percentage || percentage < -100 || percentage > 100) {
            return res.status(400).json({ error: 'Invalid percentage' });
        }

        const multiplier = 1 + (percentage / 100);
        
        let query = 'UPDATE menu_items SET price = ROUND(price * ?, 2), updated_at = datetime("now")';
        const params = [multiplier];

        if (category) {
            query += ' WHERE category_en = ? OR category_es = ?';
            params.push(category, category);
        }

        const result = db.prepare(query).run(...params);

        res.json({ 
            message: `Prices updated by ${percentage}%`,
            itemsUpdated: result.changes
        });
    } catch (error) {
        console.error('Bulk price update error:', error);
        res.status(500).json({ error: 'Failed to update prices' });
    }
});

// POST /api/menu/import - Import menu from JSON
router.post('/import', authenticateToken, authorizeRole('admin'), auditLog('IMPORT_MENU', 'menu'), (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Items array required' });
        }

        const insert = db.prepare(`
            INSERT OR REPLACE INTO menu_items (
                id, name_en, name_es, description_en, description_es,
                category_en, category_es, price, available, featured, is_new, icons
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const insertOption = db.prepare(`
            INSERT INTO menu_options (menu_item_id, name_en, name_es, price)
            VALUES (?, ?, ?, ?)
        `);

        let imported = 0;

        items.forEach(item => {
            insert.run(
                item.id,
                item.name.en,
                item.name.es,
                item.description.en,
                item.description.es,
                item.category.en,
                item.category.es,
                item.price,
                item.available !== false ? 1 : 0,
                item.featured ? 1 : 0,
                item.new ? 1 : 0,
                item.icons || null
            );

            // Import options if present
            if (item.options && Array.isArray(item.options)) {
                item.options.forEach(opt => {
                    insertOption.run(item.id, opt.name.en, opt.name.es, opt.price);
                });
            }

            imported++;
        });

        res.json({ message: `Imported ${imported} menu items` });
    } catch (error) {
        console.error('Import menu error:', error);
        res.status(500).json({ error: 'Failed to import menu' });
    }
});

// PATCH /api/menu/:id/availability - Toggle item availability (ADMIN/MANAGER)
router.patch('/:id/availability', authenticateToken, authorizeRole(['admin', 'manager']), (req, res) => {
    try {
        const { id } = req.params;
        const { available, reason } = req.body;
        
        // Get current item
        const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        
        // Update availability
        const result = db.prepare(`
            UPDATE menu_items 
            SET available = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `).run(available ? 1 : 0, id);
        
        // Log the change
        db.prepare(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            req.user.id,
            available ? 'menu_item_enabled' : 'menu_item_disabled',
            'menu_item',
            id,
            JSON.stringify({ 
                item_name: item.name_en,
                reason: reason || 'No reason provided',
                previous_state: item.available,
                new_state: available ? 1 : 0
            })
        );
        
        const updatedItem = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
        
        res.json({ 
            success: true, 
            message: `${item.name_en} ${available ? 'enabled' : 'disabled'} successfully`,
            item: updatedItem
        });
    } catch (error) {
        console.error('Toggle availability error:', error);
        res.status(500).json({ error: 'Failed to update availability' });
    }
});

// PATCH /api/menu/bulk/availability - Bulk toggle availability
router.patch('/bulk/availability', authenticateToken, authorizeRole(['admin', 'manager']), (req, res) => {
    try {
        const { item_ids, available, reason } = req.body;
        
        if (!Array.isArray(item_ids) || item_ids.length === 0) {
            return res.status(400).json({ error: 'item_ids must be a non-empty array' });
        }
        
        const placeholders = item_ids.map(() => '?').join(',');
        
        const result = db.prepare(`
            UPDATE menu_items 
            SET available = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id IN (${placeholders})
        `).run(available ? 1 : 0, ...item_ids);
        
        // Log bulk change
        db.prepare(`
            INSERT INTO audit_logs (user_id, action, entity_type, details)
            VALUES (?, ?, ?, ?)
        `).run(
            req.user.id,
            available ? 'bulk_menu_enable' : 'bulk_menu_disable',
            'menu_items',
            JSON.stringify({ 
                affected_items: result.changes,
                reason: reason || 'Bulk update',
                item_ids
            })
        );
        
        res.json({ 
            success: true, 
            message: `${result.changes} items ${available ? 'enabled' : 'disabled'}`,
            affected_count: result.changes
        });
    } catch (error) {
        console.error('Bulk update error:', error);
        res.status(500).json({ error: 'Failed to bulk update' });
    }
});

// GET /api/menu/unavailable - Get all unavailable items
router.get('/status/unavailable', (req, res) => {
    try {
        const items = db.prepare(`
            SELECT id, name_en, name_es, category_en, category_es, updated_at
            FROM menu_items 
            WHERE available = 0
            ORDER BY updated_at DESC
        `).all();
        
        res.json({ 
            count: items.length,
            items 
        });
    } catch (error) {
        console.error('Get unavailable items error:', error);
        res.status(500).json({ error: 'Failed to get unavailable items' });
    }
});

// GET /api/menu/stats - Get menu statistics
router.get('/status/stats', (req, res) => {
    try {
        const stats = {
            total: db.prepare('SELECT COUNT(*) as count FROM menu_items').get().count,
            available: db.prepare('SELECT COUNT(*) as count FROM menu_items WHERE available = 1').get().count,
            unavailable: db.prepare('SELECT COUNT(*) as count FROM menu_items WHERE available = 0').get().count,
            by_category: db.prepare(`
                SELECT 
                    category_en,
                    COUNT(*) as total,
                    SUM(available) as available,
                    COUNT(*) - SUM(available) as unavailable
                FROM menu_items
                GROUP BY category_en
            `).all()
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Get menu stats error:', error);
        res.status(500).json({ error: 'Failed to get menu stats' });
    }
});

module.exports = router;
