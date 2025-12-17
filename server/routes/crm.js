const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All CRM routes require authentication
router.use(authenticateToken);

/**
 * POST /api/crm/customers
 * Create new customer with GDPR consent
 */
router.post('/customers', async (req, res) => {
    try {
        const db = getDb();
        const {
            email,
            phone,
            first_name,
            last_name,
            birthday,
            dietary_restrictions,
            allergens,
            marketing_consent,
            gdpr_consent_ip
        } = req.body;

        // Validate consent
        if (!req.body.data_processing_consent) {
            return res.status(400).json({
                status: 'error',
                message: 'Se requiere consentimiento para procesamiento de datos'
            });
        }

        const result = db.prepare(`
            INSERT INTO customers (
                email, phone, first_name, last_name, birthday,
                dietary_restrictions, allergens, marketing_consent,
                data_processing_consent, consent_date, gdpr_consent_ip
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), ?)
        `).run(
            email, phone, first_name, last_name, birthday,
            dietary_restrictions, allergens, marketing_consent || 0,
            gdpr_consent_ip || req.ip
        );

        // Log audit
        db.prepare(`
            INSERT INTO audit_logs (user_id, action, table_name, details)
            VALUES (?, 'CREATE', 'customers', ?)
        `).run(req.user.id, `Nuevo cliente: ${email || phone}`);

        res.json({
            status: 'ok',
            customer_id: result.lastInsertRowid,
            message: 'Cliente registrado exitosamente'
        });
    } catch (error) {
        console.error('Error creating customer:', error);
        if (error.message.includes('UNIQUE')) {
            return res.status(400).json({
                status: 'error',
                message: 'El email o teléfono ya está registrado'
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error al crear cliente'
        });
    }
});

/**
 * GET /api/crm/customers
 * Get customers list
 */
router.get('/customers', authorizeRole('admin', 'manager'), async (req, res) => {
    try {
        const db = getDb();
        const { search, limit = 50 } = req.query;

        let query = `
            SELECT 
                id, email, phone, first_name, last_name, birthday,
                dietary_restrictions, allergens, total_visits, total_spent,
                last_visit_date, marketing_consent, created_at
            FROM customers
            WHERE status = 'active'
        `;

        const params = [];

        if (search) {
            query += ` AND (email LIKE ? OR phone LIKE ? OR first_name LIKE ? OR last_name LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        query += ` ORDER BY total_visits DESC, last_visit_date DESC LIMIT ?`;
        params.push(parseInt(limit));

        const customers = db.prepare(query).all(...params);

        res.json({
            status: 'ok',
            customers
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener clientes'
        });
    }
});

/**
 * GET /api/crm/customers/:customerId
 * Get customer details with visit history
 */
router.get('/customers/:customerId', authorizeRole('admin', 'manager', 'waiter'), async (req, res) => {
    try {
        const db = getDb();
        const { customerId } = req.params;

        const customer = db.prepare(`
            SELECT * FROM customers WHERE id = ? AND status = 'active'
        `).get(customerId);

        if (!customer) {
            return res.status(404).json({
                status: 'error',
                message: 'Cliente no encontrado'
            });
        }

        // Get visit history
        const visits = db.prepare(`
            SELECT 
                cv.*,
                u.full_name as waiter_name
            FROM customer_visits cv
            LEFT JOIN users u ON cv.waiter_id = u.id
            WHERE cv.customer_id = ?
            ORDER BY cv.visit_date DESC
            LIMIT 20
        `).all(customerId);

        res.json({
            status: 'ok',
            customer,
            visits
        });
    } catch (error) {
        console.error('Error fetching customer details:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener detalles del cliente'
        });
    }
});

/**
 * POST /api/crm/visits
 * Log customer visit
 */
router.post('/visits', async (req, res) => {
    try {
        const db = getDb();
        const {
            customer_id,
            table_id,
            party_size,
            total_spent,
            items_ordered,
            special_occasion,
            satisfaction_rating,
            feedback
        } = req.body;

        // Insert visit
        const result = db.prepare(`
            INSERT INTO customer_visits (
                customer_id, table_id, waiter_id, party_size,
                total_spent, items_ordered, special_occasion,
                satisfaction_rating, feedback
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            customer_id, table_id, req.user.id, party_size,
            total_spent, items_ordered, special_occasion,
            satisfaction_rating, feedback
        );

        // Update customer totals
        db.prepare(`
            UPDATE customers SET
                total_visits = total_visits + 1,
                total_spent = total_spent + ?,
                last_visit_date = datetime('now')
            WHERE id = ?
        `).run(total_spent || 0, customer_id);

        res.json({
            status: 'ok',
            visit_id: result.lastInsertRowid,
            message: 'Visita registrada exitosamente'
        });
    } catch (error) {
        console.error('Error logging visit:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al registrar visita'
        });
    }
});

/**
 * GET /api/crm/stats
 * Get CRM statistics
 */
router.get('/stats', authorizeRole('admin', 'manager'), async (req, res) => {
    try {
        const db = getDb();

        const stats = db.prepare(`
            SELECT 
                COUNT(*) as total_customers,
                COUNT(CASE WHEN marketing_consent = 1 THEN 1 END) as marketing_opt_in,
                SUM(total_visits) as total_visits,
                SUM(total_spent) as lifetime_value,
                AVG(total_spent) as avg_customer_value
            FROM customers
            WHERE status = 'active'
        `).get();

        const segments = {
            new_customers: db.prepare(`
                SELECT COUNT(*) as count FROM customers
                WHERE created_at >= date('now', '-30 days')
            `).get().count,
            
            vip_customers: db.prepare(`
                SELECT COUNT(*) as count FROM customers
                WHERE total_spent > 5000
            `).get().count,
            
            regulars: db.prepare(`
                SELECT COUNT(*) as count FROM customers
                WHERE total_visits >= 5
            `).get().count,

            birthdays_this_month: db.prepare(`
                SELECT COUNT(*) as count FROM customers
                WHERE strftime('%m', birthday) = strftime('%m', 'now')
            `).get().count
        };

        res.json({
            status: 'ok',
            stats,
            segments
        });
    } catch (error) {
        console.error('Error fetching CRM stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener estadísticas CRM'
        });
    }
});

/**
 * PUT /api/crm/customers/:customerId/consent
 * Update marketing consent (GDPR)
 */
router.put('/customers/:customerId/consent', async (req, res) => {
    try {
        const db = getDb();
        const { customerId } = req.params;
        const { marketing_consent } = req.body;

        db.prepare(`
            UPDATE customers SET
                marketing_consent = ?,
                updated_at = datetime('now')
            WHERE id = ?
        `).run(marketing_consent ? 1 : 0, customerId);

        // Log audit
        db.prepare(`
            INSERT INTO audit_logs (user_id, action, table_name, details)
            VALUES (?, 'UPDATE', 'customers', ?)
        `).run(
            req.user.id,
            `Cliente ${customerId}: ${marketing_consent ? 'Aceptó' : 'Revocó'} consentimiento de marketing`
        );

        res.json({
            status: 'ok',
            message: 'Consentimiento actualizado'
        });
    } catch (error) {
        console.error('Error updating consent:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar consentimiento'
        });
    }
});

/**
 * DELETE /api/crm/customers/:customerId
 * GDPR compliant data deletion
 */
router.delete('/customers/:customerId', authorizeRole('admin'), async (req, res) => {
    try {
        const db = getDb();
        const { customerId } = req.params;

        // Soft delete - mark as deleted but keep for regulatory compliance
        db.prepare(`
            UPDATE customers SET
                status = 'deleted',
                email = NULL,
                phone = NULL,
                first_name = 'DELETED',
                last_name = 'USER',
                updated_at = datetime('now')
            WHERE id = ?
        `).run(customerId);

        // Log audit
        db.prepare(`
            INSERT INTO audit_logs (user_id, action, table_name, details)
            VALUES (?, 'DELETE', 'customers', ?)
        `).run(req.user.id, `Cliente ${customerId} eliminado (GDPR)`);

        res.json({
            status: 'ok',
            message: 'Datos del cliente eliminados según GDPR'
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar cliente'
        });
    }
});

module.exports = router;
