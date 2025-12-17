const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { authenticateToken, auditLog } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Get user from database
        const user = db.prepare('SELECT * FROM users WHERE username = ? AND active = 1').get(username);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const tokenPayload = {
            id: user.id,
            username: user.username,
            role: user.role,
            full_name: user.full_name
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION || '24h'
        });

        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        // Store session in database
        const insertSession = db.prepare(`
            INSERT INTO sessions (user_id, token, device_info, ip_address, expires_at)
            VALUES (?, ?, ?, ?, ?)
        `);

        insertSession.run(
            user.id,
            token,
            req.headers['user-agent'] || 'unknown',
            req.ip,
            expiresAt.toISOString()
        );

        // Log successful login
        const logEntry = db.prepare(`
            INSERT INTO audit_logs (user_id, username, action, ip_address)
            VALUES (?, ?, 'LOGIN', ?)
        `);
        logEntry.run(user.id, user.username, req.ip);

        // Return user info and token (without password)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// POST /api/auth/logout - User logout
router.post('/logout', authenticateToken, auditLog('LOGOUT'), (req, res) => {
    try {
        // Delete session from database
        const deleteSession = db.prepare('DELETE FROM sessions WHERE token = ?');
        deleteSession.run(req.token);

        res.json({ message: 'Logout successful' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, (req, res) => {
    try {
        const user = db.prepare('SELECT id, username, full_name, role, email, phone FROM users WHERE id = ?').get(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

// POST /api/auth/verify-pin - Verify manager PIN
router.post('/verify-pin', authenticateToken, (req, res) => {
    try {
        const { pin } = req.body;

        if (!pin) {
            return res.status(400).json({ error: 'PIN required' });
        }

        // Check if PIN belongs to a manager or admin
        const manager = db.prepare(`
            SELECT id, username, full_name, role 
            FROM users 
            WHERE pin = ? AND role IN ('admin', 'manager') AND active = 1
        `).get(pin);

        if (!manager) {
            return res.status(403).json({ error: 'Invalid PIN', valid: false });
        }

        res.json({ 
            valid: true,
            manager: {
                id: manager.id,
                name: manager.full_name,
                role: manager.role
            }
        });

    } catch (error) {
        console.error('PIN verification error:', error);
        res.status(500).json({ error: 'PIN verification failed' });
    }
});

module.exports = router;
