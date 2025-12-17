const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Protect all shift routes
router.use(authenticateToken);

/**
 * POST /api/shifts/open
 * Open a new shift for a waiter
 */
router.post('/open', async (req, res) => {
    try {
        const db = getDb();
        const { waiter_id, initial_cash } = req.body;

        // Check if waiter already has an open shift
        const existingShift = db.prepare(`
            SELECT id FROM shift_closures 
            WHERE waiter_id = ? AND status = 'open'
        `).get(waiter_id);

        if (existingShift) {
            return res.status(400).json({
                status: 'error',
                message: 'El mesero ya tiene un turno abierto'
            });
        }

        const result = db.prepare(`
            INSERT INTO shift_closures (
                waiter_id, 
                shift_start, 
                initial_cash,
                status
            ) VALUES (?, datetime('now'), ?, 'open')
        `).run(waiter_id, initial_cash || 0);

        res.json({
            status: 'ok',
            shift_id: result.lastInsertRowid,
            message: 'Turno iniciado exitosamente'
        });
    } catch (error) {
        console.error('Error opening shift:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al abrir turno'
        });
    }
});

/**
 * POST /api/shifts/close/:shiftId
 * Close a shift with cash count
 */
router.post('/close/:shiftId', async (req, res) => {
    try {
        const db = getDb();
        const { shiftId } = req.params;
        const { 
            final_cash,
            cash_sales,
            card_sales,
            notes 
        } = req.body;

        // Get shift details
        const shift = db.prepare(`
            SELECT * FROM shift_closures WHERE id = ?
        `).get(shiftId);

        if (!shift) {
            return res.status(404).json({
                status: 'error',
                message: 'Turno no encontrado'
            });
        }

        if (shift.status === 'closed') {
            return res.status(400).json({
                status: 'error',
                message: 'Este turno ya está cerrado'
            });
        }

        // Calculate system sales for this shift
        const systemSales = db.prepare(`
            SELECT 
                COALESCE(SUM(CASE WHEN payment_method = 'cash' THEN total ELSE 0 END), 0) as cash_total,
                COALESCE(SUM(CASE WHEN payment_method = 'card' THEN total ELSE 0 END), 0) as card_total,
                COALESCE(SUM(total), 0) as total_sales,
                COUNT(*) as order_count
            FROM sales
            WHERE waiter_id = ?
            AND created_at BETWEEN ? AND datetime('now')
        `).get(shift.waiter_id, shift.shift_start);

        // Calculate discrepancy
        const expected_cash = parseFloat(shift.initial_cash) + parseFloat(systemSales.cash_total);
        const discrepancy = parseFloat(final_cash) - expected_cash;

        // Update shift closure
        db.prepare(`
            UPDATE shift_closures SET
                shift_end = datetime('now'),
                final_cash = ?,
                system_cash_sales = ?,
                system_card_sales = ?,
                reported_cash_sales = ?,
                reported_card_sales = ?,
                discrepancy = ?,
                notes = ?,
                status = 'closed',
                closed_by = ?
            WHERE id = ?
        `).run(
            final_cash,
            systemSales.cash_total,
            systemSales.card_total,
            cash_sales || systemSales.cash_total,
            card_sales || systemSales.card_total,
            discrepancy,
            notes || '',
            req.user.id,
            shiftId
        );

        // Log audit
        db.prepare(`
            INSERT INTO audit_logs (user_id, action, table_name, details)
            VALUES (?, 'SHIFT_CLOSE', 'shift_closures', ?)
        `).run(
            req.user.id,
            `Cierre de turno #${shiftId} - Discrepancia: $${discrepancy.toFixed(2)}`
        );

        res.json({
            status: 'ok',
            message: 'Turno cerrado exitosamente',
            shift_summary: {
                shift_id: shiftId,
                waiter_id: shift.waiter_id,
                duration_hours: calculateDuration(shift.shift_start),
                initial_cash: shift.initial_cash,
                final_cash: final_cash,
                system_sales: systemSales.total_sales,
                system_cash: systemSales.cash_total,
                system_card: systemSales.card_total,
                order_count: systemSales.order_count,
                discrepancy: discrepancy,
                status: discrepancy === 0 ? 'exact' : (Math.abs(discrepancy) < 10 ? 'minor' : 'major')
            }
        });
    } catch (error) {
        console.error('Error closing shift:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al cerrar turno'
        });
    }
});

/**
 * GET /api/shifts/active
 * Get all active (open) shifts
 */
router.get('/active', async (req, res) => {
    try {
        const db = getDb();

        const shifts = db.prepare(`
            SELECT 
                sc.*,
                u.username,
                u.full_name,
                COUNT(DISTINCT s.id) as orders_count,
                COALESCE(SUM(s.total), 0) as total_sales
            FROM shift_closures sc
            JOIN users u ON sc.waiter_id = u.id
            LEFT JOIN sales s ON s.waiter_id = sc.waiter_id 
                AND s.created_at >= sc.shift_start
            WHERE sc.status = 'open'
            GROUP BY sc.id
        `).all();

        res.json({
            status: 'ok',
            shifts: shifts.map(s => ({
                ...s,
                duration_hours: calculateDuration(s.shift_start)
            }))
        });
    } catch (error) {
        console.error('Error fetching active shifts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener turnos activos'
        });
    }
});

/**
 * GET /api/shifts/history
 * Get shift history with filters
 */
router.get('/history', authorizeRole('admin', 'manager'), async (req, res) => {
    try {
        const db = getDb();
        const { 
            waiter_id, 
            start_date, 
            end_date,
            status,
            limit = 50 
        } = req.query;

        let query = `
            SELECT 
                sc.*,
                u.username,
                u.full_name,
                cb.username as closed_by_username
            FROM shift_closures sc
            JOIN users u ON sc.waiter_id = u.id
            LEFT JOIN users cb ON sc.closed_by = cb.id
            WHERE 1=1
        `;

        const params = [];

        if (waiter_id) {
            query += ` AND sc.waiter_id = ?`;
            params.push(waiter_id);
        }

        if (start_date) {
            query += ` AND date(sc.shift_start) >= date(?)`;
            params.push(start_date);
        }

        if (end_date) {
            query += ` AND date(sc.shift_start) <= date(?)`;
            params.push(end_date);
        }

        if (status) {
            query += ` AND sc.status = ?`;
            params.push(status);
        }

        query += ` ORDER BY sc.shift_start DESC LIMIT ?`;
        params.push(parseInt(limit));

        const shifts = db.prepare(query).all(...params);

        res.json({
            status: 'ok',
            shifts: shifts.map(s => ({
                ...s,
                duration_hours: s.shift_end ? calculateDuration(s.shift_start, s.shift_end) : null,
                discrepancy_status: s.discrepancy === 0 ? 'exact' : 
                                   (Math.abs(s.discrepancy) < 10 ? 'minor' : 'major')
            }))
        });
    } catch (error) {
        console.error('Error fetching shift history:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener historial de turnos'
        });
    }
});

/**
 * GET /api/shifts/:shiftId
 * Get detailed shift information
 */
router.get('/:shiftId', async (req, res) => {
    try {
        const db = getDb();
        const { shiftId } = req.params;

        const shift = db.prepare(`
            SELECT 
                sc.*,
                u.username,
                u.full_name,
                cb.username as closed_by_username
            FROM shift_closures sc
            JOIN users u ON sc.waiter_id = u.id
            LEFT JOIN users cb ON sc.closed_by = cb.id
            WHERE sc.id = ?
        `).get(shiftId);

        if (!shift) {
            return res.status(404).json({
                status: 'error',
                message: 'Turno no encontrado'
            });
        }

        // Get all sales during this shift
        const sales = db.prepare(`
            SELECT *
            FROM sales
            WHERE waiter_id = ?
            AND created_at BETWEEN ? AND COALESCE(?, datetime('now'))
            ORDER BY created_at DESC
        `).all(shift.waiter_id, shift.shift_start, shift.shift_end);

        // Get payment breakdown
        const payment_breakdown = db.prepare(`
            SELECT 
                payment_method,
                COUNT(*) as count,
                SUM(total) as total
            FROM sales
            WHERE waiter_id = ?
            AND created_at BETWEEN ? AND COALESCE(?, datetime('now'))
            GROUP BY payment_method
        `).all(shift.waiter_id, shift.shift_start, shift.shift_end);

        res.json({
            status: 'ok',
            shift: {
                ...shift,
                duration_hours: shift.shift_end ? calculateDuration(shift.shift_start, shift.shift_end) : null,
                discrepancy_status: shift.discrepancy === 0 ? 'exact' : 
                                   (Math.abs(shift.discrepancy) < 10 ? 'minor' : 'major')
            },
            sales,
            payment_breakdown
        });
    } catch (error) {
        console.error('Error fetching shift details:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener detalles del turno'
        });
    }
});

/**
 * GET /api/shifts/stats/discrepancies
 * Get discrepancy statistics
 */
router.get('/stats/discrepancies', authorizeRole('admin', 'manager'), async (req, res) => {
    try {
        const db = getDb();
        const { start_date, end_date } = req.query;

        let dateFilter = '';
        const params = [];

        if (start_date && end_date) {
            dateFilter = 'WHERE date(shift_start) BETWEEN date(?) AND date(?)';
            params.push(start_date, end_date);
        }

        // Overall statistics
        const stats = db.prepare(`
            SELECT 
                COUNT(*) as total_shifts,
                COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_shifts,
                AVG(CASE WHEN status = 'closed' THEN discrepancy END) as avg_discrepancy,
                SUM(CASE WHEN ABS(discrepancy) > 50 THEN 1 ELSE 0 END) as major_discrepancies,
                SUM(CASE WHEN discrepancy = 0 THEN 1 ELSE 0 END) as exact_matches
            FROM shift_closures
            ${dateFilter}
        `).get(...params);

        // By waiter
        const byWaiter = db.prepare(`
            SELECT 
                u.username,
                u.full_name,
                COUNT(*) as shift_count,
                AVG(sc.discrepancy) as avg_discrepancy,
                SUM(ABS(sc.discrepancy)) as total_discrepancy,
                SUM(CASE WHEN ABS(sc.discrepancy) > 50 THEN 1 ELSE 0 END) as major_count
            FROM shift_closures sc
            JOIN users u ON sc.waiter_id = u.id
            ${dateFilter}
            AND sc.status = 'closed'
            GROUP BY sc.waiter_id
            ORDER BY total_discrepancy DESC
        `).all(...params);

        res.json({
            status: 'ok',
            stats,
            by_waiter: byWaiter
        });
    } catch (error) {
        console.error('Error fetching discrepancy stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener estadísticas de discrepancias'
        });
    }
});

// Helper function to calculate duration in hours
function calculateDuration(start, end = null) {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffMs = endDate - startDate;
    return (diffMs / (1000 * 60 * 60)).toFixed(2);
}

module.exports = router;
