/**
 * Waiter Calls Route
 * Endpoint: /api/waiter-calls
 * 
 * Manage customer service requests
 * Uses WebSocket for real-time notifications
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database').db;
const { authenticateToken, authorizeRole, auditLog } = require('../middleware/auth');
const { notifyWaiterCall } = require('../websocket');

/**
 * POST /api/waiter-calls
 * Customer requests waiter assistance (public endpoint for iPad)
 */
router.post('/', async (req, res) => {
  try {
    const { table_id, reason, message } = req.body;
    
    if (!table_id) {
      return res.status(400).json({ error: 'table_id is required' });
    }
    
    // Get table info
    const table = db.prepare('SELECT * FROM tables WHERE id = ?').get(table_id);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    // Create waiter call
    const insert = db.prepare(`
      INSERT INTO waiter_calls (table_id, table_number, reason, message, status)
      VALUES (?, ?, ?, ?, 'pending')
    `);
    
    const result = insert.run(
      table_id,
      table.table_number,
      reason || 'assistance',
      message || null
    );
    
    const call = db.prepare('SELECT * FROM waiter_calls WHERE id = ?').get(result.lastInsertRowid);
    
    // Notify waiters via WebSocket
    notifyWaiterCall({
      ...call,
      table_number: table.table_number
    });
    
    res.status(201).json({
      message: 'Waiter notified successfully',
      call
    });
    
  } catch (error) {
    console.error('Error creating waiter call:', error);
    res.status(500).json({ error: 'Failed to create waiter call' });
  }
});

/**
 * GET /api/waiter-calls
 * Get all waiter calls (filtered)
 */
router.get('/', authenticateToken, authorizeRole('admin', 'manager', 'waiter'), (req, res) => {
  try {
    const { status, table_id } = req.query;
    
    let query = 'SELECT * FROM waiter_calls WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (table_id) {
      query += ' AND table_id = ?';
      params.push(parseInt(table_id));
    }
    
    query += ' ORDER BY created_at DESC';
    
    const stmt = db.prepare(query);
    const calls = stmt.all(...params);
    
    res.json({ calls });
    
  } catch (error) {
    console.error('Error fetching waiter calls:', error);
    res.status(500).json({ error: 'Failed to fetch waiter calls' });
  }
});

/**
 * GET /api/waiter-calls/pending
 * Get only pending calls
 */
router.get('/pending', authenticateToken, authorizeRole('admin', 'manager', 'waiter'), (req, res) => {
  try {
    const calls = db.prepare(`
      SELECT * FROM waiter_calls 
      WHERE status = 'pending'
      ORDER BY created_at ASC
    `).all();
    
    res.json({ calls, count: calls.length });
    
  } catch (error) {
    console.error('Error fetching pending calls:', error);
    res.status(500).json({ error: 'Failed to fetch pending calls' });
  }
});

/**
 * PUT /api/waiter-calls/:id/respond
 * Mark call as responded
 */
router.put('/:id/respond', authenticateToken, authorizeRole('admin', 'manager', 'waiter'), auditLog('RESPOND_WAITER_CALL', 'waiter_call'), (req, res) => {
  try {
    const { id } = req.params;
    
    const update = db.prepare(`
      UPDATE waiter_calls 
      SET status = 'responded', 
          responded_at = CURRENT_TIMESTAMP,
          responded_by_user_id = ?
      WHERE id = ?
    `);
    
    const result = update.run(req.user.id, parseInt(id));
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Waiter call not found' });
    }
    
    const call = db.prepare('SELECT * FROM waiter_calls WHERE id = ?').get(parseInt(id));
    
    res.json({
      message: 'Call marked as responded',
      call
    });
    
  } catch (error) {
    console.error('Error responding to call:', error);
    res.status(500).json({ error: 'Failed to respond to call' });
  }
});

/**
 * PUT /api/waiter-calls/:id/complete
 * Mark call as completed
 */
router.put('/:id/complete', authenticateToken, authorizeRole('admin', 'manager', 'waiter'), auditLog('COMPLETE_WAITER_CALL', 'waiter_call'), (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const update = db.prepare(`
      UPDATE waiter_calls 
      SET status = 'completed',
          response_notes = ?,
          responded_at = CURRENT_TIMESTAMP,
          responded_by_user_id = ?
      WHERE id = ?
    `);
    
    const result = update.run(notes || null, req.user.id, parseInt(id));
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Waiter call not found' });
    }
    
    const call = db.prepare('SELECT * FROM waiter_calls WHERE id = ?').get(parseInt(id));
    
    res.json({
      message: 'Call completed',
      call
    });
    
  } catch (error) {
    console.error('Error completing call:', error);
    res.status(500).json({ error: 'Failed to complete call' });
  }
});

/**
 * GET /api/waiter-calls/stats
 * Get waiter call statistics
 */
router.get('/stats', authenticateToken, authorizeRole('admin', 'manager'), (req, res) => {
  try {
    const today = db.prepare(`
      SELECT 
        COUNT(*) as total_calls,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_calls,
        SUM(CASE WHEN status = 'responded' THEN 1 ELSE 0 END) as responded_calls,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_calls,
        AVG(CASE 
          WHEN responded_at IS NOT NULL 
          THEN (julianday(responded_at) - julianday(created_at)) * 24 * 60 
        END) as avg_response_time_minutes
      FROM waiter_calls
      WHERE DATE(created_at) = DATE('now')
    `).get();
    
    const byReason = db.prepare(`
      SELECT 
        reason,
        COUNT(*) as count
      FROM waiter_calls
      WHERE DATE(created_at) >= DATE('now', '-7 days')
      GROUP BY reason
      ORDER BY count DESC
    `).all();
    
    res.json({
      today,
      by_reason: byReason
    });
    
  } catch (error) {
    console.error('Error fetching call stats:', error);
    res.status(500).json({ error: 'Failed to fetch call stats' });
  }
});

module.exports = router;
