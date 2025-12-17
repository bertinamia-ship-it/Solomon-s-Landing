const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Protect all waste routes
router.use(authenticateToken);

/**
 * POST /api/waste/log
 * Register a new waste entry
 */
router.post('/log', async (req, res) => {
    try {
        const db = getDb();
        const {
            menu_item_id,
            item_name,
            quantity,
            unit,
            cost,
            reason,
            area,
            notes
        } = req.body;

        // Validate required fields
        if (!item_name || !quantity || !unit || !reason || !area) {
            return res.status(400).json({
                status: 'error',
                message: 'Faltan campos requeridos'
            });
        }

        // Insert waste log
        const result = db.prepare(`
            INSERT INTO waste_logs (
                menu_item_id,
                item_name,
                quantity,
                unit,
                cost,
                reason,
                area,
                notes,
                reported_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            menu_item_id || null,
            item_name,
            quantity,
            unit,
            cost || 0,
            reason,
            area,
            notes || '',
            req.user.id
        );

        // Log audit
        db.prepare(`
            INSERT INTO audit_logs (user_id, action, table_name, details)
            VALUES (?, 'CREATE', 'waste_logs', ?)
        `).run(
            req.user.id,
            `Registró merma: ${quantity} ${unit} de ${item_name} - ${reason}`
        );

        res.json({
            status: 'ok',
            waste_id: result.lastInsertRowid,
            message: 'Merma registrada exitosamente'
        });
    } catch (error) {
        console.error('Error logging waste:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al registrar merma'
        });
    }
});

/**
 * GET /api/waste/logs
 * Get waste logs with filters
 */
router.get('/logs', authorizeRole('admin', 'manager', 'kitchen', 'bar'), async (req, res) => {
    try {
        const db = getDb();
        const {
            start_date,
            end_date,
            area,
            reason,
            reported_by,
            limit = 100
        } = req.query;

        let query = `
            SELECT 
                wl.*,
                u.username as reported_by_username,
                u.full_name as reported_by_name
            FROM waste_logs wl
            JOIN users u ON wl.reported_by = u.id
            WHERE 1=1
        `;

        const params = [];

        if (start_date) {
            query += ` AND date(wl.created_at) >= date(?)`;
            params.push(start_date);
        }

        if (end_date) {
            query += ` AND date(wl.created_at) <= date(?)`;
            params.push(end_date);
        }

        if (area) {
            query += ` AND wl.area = ?`;
            params.push(area);
        }

        if (reason) {
            query += ` AND wl.reason = ?`;
            params.push(reason);
        }

        if (reported_by) {
            query += ` AND wl.reported_by = ?`;
            params.push(reported_by);
        }

        query += ` ORDER BY wl.created_at DESC LIMIT ?`;
        params.push(parseInt(limit));

        const logs = db.prepare(query).all(...params);

        res.json({
            status: 'ok',
            logs,
            total: logs.length
        });
    } catch (error) {
        console.error('Error fetching waste logs:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener logs de mermas'
        });
    }
});

/**
 * GET /api/waste/stats
 * Get waste statistics
 */
router.get('/stats', authorizeRole('admin', 'manager'), async (req, res) => {
    try {
        const db = getDb();
        const { start_date, end_date } = req.query;

        let dateFilter = '';
        const params = [];

        if (start_date && end_date) {
            dateFilter = 'WHERE date(created_at) BETWEEN date(?) AND date(?)';
            params.push(start_date, end_date);
        }

        // Overall stats
        const overall = db.prepare(`
            SELECT 
                COUNT(*) as total_incidents,
                SUM(cost) as total_cost,
                AVG(cost) as avg_cost
            FROM waste_logs
            ${dateFilter}
        `).get(...params);

        // By area
        const byArea = db.prepare(`
            SELECT 
                area,
                COUNT(*) as count,
                SUM(cost) as total_cost
            FROM waste_logs
            ${dateFilter}
            GROUP BY area
            ORDER BY total_cost DESC
        `).all(...params);

        // By reason
        const byReason = db.prepare(`
            SELECT 
                reason,
                COUNT(*) as count,
                SUM(cost) as total_cost
            FROM waste_logs
            ${dateFilter}
            GROUP BY reason
            ORDER BY total_cost DESC
        `).all(...params);

        // Top wasted items
        const topItems = db.prepare(`
            SELECT 
                item_name,
                COUNT(*) as incidents,
                SUM(quantity) as total_quantity,
                unit,
                SUM(cost) as total_cost
            FROM waste_logs
            ${dateFilter}
            GROUP BY item_name
            ORDER BY total_cost DESC
            LIMIT 10
        `).all(...params);

        // Daily trend
        const dailyTrend = db.prepare(`
            SELECT 
                date(created_at) as date,
                COUNT(*) as incidents,
                SUM(cost) as total_cost
            FROM waste_logs
            ${dateFilter}
            GROUP BY date(created_at)
            ORDER BY date DESC
            LIMIT 30
        `).all(...params);

        // By staff member
        const byStaff = db.prepare(`
            SELECT 
                u.username,
                u.full_name,
                COUNT(*) as reports_count,
                SUM(wl.cost) as total_reported_cost
            FROM waste_logs wl
            JOIN users u ON wl.reported_by = u.id
            ${dateFilter}
            GROUP BY wl.reported_by
            ORDER BY total_reported_cost DESC
        `).all(...params);

        res.json({
            status: 'ok',
            stats: {
                overall,
                by_area: byArea,
                by_reason: byReason,
                top_items: topItems,
                daily_trend: dailyTrend,
                by_staff: byStaff
            }
        });
    } catch (error) {
        console.error('Error fetching waste stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener estadísticas de mermas'
        });
    }
});

/**
 * GET /api/waste/alerts
 * Get waste alerts (items with high waste rates)
 */
router.get('/alerts', authorizeRole('admin', 'manager'), async (req, res) => {
    try {
        const db = getDb();
        const { days = 7 } = req.query;

        // Items with frequent waste
        const frequentWaste = db.prepare(`
            SELECT 
                item_name,
                COUNT(*) as incidents,
                SUM(quantity) as total_quantity,
                SUM(cost) as total_cost,
                MAX(created_at) as last_incident
            FROM waste_logs
            WHERE created_at >= date('now', '-' || ? || ' days')
            GROUP BY item_name
            HAVING incidents >= 3
            ORDER BY incidents DESC
        `).all(days);

        // High cost incidents
        const highCost = db.prepare(`
            SELECT 
                wl.*,
                u.username,
                u.full_name
            FROM waste_logs wl
            JOIN users u ON wl.reported_by = u.id
            WHERE wl.cost > 100
            AND wl.created_at >= date('now', '-' || ? || ' days')
            ORDER BY wl.cost DESC
        `).all(days);

        // Suspicious patterns (same reason repeatedly from same user)
        const patterns = db.prepare(`
            SELECT 
                u.username,
                u.full_name,
                wl.reason,
                COUNT(*) as count,
                SUM(wl.cost) as total_cost
            FROM waste_logs wl
            JOIN users u ON wl.reported_by = u.id
            WHERE wl.created_at >= date('now', '-' || ? || ' days')
            GROUP BY wl.reported_by, wl.reason
            HAVING count >= 5
            ORDER BY count DESC
        `).all(days);

        res.json({
            status: 'ok',
            alerts: {
                frequent_waste: frequentWaste,
                high_cost_incidents: highCost,
                suspicious_patterns: patterns
            }
        });
    } catch (error) {
        console.error('Error fetching waste alerts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener alertas de mermas'
        });
    }
});

/**
 * PUT /api/waste/:wasteId
 * Update waste log (corrections)
 */
router.put('/:wasteId', authorizeRole('admin', 'manager'), async (req, res) => {
    try {
        const db = getDb();
        const { wasteId } = req.params;
        const { quantity, cost, notes } = req.body;

        const waste = db.prepare('SELECT * FROM waste_logs WHERE id = ?').get(wasteId);

        if (!waste) {
            return res.status(404).json({
                status: 'error',
                message: 'Registro de merma no encontrado'
            });
        }

        db.prepare(`
            UPDATE waste_logs SET
                quantity = ?,
                cost = ?,
                notes = ?
            WHERE id = ?
        `).run(quantity || waste.quantity, cost || waste.cost, notes || waste.notes, wasteId);

        // Log audit
        db.prepare(`
            INSERT INTO audit_logs (user_id, action, table_name, details)
            VALUES (?, 'UPDATE', 'waste_logs', ?)
        `).run(
            req.user.id,
            `Actualizó merma #${wasteId}`
        );

        res.json({
            status: 'ok',
            message: 'Merma actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error updating waste:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar merma'
        });
    }
});

/**
 * DELETE /api/waste/:wasteId
 * Delete waste log (admin only)
 */
router.delete('/:wasteId', authorizeRole('admin'), async (req, res) => {
    try {
        const db = getDb();
        const { wasteId } = req.params;

        const waste = db.prepare('SELECT * FROM waste_logs WHERE id = ?').get(wasteId);

        if (!waste) {
            return res.status(404).json({
                status: 'error',
                message: 'Registro de merma no encontrado'
            });
        }

        db.prepare('DELETE FROM waste_logs WHERE id = ?').run(wasteId);

        // Log audit
        db.prepare(`
            INSERT INTO audit_logs (user_id, action, table_name, details)
            VALUES (?, 'DELETE', 'waste_logs', ?)
        `).run(
            req.user.id,
            `Eliminó merma #${wasteId}: ${waste.item_name}`
        );

        res.json({
            status: 'ok',
            message: 'Merma eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error deleting waste:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar merma'
        });
    }
});

module.exports = router;
