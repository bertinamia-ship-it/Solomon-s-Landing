const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        // Check if session exists in database
        const session = db.prepare('SELECT * FROM sessions WHERE token = ? AND expires_at > datetime("now")').get(token);
        
        if (!session) {
            return res.status(403).json({ error: 'Session expired or invalid' });
        }

        req.user = user;
        req.token = token;
        next();
    });
}

// Middleware to check user role
function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Access denied',
                message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
            });
        }

        next();
    };
}

// Middleware to log actions to audit trail
function auditLog(action, resourceType = null) {
    return (req, res, next) => {
        const originalSend = res.send;

        res.send = function(data) {
            // Only log successful operations (2xx status codes)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const logEntry = db.prepare(`
                    INSERT INTO audit_logs (user_id, username, action, resource_type, resource_id, details, table_number, order_number, ip_address)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                const details = JSON.stringify({
                    method: req.method,
                    path: req.path,
                    body: req.body,
                    query: req.query
                });

                logEntry.run(
                    req.user?.id || null,
                    req.user?.username || 'anonymous',
                    action,
                    resourceType,
                    req.params?.id || null,
                    details,
                    req.body?.table_number || req.params?.table_number || null,
                    req.body?.order_number || req.params?.order_number || null,
                    req.ip
                );
            }

            originalSend.call(this, data);
        };

        next();
    };
}

// Check if action requires manager authorization
function requiresManagerAuth(req, res, next) {
    const { role } = req.user;
    
    // Admin and Manager can proceed
    if (role === 'admin' || role === 'manager') {
        return next();
    }

    // For other roles, require manager PIN
    const { manager_pin } = req.body;
    
    if (!manager_pin) {
        return res.status(403).json({ 
            error: 'Manager authorization required',
            message: 'This action requires a manager PIN'
        });
    }

    // Verify manager PIN
    const manager = db.prepare('SELECT * FROM users WHERE role IN ("admin", "manager") AND pin = ? AND active = 1').get(manager_pin);
    
    if (!manager) {
        return res.status(403).json({ 
            error: 'Invalid manager PIN',
            message: 'The provided manager PIN is incorrect'
        });
    }

    // Log who authorized the action
    req.authorizedBy = manager.id;
    next();
}

module.exports = {
    authenticateToken,
    authorizeRole,
    auditLog,
    requiresManagerAuth
};
