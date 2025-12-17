/**
 * WebSocket Manager
 * Real-time communication for:
 * - Kitchen/Bar order notifications
 * - Waiter call notifications
 * - Table status updates
 * - Live dashboard metrics
 */

const { Server } = require('socket.io');

let io;

/**
 * Initialize WebSocket server
 */
function initializeWebSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);
    
    // Join role-specific rooms
    socket.on('join-role', (role) => {
      socket.join(role);
      console.log(`👤 ${socket.id} joined ${role} room`);
    });
    
    // Join table-specific room
    socket.on('join-table', (tableId) => {
      socket.join(`table-${tableId}`);
      console.log(`🪑 ${socket.id} joined table-${tableId} room`);
    });
    
    // Leave room
    socket.on('leave-room', (room) => {
      socket.leave(room);
      console.log(`👋 ${socket.id} left ${room} room`);
    });
    
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  console.log('🔌 WebSocket server initialized');
  return io;
}

/**
 * Emit new order to kitchen
 */
function notifyKitchen(orderData) {
  if (!io) return;
  io.to('kitchen').emit('new-order', {
    type: 'KITCHEN_ORDER',
    order: orderData,
    timestamp: new Date().toISOString()
  });
  console.log(`🍳 Kitchen notified: Order ${orderData.order_number}`);
}

/**
 * Emit new order to bar
 */
function notifyBar(orderData) {
  if (!io) return;
  io.to('bar').emit('new-order', {
    type: 'BAR_ORDER',
    order: orderData,
    timestamp: new Date().toISOString()
  });
  console.log(`🍹 Bar notified: Order ${orderData.order_number}`);
}

/**
 * Notify waiter about order status change
 */
function notifyWaiter(waiterId, orderData, message) {
  if (!io) return;
  io.to('waiter').emit('order-update', {
    waiter_id: waiterId,
    order: orderData,
    message,
    timestamp: new Date().toISOString()
  });
  console.log(`👨‍🍳 Waiter ${waiterId} notified: ${message}`);
}

/**
 * Notify about table status change
 */
function notifyTableUpdate(tableData) {
  if (!io) return;
  // Notify all managers and admins
  io.to('admin').to('manager').emit('table-update', {
    type: 'TABLE_STATUS',
    table: tableData,
    timestamp: new Date().toISOString()
  });
  
  // Also notify specific table watchers
  io.to(`table-${tableData.id}`).emit('table-update', {
    type: 'TABLE_STATUS',
    table: tableData,
    timestamp: new Date().toISOString()
  });
  
  console.log(`🪑 Table ${tableData.table_number} update broadcast`);
}

/**
 * Notify about waiter call from customer
 */
function notifyWaiterCall(callData) {
  if (!io) return;
  io.to('waiter').to('manager').emit('waiter-call', {
    type: 'CUSTOMER_CALL',
    call: callData,
    timestamp: new Date().toISOString(),
    priority: callData.reason === 'emergency' ? 'HIGH' : 'NORMAL'
  });
  console.log(`🔔 Waiter call from table ${callData.table_number}`);
}

/**
 * Broadcast dashboard metrics update
 */
function broadcastDashboardUpdate(metrics) {
  if (!io) return;
  io.to('admin').to('manager').emit('dashboard-update', {
    type: 'METRICS_UPDATE',
    metrics,
    timestamp: new Date().toISOString()
  });
  console.log(`📊 Dashboard metrics broadcast`);
}

/**
 * Notify about new sale completion
 */
function notifySaleCompleted(saleData) {
  if (!io) return;
  io.to('admin').to('manager').emit('sale-completed', {
    type: 'SALE_COMPLETED',
    sale: saleData,
    timestamp: new Date().toISOString()
  });
  console.log(`💰 Sale completed: ${saleData.order_number}`);
}

/**
 * Notify about suspicious activity
 */
function notifySuspiciousActivity(alertData) {
  if (!io) return;
  io.to('admin').emit('security-alert', {
    type: 'SUSPICIOUS_ACTIVITY',
    alert: alertData,
    timestamp: new Date().toISOString(),
    severity: alertData.severity || 'MEDIUM'
  });
  console.log(`⚠️  Security alert: ${alertData.type}`);
}

/**
 * Broadcast general notification to specific roles
 */
function broadcastNotification(roles, notification) {
  if (!io) return;
  roles.forEach(role => {
    io.to(role).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString()
    });
  });
  console.log(`📢 Notification broadcast to: ${roles.join(', ')}`);
}

/**
 * Notify time alert for long-pending orders
 */
function notifyTimeAlert(orderData, roles = ['manager', 'waiter']) {
  if (!io) {
    console.warn('WebSocket not initialized');
    return;
  }
  
  roles.forEach(role => {
    io.to(role).emit('time_alert', {
      type: 'order_delayed',
      order_id: orderData.order_id,
      order_number: orderData.order_number,
      table_id: orderData.table_id,
      elapsed_minutes: orderData.elapsed_minutes,
      threshold_minutes: orderData.threshold_minutes,
      status: orderData.status,
      waiter_id: orderData.waiter_id,
      timestamp: new Date().toISOString()
    });
  });
  console.log(`⏰ Time alert sent for order ${orderData.order_number} (${orderData.elapsed_minutes}min)`);
}

/**
 * Get connected clients count
 */
function getConnectedClients() {
  if (!io) return 0;
  return io.engine.clientsCount;
}

/**
 * Get clients in specific room
 */
async function getRoomClients(room) {
  if (!io) return [];
  const sockets = await io.in(room).fetchSockets();
  return sockets.map(s => s.id);
}

module.exports = {
  initializeWebSocket,
  notifyKitchen,
  notifyBar,
  notifyWaiter,
  notifyTableUpdate,
  notifyWaiterCall,
  broadcastDashboardUpdate,
  notifySaleCompleted,
  notifySuspiciousActivity,
  broadcastNotification,
  notifyTimeAlert,
  getConnectedClients,
  getRoomClients
};
