const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

/**
 * GET /api/analytics/performance-times
 * Get average preparation and delivery times
 */
router.get('/performance-times', authenticateToken, authorizeRole('admin', 'manager'), async (req, res) => {
    try {
        const db = getDb();
        const { start_date, end_date, waiter_id } = req.query;

        let dateFilter = '';
        const params = [];

        if (start_date && end_date) {
            dateFilter = 'WHERE date(s.created_at) BETWEEN date(?) AND date(?)';
            params.push(start_date, end_date);
        }

        // Overall averages
        const overall = db.prepare(`
            SELECT 
                COUNT(*) as total_orders,
                AVG(prep_time_minutes) as avg_prep_time,
                MIN(prep_time_minutes) as min_prep_time,
                MAX(prep_time_minutes) as max_prep_time
            FROM sales s
            ${dateFilter}
            AND prep_time_minutes IS NOT NULL
        `).get(...params);

        // By waiter
        const byWaiter = db.prepare(`
            SELECT 
                u.username,
                u.full_name,
                COUNT(*) as order_count,
                AVG(s.prep_time_minutes) as avg_prep_time,
                MIN(s.prep_time_minutes) as min_prep_time,
                MAX(s.prep_time_minutes) as max_prep_time,
                SUM(s.total) as total_sales
            FROM sales s
            JOIN users u ON s.waiter_id = u.id
            ${dateFilter}
            ${waiter_id ? 'AND s.waiter_id = ?' : ''}
            AND s.prep_time_minutes IS NOT NULL
            GROUP BY s.waiter_id
            ORDER BY avg_prep_time ASC
        `).all(...params, ...(waiter_id ? [waiter_id] : []));

        // By hour of day
        const byHour = db.prepare(`
            SELECT 
                CAST(strftime('%H', created_at) AS INTEGER) as hour,
                COUNT(*) as order_count,
                AVG(prep_time_minutes) as avg_prep_time
            FROM sales
            ${dateFilter}
            AND prep_time_minutes IS NOT NULL
            GROUP BY hour
            ORDER BY hour
        `).all(...params);

        // By day of week
        const byDayOfWeek = db.prepare(`
            SELECT 
                CASE CAST(strftime('%w', created_at) AS INTEGER)
                    WHEN 0 THEN 'Domingo'
                    WHEN 1 THEN 'Lunes'
                    WHEN 2 THEN 'Martes'
                    WHEN 3 THEN 'Miércoles'
                    WHEN 4 THEN 'Jueves'
                    WHEN 5 THEN 'Viernes'
                    WHEN 6 THEN 'Sábado'
                END as day_name,
                COUNT(*) as order_count,
                AVG(prep_time_minutes) as avg_prep_time
            FROM sales
            ${dateFilter}
            AND prep_time_minutes IS NOT NULL
            GROUP BY strftime('%w', created_at)
            ORDER BY strftime('%w', created_at)
        `).all(...params);

        res.json({
            status: 'ok',
            analytics: {
                overall,
                by_waiter: byWaiter,
                by_hour: byHour,
                by_day_of_week: byDayOfWeek
            }
        });
    } catch (error) {
        console.error('Error fetching performance times:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener tiempos de rendimiento'
        });
    }
});

/**
 * GET /api/analytics/waiter-comparison
 * Compare waiter performance
 */
router.get('/waiter-comparison', authenticateToken, authorizeRole('admin', 'manager'), async (req, res) => {
    try {
        const db = getDb();
        const { days = 7 } = req.query;

        const comparison = db.prepare(`
            SELECT 
                u.username,
                u.full_name,
                COUNT(DISTINCT s.id) as total_orders,
                SUM(s.total) as total_sales,
                AVG(s.total) as avg_order_value,
                AVG(s.prep_time_minutes) as avg_prep_time,
                COUNT(DISTINCT d.id) as discount_count,
                SUM(d.amount) as total_discounts,
                COUNT(DISTINCT sc.id) as shifts_completed,
                AVG(sc.discrepancy) as avg_cash_discrepancy
            FROM users u
            LEFT JOIN sales s ON u.id = s.waiter_id 
                AND s.created_at >= date('now', '-' || ? || ' days')
            LEFT JOIN discounts d ON d.order_id IN (
                SELECT id FROM orders WHERE waiter_id = u.id 
                AND created_at >= date('now', '-' || ? || ' days')
            )
            LEFT JOIN shift_closures sc ON sc.waiter_id = u.id
                AND sc.status = 'closed'
                AND sc.shift_start >= date('now', '-' || ? || ' days')
            WHERE u.role = 'waiter'
            GROUP BY u.id
            ORDER BY total_sales DESC
        `).all(days, days, days);

        res.json({
            status: 'ok',
            comparison
        });
    } catch (error) {
        console.error('Error fetching waiter comparison:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al comparar meseros'
        });
    }
});

/**
 * GET /api/analytics/peak-times
 * Identify peak service times
 */
router.get('/peak-times', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const { days = 30 } = req.query;

        const peakHours = db.prepare(`
            SELECT 
                CAST(strftime('%H', created_at) AS INTEGER) as hour,
                COUNT(*) as order_count,
                SUM(total) as total_sales,
                AVG(prep_time_minutes) as avg_prep_time,
                COUNT(DISTINCT waiter_id) as active_waiters
            FROM sales
            WHERE created_at >= date('now', '-' || ? || ' days')
            GROUP BY hour
            ORDER BY order_count DESC
        `).all(days);

        const peakDays = db.prepare(`
            SELECT 
                date(created_at) as date,
                COUNT(*) as order_count,
                SUM(total) as total_sales,
                AVG(prep_time_minutes) as avg_prep_time
            FROM sales
            WHERE created_at >= date('now', '-' || ? || ' days')
            GROUP BY date
            ORDER BY order_count DESC
            LIMIT 10
        `).all(days);

        res.json({
            status: 'ok',
            peak_hours: peakHours,
            peak_days: peakDays
        });
    } catch (error) {
        console.error('Error fetching peak times:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener horas pico'
        });
    }
});

module.exports = router;
