/**
 * Security & Anti-Theft Routes
 * Funcionalidades de prevención de robos y control de seguridad
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database').db;
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Aliases para compatibilidad
const requireAuth = authenticateToken;
const requireRole = (roles) => authorizeRole(...roles);

// ============================================================================
// DISCOUNT SECURITY
// ============================================================================

/**
 * GET /api/security/discount-patterns
 * Analiza patrones sospechosos de descuentos
 */
router.get('/discount-patterns', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
    try {
        const { days = 7, threshold = 3 } = req.query;
        
        // Meseros con alta frecuencia de descuentos
        const frequentDiscounters = db.prepare(`
            SELECT 
                u.full_name,
                u.username,
                COUNT(*) as discount_count,
                AVG(o.discount_amount) as avg_discount,
                SUM(o.discount_amount) as total_discounts,
                SUM(o.total_amount) as total_sales,
                (SUM(o.discount_amount) * 100.0 / SUM(o.total_amount)) as discount_percentage
            FROM orders o
            JOIN users u ON o.waiter_id = u.id
            WHERE o.discount_amount > 0
                AND o.created_at >= datetime('now', '-' || ? || ' days')
            GROUP BY u.id
            HAVING discount_count >= ?
            ORDER BY discount_percentage DESC
        `).all(days, threshold);

        // Descuentos por encima del promedio
        const unusualDiscounts = db.prepare(`
            SELECT 
                o.order_number,
                o.discount_amount,
                o.discount_reason,
                o.total_amount,
                (o.discount_amount * 100.0 / o.total_amount) as discount_percent,
                u.full_name as waiter_name,
                o.created_at
            FROM orders o
            JOIN users u ON o.waiter_id = u.id
            WHERE o.discount_amount > (
                SELECT AVG(discount_amount) * 2 
                FROM orders 
                WHERE discount_amount > 0
            )
            AND o.created_at >= datetime('now', '-' || ? || ' days')
            ORDER BY o.discount_amount DESC
        `).all(days);

        // Horarios con más descuentos
        const discountsByHour = db.prepare(`
            SELECT 
                strftime('%H', created_at) as hour,
                COUNT(*) as discount_count,
                AVG(discount_amount) as avg_amount,
                SUM(discount_amount) as total_amount
            FROM orders
            WHERE discount_amount > 0
                AND created_at >= datetime('now', '-' || ? || ' days')
            GROUP BY hour
            ORDER BY total_amount DESC
        `).all(days);

        res.json({
            status: 'ok',
            data: {
                frequent_discounters: frequentDiscounters,
                unusual_discounts: unusualDiscounts,
                discounts_by_hour: discountsByHour
            }
        });

    } catch (error) {
        console.error('Error analyzing discount patterns:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/security/discount-approval
 * Solicitar aprobación para descuento grande
 */
router.post('/discount-approval', requireAuth, (req, res) => {
    try {
        const { order_id, discount_amount, reason } = req.body;
        
        const stmt = db.prepare(`
            INSERT INTO discount_approvals (
                order_id, requested_by, discount_amount, reason, status
            ) VALUES (?, ?, ?, ?, 'pending')
        `);
        
        const result = stmt.run(order_id, req.user.id, discount_amount, reason);
        
        // TODO: Enviar notificación al manager
        
        res.json({
            status: 'ok',
            approval_id: result.lastInsertRowid,
            message: 'Aprobación solicitada. Esperando manager.'
        });

    } catch (error) {
        console.error('Error requesting discount approval:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/security/discount-approval/:id
 * Aprobar o rechazar descuento
 */
router.put('/discount-approval/:id', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body; // 'approved' or 'rejected'
        
        const stmt = db.prepare(`
            UPDATE discount_approvals
            SET status = ?,
                approved_by = ?,
                approved_at = datetime('now'),
                notes = ?
            WHERE id = ?
        `);
        
        stmt.run(status, req.user.id, notes || null, id);
        
        res.json({
            status: 'ok',
            message: `Descuento ${status === 'approved' ? 'aprobado' : 'rechazado'}`
        });

    } catch (error) {
        console.error('Error processing discount approval:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// CASH HANDLING SECURITY
// ============================================================================

/**
 * GET /api/security/cash-variances
 * Analizar variaciones de efectivo sospechosas
 */
router.get('/cash-variances', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
    try {
        const { days = 30 } = req.query;
        
        // Turnos con discrepancias mayores
        const largeVariances = db.prepare(`
            SELECT 
                sc.id,
                sc.opened_at,
                sc.closed_at,
                u.full_name as waiter_name,
                sc.expected_cash,
                sc.final_cash,
                sc.cash_difference,
                sc.discrepancy_level,
                sc.notes
            FROM shift_closures sc
            JOIN users u ON sc.waiter_id = u.id
            WHERE ABS(sc.cash_difference) > 100
                AND sc.closed_at >= datetime('now', '-' || ? || ' days')
            ORDER BY ABS(sc.cash_difference) DESC
        `).all(days);

        // Meseros con faltantes frecuentes
        const frequentShortages = db.prepare(`
            SELECT 
                u.full_name,
                u.username,
                COUNT(*) as shortage_count,
                AVG(sc.cash_difference) as avg_difference,
                SUM(CASE WHEN sc.cash_difference < 0 THEN ABS(sc.cash_difference) ELSE 0 END) as total_short,
                SUM(CASE WHEN sc.cash_difference > 0 THEN sc.cash_difference ELSE 0 END) as total_over
            FROM shift_closures sc
            JOIN users u ON sc.waiter_id = u.id
            WHERE sc.closed_at >= datetime('now', '-' || ? || ' days')
            GROUP BY u.id
            HAVING COUNT(CASE WHEN ABS(sc.cash_difference) > 50 THEN 1 END) >= 2
            ORDER BY total_short DESC
        `).all(days);

        // Patrón de variaciones por día de semana
        const variancesByDay = db.prepare(`
            SELECT 
                CASE CAST(strftime('%w', closed_at) AS INTEGER)
                    WHEN 0 THEN 'Domingo'
                    WHEN 1 THEN 'Lunes'
                    WHEN 2 THEN 'Martes'
                    WHEN 3 THEN 'Miércoles'
                    WHEN 4 THEN 'Jueves'
                    WHEN 5 THEN 'Viernes'
                    WHEN 6 THEN 'Sábado'
                END as day_name,
                COUNT(*) as shift_count,
                AVG(cash_difference) as avg_variance,
                SUM(CASE WHEN cash_difference < 0 THEN 1 ELSE 0 END) as shortage_count
            FROM shift_closures
            WHERE closed_at >= datetime('now', '-' || ? || ' days')
            GROUP BY strftime('%w', closed_at)
            ORDER BY shortage_count DESC
        `).all(days);

        res.json({
            status: 'ok',
            data: {
                large_variances: largeVariances,
                frequent_shortages: frequentShortages,
                variances_by_day: variancesByDay
            }
        });

    } catch (error) {
        console.error('Error analyzing cash variances:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/security/variance-photo
 * Upload photo de efectivo para turno con discrepancia
 */
router.post('/variance-photo', requireAuth, (req, res) => {
    try {
        const { shift_id, photo_data } = req.body;
        
        // TODO: Implementar guardado de imagen (base64 o cloud storage)
        // Por ahora solo guardamos referencia
        
        const stmt = db.prepare(`
            UPDATE shift_closures
            SET variance_photo = ?,
                photo_uploaded_at = datetime('now')
            WHERE id = ?
        `);
        
        stmt.run(photo_data, shift_id);
        
        res.json({
            status: 'ok',
            message: 'Foto de efectivo registrada'
        });

    } catch (error) {
        console.error('Error uploading variance photo:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// VOID/CANCEL TRACKING
// ============================================================================

/**
 * GET /api/security/void-patterns
 * Analizar patrones de órdenes canceladas/anuladas
 */
router.get('/void-patterns', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
    try {
        const { days = 7 } = req.query;
        
        // Meseros con muchas cancelaciones
        const frequentVoiders = db.prepare(`
            SELECT 
                u.full_name,
                u.username,
                COUNT(*) as void_count,
                SUM(o.total_amount) as total_voided_amount,
                COUNT(*) * 100.0 / (
                    SELECT COUNT(*) 
                    FROM orders o2 
                    WHERE o2.waiter_id = u.id
                ) as void_percentage
            FROM orders o
            JOIN users u ON o.waiter_id = u.id
            WHERE o.status = 'cancelled'
                AND o.created_at >= datetime('now', '-' || ? || ' days')
            GROUP BY u.id
            HAVING void_count >= 3
            ORDER BY void_count DESC
        `).all(days);

        // Cancelaciones por hora
        const voidsByHour = db.prepare(`
            SELECT 
                strftime('%H', created_at) as hour,
                COUNT(*) as void_count,
                SUM(total_amount) as total_amount
            FROM orders
            WHERE status = 'cancelled'
                AND created_at >= datetime('now', '-' || ? || ' days')
            GROUP BY hour
            ORDER BY void_count DESC
        `).all(days);

        res.json({
            status: 'ok',
            data: {
                frequent_voiders: frequentVoiders,
                voids_by_hour: voidsByHour
            }
        });

    } catch (error) {
        console.error('Error analyzing void patterns:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// WASTE FRAUD DETECTION
// ============================================================================

/**
 * GET /api/security/waste-fraud
 * Detectar posibles fraudes en registro de mermas
 */
router.get('/waste-fraud', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
    try {
        const { days = 30 } = req.query;
        
        // Alta frecuencia de "customer complaint"
        const suspiciousComplaints = db.prepare(`
            SELECT 
                u.full_name,
                COUNT(*) as complaint_count,
                SUM(wl.quantity * m.cost) as total_cost,
                GROUP_CONCAT(DISTINCT m.name) as items
            FROM waste_logs wl
            JOIN menu_items m ON wl.item_id = m.id
            JOIN users u ON wl.logged_by = u.id
            WHERE wl.reason = 'customer_complaint'
                AND wl.created_at >= datetime('now', '-' || ? || ' days')
            GROUP BY u.id
            HAVING complaint_count >= 5
            ORDER BY complaint_count DESC
        `).all(days);

        // Items con merma desproporcionada vs ventas
        const disproportionateWaste = db.prepare(`
            SELECT 
                m.name,
                m.category,
                COALESCE(SUM(wl.quantity), 0) as waste_quantity,
                COALESCE(SUM(oi.quantity), 0) as sold_quantity,
                (COALESCE(SUM(wl.quantity), 0) * 100.0 / NULLIF(COALESCE(SUM(oi.quantity), 0), 0)) as waste_percentage
            FROM menu_items m
            LEFT JOIN waste_logs wl ON m.id = wl.item_id 
                AND wl.created_at >= datetime('now', '-' || ? || ' days')
            LEFT JOIN order_items oi ON m.id = oi.item_id
                AND oi.created_at >= datetime('now', '-' || ? || ' days')
            WHERE m.is_available = 1
            GROUP BY m.id
            HAVING waste_percentage > 20
            ORDER BY waste_percentage DESC
        `).all(days, days);

        res.json({
            status: 'ok',
            data: {
                suspicious_complaints: suspiciousComplaints,
                disproportionate_waste: disproportionateWaste
            }
        });

    } catch (error) {
        console.error('Error detecting waste fraud:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// COMPREHENSIVE SECURITY SCORE
// ============================================================================

/**
 * GET /api/security/score/:userId
 * Calcular score de seguridad para un empleado
 */
router.get('/score/:userId', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
    try {
        const { userId } = req.params;
        const days = 30;
        
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Factor 1: Discrepancias de efectivo
        const cashScore = db.prepare(`
            SELECT 
                COUNT(*) as total_shifts,
                SUM(CASE WHEN ABS(cash_difference) > 100 THEN 1 ELSE 0 END) as major_discrepancies,
                AVG(ABS(cash_difference)) as avg_discrepancy
            FROM shift_closures
            WHERE waiter_id = ?
                AND closed_at >= datetime('now', '-' || ? || ' days')
        `).get(userId, days);

        // Factor 2: Descuentos excesivos
        const discountScore = db.prepare(`
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN discount_amount > 0 THEN 1 ELSE 0 END) as discount_orders,
                AVG(discount_amount) as avg_discount
            FROM orders
            WHERE waiter_id = ?
                AND created_at >= datetime('now', '-' || ? || ' days')
        `).get(userId, days);

        // Factor 3: Cancelaciones
        const voidScore = db.prepare(`
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
            FROM orders
            WHERE waiter_id = ?
                AND created_at >= datetime('now', '-' || ? || ' days')
        `).get(userId, days);

        // Calcular score (0-100, 100 es mejor)
        let score = 100;
        const reasons = [];

        // Penalizar discrepancias de efectivo
        if (cashScore && cashScore.major_discrepancies > 0) {
            const penalty = cashScore.major_discrepancies * 10;
            score -= penalty;
            reasons.push(`${cashScore.major_discrepancies} discrepancia(s) mayor(es) de efectivo (-${penalty})`);
        }

        // Penalizar descuentos excesivos
        if (discountScore && discountScore.total_orders > 0) {
            const discountRate = (discountScore.discount_orders / discountScore.total_orders) * 100;
            if (discountRate > 30) {
                const penalty = Math.round((discountRate - 30) / 2);
                score -= penalty;
                reasons.push(`Tasa de descuentos alta: ${discountRate.toFixed(1)}% (-${penalty})`);
            }
        }

        // Penalizar cancelaciones
        if (voidScore && voidScore.total_orders > 0) {
            const voidRate = (voidScore.cancelled_orders / voidScore.total_orders) * 100;
            if (voidRate > 10) {
                const penalty = Math.round((voidRate - 10) * 2);
                score -= penalty;
                reasons.push(`Tasa de cancelaciones alta: ${voidRate.toFixed(1)}% (-${penalty})`);
            }
        }

        score = Math.max(0, score);

        let riskLevel = 'low';
        if (score < 50) riskLevel = 'high';
        else if (score < 75) riskLevel = 'medium';

        res.json({
            status: 'ok',
            data: {
                user: {
                    id: user.id,
                    name: user.full_name,
                    username: user.username
                },
                score,
                risk_level: riskLevel,
                factors: {
                    cash: cashScore,
                    discounts: discountScore,
                    voids: voidScore
                },
                reasons,
                period_days: days
            }
        });

    } catch (error) {
        console.error('Error calculating security score:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
