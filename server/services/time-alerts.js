/**
 * Time Alert Service
 * Monitors order preparation times and sends alerts
 * Run this as a background task
 */

const { db } = require('../config/database');
const { notifyTimeAlert } = require('../websocket');

// Configuration (in minutes)
const THRESHOLDS = {
    preparing: 15,    // Alert if preparing > 15 min
    ready: 10,        // Alert if ready but not delivered > 10 min
    pending: 5        // Alert if pending confirmation > 5 min
};

let monitoringInterval = null;

/**
 * Start monitoring orders
 */
function startMonitoring(intervalSeconds = 30) {
    if (monitoringInterval) {
        console.log('⏰ Time alert monitoring already running');
        return;
    }

    console.log(`⏰ Starting time alert monitoring (checking every ${intervalSeconds}s)`);
    
    monitoringInterval = setInterval(() => {
        checkOrderTimes();
    }, intervalSeconds * 1000);

    // Run immediately
    checkOrderTimes();
}

/**
 * Stop monitoring
 */
function stopMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
        console.log('⏰ Time alert monitoring stopped');
    }
}

/**
 * Check all active orders for time violations
 */
function checkOrderTimes() {
    try {
        const activeOrders = db.prepare(`
            SELECT 
                o.id,
                o.order_number,
                o.table_id,
                o.waiter_id,
                o.status,
                o.created_at,
                ROUND((julianday('now') - julianday(o.created_at)) * 24 * 60) as elapsed_minutes
            FROM orders o
            WHERE o.status IN ('pending', 'confirmed', 'preparing', 'ready')
            AND o.created_at > datetime('now', '-2 hours')
        `).all();

        activeOrders.forEach(order => {
            let threshold = 0;
            let shouldAlert = false;

            switch (order.status) {
                case 'pending':
                    threshold = THRESHOLDS.pending;
                    shouldAlert = order.elapsed_minutes > threshold;
                    break;
                
                case 'confirmed':
                case 'preparing':
                    threshold = THRESHOLDS.preparing;
                    shouldAlert = order.elapsed_minutes > threshold;
                    break;
                
                case 'ready':
                    threshold = THRESHOLDS.ready;
                    shouldAlert = order.elapsed_minutes > threshold;
                    break;
            }

            if (shouldAlert) {
                sendAlert(order, threshold);
            }
        });

    } catch (error) {
        console.error('Error checking order times:', error);
    }
}

/**
 * Calculate minutes since timestamp
 */
function calculateMinutes(timestamp) {
    const then = new Date(timestamp);
    const now = new Date();
    return Math.floor((now - then) / (1000 * 60));
}

/**
 * Send time alert
 */
function sendAlert(order, threshold) {
    console.log(`⏰ ALERT: Order ${order.order_number} exceeded threshold (${order.elapsed_minutes}min > ${threshold}min)`);
    
    notifyTimeAlert({
        order_id: order.id,
        order_number: order.order_number,
        table_id: order.table_id,
        waiter_id: order.waiter_id,
        status: order.status,
        elapsed_minutes: order.elapsed_minutes,
        threshold_minutes: threshold
    });

    // Log to audit
    try {
        db.prepare(`
            INSERT INTO audit_logs (user_id, action, table_name, details)
            VALUES (?, 'TIME_ALERT', 'orders', ?)
        `).run(
            order.waiter_id || 1,
            `Orden ${order.order_number} tardó ${order.elapsed_minutes}min (límite: ${threshold}min) - Estado: ${order.status}`
        );
    } catch (error) {
        console.error('Error logging alert:', error);
    }
}

/**
 * Get current configuration
 */
function getConfiguration() {
    return {
        thresholds: THRESHOLDS,
        monitoring: monitoringInterval !== null
    };
}

/**
 * Update thresholds
 */
function updateThresholds(newThresholds) {
    Object.assign(THRESHOLDS, newThresholds);
    console.log('⏰ Time alert thresholds updated:', THRESHOLDS);
}

module.exports = {
    startMonitoring,
    stopMonitoring,
    checkOrderTimes,
    getConfiguration,
    updateThresholds,
    THRESHOLDS
};
