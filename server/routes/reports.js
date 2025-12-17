/**
 * Anti-Robbery Reports Route
 * Endpoint: /api/reports
 * 
 * Provides analytics to detect suspicious patterns:
 * - Excessive discounts by waiter
 * - Unusual cancellations
 * - Price manipulation attempts
 * - Waste tracking anomalies
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database').db;
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// ONLY admin and manager can access reports
router.use(authenticateToken);
router.use(authorizeRole('admin', 'manager'));

/**
 * GET /api/reports/discounts
 * Discount abuse report - shows discounts by waiter
 */
router.get('/discounts', (req, res) => {
  try {
    const { start_date, end_date, threshold } = req.query;
    
    let query = `
      SELECT 
        d.id,
        d.order_number,
        d.amount as discount_amount,
        d.reason,
        d.authorized_by_username as manager_pin_used,
        u.username as waiter_username,
        u.full_name as waiter_name,
        o.table_id,
        o.subtotal as order_subtotal,
        ROUND((d.amount * 100.0 / o.subtotal), 2) as discount_percentage,
        d.created_at
      FROM discounts d
      JOIN orders o ON d.order_id = o.id
      LEFT JOIN users u ON o.waiter_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (start_date) {
      query += ` AND DATE(d.created_at) >= DATE(?)`;
      params.push(start_date);
    }
    if (end_date) {
      query += ` AND DATE(d.created_at) <= DATE(?)`;
      params.push(end_date);
    }
    if (threshold) {
      query += ` AND (d.amount * 100.0 / o.subtotal) > ?`;
      params.push(parseFloat(threshold));
    }
    
    query += ` ORDER BY d.created_at DESC`;
    
    const stmt = db.prepare(query);
    const discounts = stmt.all(...params);
    
    // Calculate summary by waiter
    const waiterSummary = {};
    discounts.forEach(d => {
      const key = d.waiter_username || 'Unknown';
      if (!waiterSummary[key]) {
        waiterSummary[key] = {
          waiter_name: d.waiter_name || 'Unknown',
          total_discounts: 0,
          discount_count: 0,
          total_discounted: 0,
          avg_discount_pct: 0
        };
      }
      waiterSummary[key].total_discounts += d.discount_amount;
      waiterSummary[key].total_discounted += d.order_subtotal;
      waiterSummary[key].discount_count++;
    });
    
    // Calculate averages
    Object.keys(waiterSummary).forEach(key => {
      waiterSummary[key].avg_discount_pct = 
        (waiterSummary[key].total_discounts / waiterSummary[key].total_discounted * 100).toFixed(2);
    });
    
    res.json({
      discounts,
      summary_by_waiter: waiterSummary,
      total_discounts: discounts.reduce((sum, d) => sum + d.discount_amount, 0),
      count: discounts.length
    });
    
  } catch (error) {
    console.error('Error fetching discount report:', error);
    res.status(500).json({ error: 'Failed to fetch discount report' });
  }
});

/**
 * GET /api/reports/cancellations
 * Cancelled orders report
 */
router.get('/cancellations', (req, res) => {
  try {
    const { start_date, end_date, waiter_id } = req.query;
    
    let query = `
      SELECT 
        al.id,
        al.action,
        al.username,
        al.user_id,
        u.full_name as user_name,
        al.table_number,
        al.order_number,
        json_extract(al.details, '$.reason') as cancellation_reason,
        json_extract(al.details, '$.subtotal') as order_value,
        al.created_at
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.action = 'CANCEL_ORDER'
    `;
    
    const params = [];
    
    if (start_date) {
      query += ` AND DATE(al.created_at) >= DATE(?)`;
      params.push(start_date);
    }
    if (end_date) {
      query += ` AND DATE(al.created_at) <= DATE(?)`;
      params.push(end_date);
    }
    if (waiter_id) {
      query += ` AND al.user_id = ?`;
      params.push(parseInt(waiter_id));
    }
    
    query += ` ORDER BY al.created_at DESC`;
    
    const stmt = db.prepare(query);
    const cancellations = stmt.all(...params);
    
    // Summary by user
    const userSummary = {};
    cancellations.forEach(c => {
      const key = c.username || 'Unknown';
      if (!userSummary[key]) {
        userSummary[key] = {
          user_name: c.user_name || 'Unknown',
          cancellation_count: 0,
          total_value_cancelled: 0
        };
      }
      userSummary[key].cancellation_count++;
      if (c.order_value) {
        userSummary[key].total_value_cancelled += parseFloat(c.order_value);
      }
    });
    
    res.json({
      cancellations,
      summary_by_user: userSummary,
      total_cancelled: cancellations.length
    });
    
  } catch (error) {
    console.error('Error fetching cancellation report:', error);
    res.status(500).json({ error: 'Failed to fetch cancellation report' });
  }
});

/**
 * GET /api/reports/waste
 * Waste/Merma tracking report
 */
router.get('/waste', (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let query = `
      SELECT 
        w.id,
        w.menu_item_id,
        m.name_en as item_name,
        m.category_en as category,
        w.quantity,
        w.reason,
        w.cost_impact,
        u.username as reported_by,
        u.full_name as reporter_name,
        w.created_at
      FROM waste_tracking w
      JOIN menu_items m ON w.menu_item_id = m.id
      LEFT JOIN users u ON w.reported_by_user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (start_date) {
      query += ` AND DATE(w.created_at) >= DATE(?)`;
      params.push(start_date);
    }
    if (end_date) {
      query += ` AND DATE(w.created_at) <= DATE(?)`;
      params.push(end_date);
    }
    
    query += ` ORDER BY w.created_at DESC`;
    
    const stmt = db.prepare(query);
    const waste = stmt.all(...params);
    
    // Calculate totals
    const total_cost_impact = waste.reduce((sum, w) => sum + (w.cost_impact || 0), 0);
    const total_items_wasted = waste.reduce((sum, w) => sum + w.quantity, 0);
    
    // Group by category
    const categoryBreakdown = {};
    waste.forEach(w => {
      const cat = w.category || 'Unknown';
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = {
          count: 0,
          total_cost: 0
        };
      }
      categoryBreakdown[cat].count += w.quantity;
      categoryBreakdown[cat].total_cost += (w.cost_impact || 0);
    });
    
    res.json({
      waste_entries: waste,
      total_cost_impact,
      total_items_wasted,
      category_breakdown: categoryBreakdown,
      count: waste.length
    });
    
  } catch (error) {
    console.error('Error fetching waste report:', error);
    res.status(500).json({ error: 'Failed to fetch waste report' });
  }
});

/**
 * GET /api/reports/suspicious-patterns
 * Advanced analytics to detect suspicious behavior
 */
router.get('/suspicious-patterns', (req, res) => {
  try {
    const alerts = [];
    
    // 1. Waiters with excessive discount rate (>15% of sales)
    const highDiscountWaiters = db.prepare(`
      SELECT 
        u.id,
        u.username,
        u.full_name,
        COUNT(DISTINCT d.id) as discount_count,
        SUM(d.amount) as total_discounts,
        SUM(o.subtotal) as total_sales,
        ROUND((SUM(d.amount) * 100.0 / SUM(o.subtotal)), 2) as discount_percentage
      FROM users u
      JOIN orders o ON u.id = o.waiter_id
      LEFT JOIN discounts d ON o.id = d.order_id
      WHERE u.role = 'waiter'
        AND o.created_at >= DATE('now', '-30 days')
      GROUP BY u.id
      HAVING discount_percentage > 15
      ORDER BY discount_percentage DESC
    `).all();
    
    if (highDiscountWaiters.length > 0) {
      alerts.push({
        severity: 'HIGH',
        type: 'EXCESSIVE_DISCOUNTS',
        description: 'Waiters with discount rate >15% in last 30 days',
        affected_users: highDiscountWaiters
      });
    }
    
    // 2. High cancellation rate (>5% of orders)
    const highCancellationWaiters = db.prepare(`
      SELECT 
        u.id,
        u.username,
        u.full_name,
        COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelled_count,
        COUNT(o.id) as total_orders,
        ROUND((COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) * 100.0 / COUNT(o.id)), 2) as cancellation_rate
      FROM users u
      JOIN orders o ON u.id = o.waiter_id
      WHERE u.role = 'waiter'
        AND o.created_at >= DATE('now', '-30 days')
      GROUP BY u.id
      HAVING cancellation_rate > 5
      ORDER BY cancellation_rate DESC
    `).all();
    
    if (highCancellationWaiters.length > 0) {
      alerts.push({
        severity: 'MEDIUM',
        type: 'HIGH_CANCELLATION_RATE',
        description: 'Waiters with >5% cancellation rate in last 30 days',
        affected_users: highCancellationWaiters
      });
    }
    
    // 3. Large discounts without manager auth (should not happen if system works correctly)
    const unauthorizedDiscounts = db.prepare(`
      SELECT 
        d.*,
        o.waiter_id,
        u.username as waiter
      FROM discounts d
      JOIN orders o ON d.order_id = o.id
      LEFT JOIN users u ON o.waiter_id = u.id
      WHERE d.authorized_by_username IS NULL
        AND d.amount > 100
        AND d.created_at >= DATE('now', '-7 days')
      ORDER BY d.amount DESC
    `).all();
    
    if (unauthorizedDiscounts.length > 0) {
      alerts.push({
        severity: 'CRITICAL',
        type: 'UNAUTHORIZED_DISCOUNTS',
        description: 'Large discounts (>$100) without manager authorization in last 7 days',
        entries: unauthorizedDiscounts
      });
    }
    
    // 4. Waste above threshold ($500/week)
    const weeklyWaste = db.prepare(`
      SELECT 
        SUM(cost_impact) as total_waste,
        COUNT(*) as entry_count
      FROM waste_tracking
      WHERE created_at >= DATE('now', '-7 days')
    `).get();
    
    if (weeklyWaste.total_waste > 500) {
      alerts.push({
        severity: 'MEDIUM',
        type: 'HIGH_WASTE',
        description: `Weekly waste exceeds $500 threshold`,
        total_waste: weeklyWaste.total_waste,
        entry_count: weeklyWaste.entry_count
      });
    }
    
    // 5. Orders modified after submission
    const modifiedOrders = db.prepare(`
      SELECT 
        al.order_number,
        al.username,
        al.table_number,
        al.created_at,
        COUNT(*) as modification_count
      FROM audit_logs al
      WHERE al.action IN ('UPDATE_ORDER_STATUS', 'UPDATE_ITEM_STATUS')
        AND al.created_at >= DATE('now', '-7 days')
      GROUP BY al.order_number
      HAVING modification_count > 10
      ORDER BY modification_count DESC
      LIMIT 20
    `).all();
    
    if (modifiedOrders.length > 0) {
      alerts.push({
        severity: 'LOW',
        type: 'EXCESSIVE_MODIFICATIONS',
        description: 'Orders with >10 modifications in last 7 days',
        orders: modifiedOrders
      });
    }
    
    res.json({
      generated_at: new Date().toISOString(),
      alert_count: alerts.length,
      alerts
    });
    
  } catch (error) {
    console.error('Error generating suspicious patterns:', error);
    res.status(500).json({ error: 'Failed to generate suspicious patterns report' });
  }
});

/**
 * GET /api/reports/audit-log
 * Complete audit log with filters
 */
router.get('/audit-log', (req, res) => {
  try {
    const { 
      start_date, 
      end_date, 
      action, 
      user_id, 
      table_number,
      limit = 100 
    } = req.query;
    
    let query = `
      SELECT 
        al.*,
        u.full_name as user_full_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (start_date) {
      query += ` AND DATE(al.created_at) >= DATE(?)`;
      params.push(start_date);
    }
    if (end_date) {
      query += ` AND DATE(al.created_at) <= DATE(?)`;
      params.push(end_date);
    }
    if (action) {
      query += ` AND al.action = ?`;
      params.push(action);
    }
    if (user_id) {
      query += ` AND al.user_id = ?`;
      params.push(parseInt(user_id));
    }
    if (table_number) {
      query += ` AND al.table_number = ?`;
      params.push(parseInt(table_number));
    }
    
    query += ` ORDER BY al.created_at DESC LIMIT ?`;
    params.push(parseInt(limit));
    
    const stmt = db.prepare(query);
    const logs = stmt.all(...params);
    
    res.json({
      logs,
      count: logs.length,
      limit: parseInt(limit)
    });
    
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
});

/**
 * GET /api/reports/dashboard
 * Executive dashboard with key metrics and alerts
 */
router.get('/dashboard', (req, res) => {
  try {
    // Today's key metrics
    const today = db.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as completed_orders
      FROM orders
      WHERE DATE(created_at) = DATE('now')
    `).get();
    
    const todaySales = db.prepare(`
      SELECT 
        COUNT(*) as transaction_count,
        SUM(total) as total_revenue,
        SUM(tip) as total_tips,
        AVG(total) as avg_ticket
      FROM sales
      WHERE DATE(created_at) = DATE('now')
    `).get();
    
    const todayDiscounts = db.prepare(`
      SELECT 
        COUNT(*) as discount_count,
        SUM(amount) as total_discounted
      FROM discounts
      WHERE DATE(created_at) = DATE('now')
    `).get();
    
    // Active tables right now
    const activeTables = db.prepare(`
      SELECT COUNT(*) as count
      FROM tables
      WHERE status = 'occupied'
    `).get();
    
    // Pending orders in kitchen/bar
    const pendingKitchen = db.prepare(`
      SELECT COUNT(*) as count
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.status IN ('pending', 'preparing')
        AND mi.category_en NOT IN ('Margaritas', 'Cocktails', 'Beer', 'Wine')
    `).get();
    
    const pendingBar = db.prepare(`
      SELECT COUNT(*) as count
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.status IN ('pending', 'preparing')
        AND mi.category_en IN ('Margaritas', 'Cocktails', 'Beer', 'Wine')
    `).get();
    
    res.json({
      timestamp: new Date().toISOString(),
      today: {
        orders: today,
        sales: todaySales,
        discounts: todayDiscounts,
        discount_percentage: todaySales.total_revenue > 0 
          ? ((todayDiscounts.total_discounted / todaySales.total_revenue) * 100).toFixed(2)
          : 0
      },
      current: {
        active_tables: activeTables.count,
        pending_kitchen: pendingKitchen.count,
        pending_bar: pendingBar.count
      }
    });
    
  } catch (error) {
    console.error('Error generating dashboard:', error);
    res.status(500).json({ error: 'Failed to generate dashboard' });
  }
});

module.exports = router;
