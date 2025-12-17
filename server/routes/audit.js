const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');

// Get audit logs with filters
router.get('/logs', async (req, res) => {
    try {
        const db = getDb();
        const {
            start_date,
            end_date,
            user_id,
            action,
            table_name,
            limit = 1000
        } = req.query;

        let query = `
            SELECT 
                al.*,
                u.username,
                u.full_name
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE 1=1
        `;

        const params = [];

        if (start_date) {
            query += ` AND date(al.created_at) >= date(?)`;
            params.push(start_date);
        }

        if (end_date) {
            query += ` AND date(al.created_at) <= date(?)`;
            params.push(end_date);
        }

        if (user_id) {
            query += ` AND al.user_id = ?`;
            params.push(user_id);
        }

        if (action) {
            query += ` AND al.action = ?`;
            params.push(action);
        }

        if (table_name) {
            query += ` AND al.table_name = ?`;
            params.push(table_name);
        }

        query += ` ORDER BY al.created_at DESC LIMIT ?`;
        params.push(parseInt(limit));

        const logs = db.prepare(query).all(...params);

        res.json({
            status: 'ok',
            logs,
            total: logs.length
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener logs de auditoría'
        });
    }
});

// Get audit statistics
router.get('/stats', async (req, res) => {
    try {
        const db = getDb();
        const { start_date, end_date } = req.query;

        let dateFilter = '';
        const params = [];

        if (start_date && end_date) {
            dateFilter = 'WHERE date(created_at) BETWEEN date(?) AND date(?)';
            params.push(start_date, end_date);
        }

        // Total actions
        const totalQuery = `SELECT COUNT(*) as total FROM audit_logs ${dateFilter}`;
        const total = db.prepare(totalQuery).get(...params);

        // Actions by type
        const byActionQuery = `
            SELECT action, COUNT(*) as count 
            FROM audit_logs 
            ${dateFilter}
            GROUP BY action
        `;
        const byAction = db.prepare(byActionQuery).all(...params);

        // Actions by user
        const byUserQuery = `
            SELECT 
                u.username,
                u.full_name,
                COUNT(*) as count
            FROM audit_logs al
            JOIN users u ON al.user_id = u.id
            ${dateFilter}
            GROUP BY al.user_id
            ORDER BY count DESC
            LIMIT 10
        `;
        const byUser = db.prepare(byUserQuery).all(...params);

        // Actions by table
        const byTableQuery = `
            SELECT 
                table_name,
                COUNT(*) as count
            FROM audit_logs
            ${dateFilter}
            GROUP BY table_name
            ORDER BY count DESC
        `;
        const byTable = db.prepare(byTableQuery).all(...params);

        // Daily trend
        const trendQuery = `
            SELECT 
                date(created_at) as date,
                COUNT(*) as count
            FROM audit_logs
            ${dateFilter}
            GROUP BY date(created_at)
            ORDER BY date DESC
            LIMIT 30
        `;
        const trend = db.prepare(trendQuery).all(...params);

        res.json({
            status: 'ok',
            stats: {
                total: total.total,
                byAction,
                byUser,
                byTable,
                trend
            }
        });
    } catch (error) {
        console.error('Error fetching audit stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener estadísticas'
        });
    }
});

// Get user activity timeline
router.get('/user/:userId/timeline', async (req, res) => {
    try {
        const db = getDb();
        const { userId } = req.params;
        const { limit = 50 } = req.query;

        const logs = db.prepare(`
            SELECT *
            FROM audit_logs
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        `).all(userId, parseInt(limit));

        res.json({
            status: 'ok',
            logs
        });
    } catch (error) {
        console.error('Error fetching user timeline:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener timeline del usuario'
        });
    }
});

// Export audit log (for Excel export)
router.get('/export', async (req, res) => {
    try {
        const db = getDb();
        const {
            start_date,
            end_date,
            user_id,
            action,
            table_name
        } = req.query;

        let query = `
            SELECT 
                al.created_at as 'Fecha/Hora',
                u.username as 'Usuario',
                u.full_name as 'Nombre Completo',
                al.action as 'Acción',
                al.table_name as 'Tabla',
                al.details as 'Detalles',
                al.ip_address as 'IP'
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE 1=1
        `;

        const params = [];

        if (start_date) {
            query += ` AND date(al.created_at) >= date(?)`;
            params.push(start_date);
        }

        if (end_date) {
            query += ` AND date(al.created_at) <= date(?)`;
            params.push(end_date);
        }

        if (user_id) {
            query += ` AND al.user_id = ?`;
            params.push(user_id);
        }

        if (action) {
            query += ` AND al.action = ?`;
            params.push(action);
        }

        if (table_name) {
            query += ` AND al.table_name = ?`;
            params.push(table_name);
        }

        query += ` ORDER BY al.created_at DESC`;

        const logs = db.prepare(query).all(...params);

        // Convert to CSV
        const headers = Object.keys(logs[0] || {});
        let csv = headers.join(',') + '\n';
        
        logs.forEach(log => {
            const values = headers.map(h => {
                const value = log[h] || '';
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csv += values.join(',') + '\n';
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=audit_log_${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    } catch (error) {
        console.error('Error exporting audit log:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al exportar logs'
        });
    }
});

module.exports = router;
