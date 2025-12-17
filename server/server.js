require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(cors({
    origin: '*',
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoints
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Solomon\'s Landing Reservation System'
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Solomon\'s Landing Reservation System'
    });
});

// API Routes (solo las que existen)
app.use('/api/stripe', require('./routes/stripe'));
app.use('/api/checkout', require('./routes/checkout'));
// app.use('/api/users', require('./routes/users'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Solomon's Landing Backend Server`);
    console.log(`📡 HTTP Server running on port ${PORT}`);
    console.log(`🌍 CORS: Enabled for all origins`);
    console.log(`\n✅ Server ready to accept requests!\n`);
});

module.exports = app;
