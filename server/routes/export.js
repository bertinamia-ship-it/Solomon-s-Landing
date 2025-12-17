/**
 * Excel Export Route
 * Endpoint: /api/export
 * 
 * Export various reports to Excel format:
 * - Sales report
 * - Orders report
 * - Audit logs
 * - Discount report
 * - Waste tracking
 */

const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const db = require('../config/database').db;
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// ONLY admin and manager can export
router.use(authenticateToken);
router.use(authorizeRole('admin', 'manager'));

/**
 * GET /api/export/sales
 * Export sales report to Excel
 */
router.get('/sales', async (req, res) => {
  try {
    const { start_date, end_date, waiter_id, payment_method } = req.query;
    
    // Build query
    let query = `
      SELECT 
        s.id,
        s.order_number,
        s.table_id,
        t.table_number,
        s.waiter_id,
        u.username as waiter_username,
        u.full_name as waiter_name,
        s.subtotal,
        s.tax,
        s.tip,
        s.discount,
        s.total,
        s.payment_method,
        s.created_at as sale_date
      FROM sales s
      LEFT JOIN tables t ON s.table_id = t.id
      LEFT JOIN users u ON s.waiter_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (start_date) {
      query += ` AND DATE(s.created_at) >= DATE(?)`;
      params.push(start_date);
    }
    if (end_date) {
      query += ` AND DATE(s.created_at) <= DATE(?)`;
      params.push(end_date);
    }
    if (waiter_id) {
      query += ` AND s.waiter_id = ?`;
      params.push(parseInt(waiter_id));
    }
    if (payment_method) {
      query += ` AND s.payment_method = ?`;
      params.push(payment_method);
    }
    
    query += ` ORDER BY s.created_at DESC`;
    
    const stmt = db.prepare(query);
    const sales = stmt.all(...params);
    
    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Solomon's Landing POS";
    workbook.created = new Date();
    
    // Sales sheet
    const salesSheet = workbook.addWorksheet('Sales', {
      properties: { tabColor: { argb: 'FF3B82F6' } }
    });
    
    // Define columns
    salesSheet.columns = [
      { header: 'Sale ID', key: 'id', width: 10 },
      { header: 'Order Number', key: 'order_number', width: 20 },
      { header: 'Table', key: 'table_number', width: 10 },
      { header: 'Waiter', key: 'waiter_name', width: 20 },
      { header: 'Subtotal', key: 'subtotal', width: 12 },
      { header: 'Tax', key: 'tax', width: 10 },
      { header: 'Tip', key: 'tip', width: 10 },
      { header: 'Discount', key: 'discount', width: 12 },
      { header: 'Total', key: 'total', width: 12 },
      { header: 'Payment Method', key: 'payment_method', width: 15 },
      { header: 'Date', key: 'sale_date', width: 20 }
    ];
    
    // Style header row
    salesSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    salesSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' }
    };
    salesSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Add data
    sales.forEach(sale => {
      salesSheet.addRow(sale);
    });
    
    // Format currency columns
    ['subtotal', 'tax', 'tip', 'discount', 'total'].forEach(col => {
      salesSheet.getColumn(col).numFmt = '$#,##0.00';
    });
    
    // Add summary row
    const summaryRow = salesSheet.addRow({
      order_number: 'TOTALS',
      subtotal: { formula: `SUM(E2:E${sales.length + 1})` },
      tax: { formula: `SUM(F2:F${sales.length + 1})` },
      tip: { formula: `SUM(G2:G${sales.length + 1})` },
      discount: { formula: `SUM(H2:H${sales.length + 1})` },
      total: { formula: `SUM(I2:I${sales.length + 1})` }
    });
    summaryRow.font = { bold: true };
    summaryRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' }
    };
    
    // Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=sales_${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error exporting sales:', error);
    res.status(500).json({ error: 'Failed to export sales' });
  }
});

/**
 * GET /api/export/orders
 * Export orders report to Excel
 */
router.get('/orders', async (req, res) => {
  try {
    const { start_date, end_date, status, waiter_id } = req.query;
    
    let query = `
      SELECT 
        o.id,
        o.order_number,
        o.table_id,
        t.table_number,
        o.waiter_id,
        u.username as waiter,
        u.full_name as waiter_name,
        o.customer_name,
        o.customer_party_size,
        o.status,
        o.subtotal,
        o.tax,
        o.total,
        o.created_at,
        o.updated_at
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN users u ON o.waiter_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (start_date) {
      query += ` AND DATE(o.created_at) >= DATE(?)`;
      params.push(start_date);
    }
    if (end_date) {
      query += ` AND DATE(o.created_at) <= DATE(?)`;
      params.push(end_date);
    }
    if (status) {
      query += ` AND o.status = ?`;
      params.push(status);
    }
    if (waiter_id) {
      query += ` AND o.waiter_id = ?`;
      params.push(parseInt(waiter_id));
    }
    
    query += ` ORDER BY o.created_at DESC`;
    
    const stmt = db.prepare(query);
    const orders = stmt.all(...params);
    
    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Orders');
    
    sheet.columns = [
      { header: 'Order ID', key: 'id', width: 10 },
      { header: 'Order Number', key: 'order_number', width: 20 },
      { header: 'Table', key: 'table_number', width: 10 },
      { header: 'Waiter', key: 'waiter_name', width: 20 },
      { header: 'Customer', key: 'customer_name', width: 20 },
      { header: 'Party Size', key: 'customer_party_size', width: 12 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Subtotal', key: 'subtotal', width: 12 },
      { header: 'Tax', key: 'tax', width: 10 },
      { header: 'Total', key: 'total', width: 12 },
      { header: 'Created', key: 'created_at', width: 20 },
      { header: 'Updated', key: 'updated_at', width: 20 }
    ];
    
    // Style header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF8B5CF6' }
    };
    
    orders.forEach(order => {
      sheet.addRow(order);
    });
    
    sheet.getColumn('subtotal').numFmt = '$#,##0.00';
    sheet.getColumn('tax').numFmt = '$#,##0.00';
    sheet.getColumn('total').numFmt = '$#,##0.00';
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=orders_${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error exporting orders:', error);
    res.status(500).json({ error: 'Failed to export orders' });
  }
});

/**
 * GET /api/export/audit-log
 * Export audit logs to Excel
 */
router.get('/audit-log', async (req, res) => {
  try {
    const { start_date, end_date, action, user_id } = req.query;
    
    let query = `
      SELECT 
        al.id,
        al.action,
        al.username,
        u.full_name as user_name,
        al.resource_type,
        al.resource_id,
        al.table_number,
        al.order_number,
        al.details,
        al.ip_address,
        al.created_at
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
    
    query += ` ORDER BY al.created_at DESC LIMIT 10000`;
    
    const stmt = db.prepare(query);
    const logs = stmt.all(...params);
    
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Audit Log');
    
    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Action', key: 'action', width: 25 },
      { header: 'Username', key: 'username', width: 15 },
      { header: 'Full Name', key: 'user_name', width: 20 },
      { header: 'Resource Type', key: 'resource_type', width: 15 },
      { header: 'Resource ID', key: 'resource_id', width: 12 },
      { header: 'Table #', key: 'table_number', width: 10 },
      { header: 'Order #', key: 'order_number', width: 20 },
      { header: 'Details', key: 'details', width: 40 },
      { header: 'IP Address', key: 'ip_address', width: 15 },
      { header: 'Timestamp', key: 'created_at', width: 20 }
    ];
    
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEF4444' }
    };
    
    logs.forEach(log => {
      sheet.addRow(log);
    });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=audit_log_${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error exporting audit log:', error);
    res.status(500).json({ error: 'Failed to export audit log' });
  }
});

/**
 * GET /api/export/complete-report
 * Export complete multi-sheet report with all data
 */
router.get('/complete-report', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Solomon's Landing POS";
    workbook.created = new Date();
    
    // Sheet 1: Sales Summary
    const salesSheet = workbook.addWorksheet('Sales Summary');
    let salesQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as transaction_count,
        SUM(subtotal) as subtotal,
        SUM(tax) as tax,
        SUM(tip) as tips,
        SUM(discount) as discounts,
        SUM(total) as total_sales,
        AVG(total) as avg_ticket
      FROM sales
      WHERE 1=1
    `;
    const salesParams = [];
    if (start_date) {
      salesQuery += ` AND DATE(created_at) >= DATE(?)`;
      salesParams.push(start_date);
    }
    if (end_date) {
      salesQuery += ` AND DATE(created_at) <= DATE(?)`;
      salesParams.push(end_date);
    }
    salesQuery += ` GROUP BY DATE(created_at) ORDER BY date DESC`;
    
    const salesData = db.prepare(salesQuery).all(...salesParams);
    
    salesSheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Transactions', key: 'transaction_count', width: 15 },
      { header: 'Subtotal', key: 'subtotal', width: 12 },
      { header: 'Tax', key: 'tax', width: 10 },
      { header: 'Tips', key: 'tips', width: 10 },
      { header: 'Discounts', key: 'discounts', width: 12 },
      { header: 'Total Sales', key: 'total_sales', width: 15 },
      { header: 'Avg Ticket', key: 'avg_ticket', width: 12 }
    ];
    
    salesSheet.getRow(1).font = { bold: true };
    salesSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' }
    };
    
    salesData.forEach(row => salesSheet.addRow(row));
    ['subtotal', 'tax', 'tips', 'discounts', 'total_sales', 'avg_ticket'].forEach(col => {
      salesSheet.getColumn(col).numFmt = '$#,##0.00';
    });
    
    // Sheet 2: Top Menu Items
    const menuSheet = workbook.addWorksheet('Top Menu Items');
    const menuData = db.prepare(`
      SELECT 
        mi.name_en,
        mi.category_en,
        COUNT(oi.id) as times_ordered,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.subtotal) as revenue
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY mi.id
      ORDER BY times_ordered DESC
      LIMIT 50
    `).all();
    
    menuSheet.columns = [
      { header: 'Item Name', key: 'name_en', width: 40 },
      { header: 'Category', key: 'category_en', width: 20 },
      { header: 'Times Ordered', key: 'times_ordered', width: 15 },
      { header: 'Total Quantity', key: 'total_quantity', width: 15 },
      { header: 'Revenue', key: 'revenue', width: 15 }
    ];
    
    menuSheet.getRow(1).font = { bold: true };
    menuSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF10B981' }
    };
    
    menuData.forEach(row => menuSheet.addRow(row));
    menuSheet.getColumn('revenue').numFmt = '$#,##0.00';
    
    // Sheet 3: Waiter Performance
    const waiterSheet = workbook.addWorksheet('Waiter Performance');
    const waiterData = db.prepare(`
      SELECT 
        u.full_name,
        COUNT(DISTINCT s.id) as sales_count,
        SUM(s.total) as total_sales,
        SUM(s.tip) as total_tips,
        AVG(s.total) as avg_ticket,
        SUM(s.discount) as total_discounts
      FROM users u
      LEFT JOIN sales s ON u.id = s.waiter_id
      WHERE u.role = 'waiter'
      GROUP BY u.id
      ORDER BY total_sales DESC
    `).all();
    
    waiterSheet.columns = [
      { header: 'Waiter Name', key: 'full_name', width: 25 },
      { header: 'Sales Count', key: 'sales_count', width: 15 },
      { header: 'Total Sales', key: 'total_sales', width: 15 },
      { header: 'Total Tips', key: 'total_tips', width: 15 },
      { header: 'Avg Ticket', key: 'avg_ticket', width: 15 },
      { header: 'Discounts Given', key: 'total_discounts', width: 15 }
    ];
    
    waiterSheet.getRow(1).font = { bold: true };
    waiterSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF59E0B' }
    };
    
    waiterData.forEach(row => waiterSheet.addRow(row));
    ['total_sales', 'total_tips', 'avg_ticket', 'total_discounts'].forEach(col => {
      waiterSheet.getColumn(col).numFmt = '$#,##0.00';
    });
    
    // Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=complete_report_${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error exporting complete report:', error);
    res.status(500).json({ error: 'Failed to export complete report' });
  }
});

module.exports = router;
