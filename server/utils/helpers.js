/**
 * Utility Functions for Solomon's Landing POS
 * Reusable helpers for common operations
 */

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'MXN') {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Format date/time
 */
function formatDateTime(date, format = 'full') {
    const d = new Date(date);
    
    const formats = {
        full: { dateStyle: 'long', timeStyle: 'short' },
        date: { dateStyle: 'long' },
        time: { timeStyle: 'short' },
        short: { dateStyle: 'short', timeStyle: 'short' },
        iso: null
    };

    if (format === 'iso') {
        return d.toISOString();
    }

    return new Intl.DateTimeFormat('es-MX', formats[format] || formats.full).format(d);
}

/**
 * Calculate time difference in minutes
 */
function minutesSince(timestamp) {
    const then = new Date(timestamp);
    const now = new Date();
    return Math.floor((now - then) / (1000 * 60));
}

/**
 * Generate unique order number
 */
function generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}

/**
 * Validate email
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate phone (Mexican format)
 */
function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
}

/**
 * Format phone number
 */
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    return phone;
}

/**
 * Calculate percentage
 */
function percentage(value, total) {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(2);
}

/**
 * Sanitize input (prevent XSS)
 */
function sanitize(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Generate random PIN
 */
function generatePIN(length = 4) {
    let pin = '';
    for (let i = 0; i < length; i++) {
        pin += Math.floor(Math.random() * 10);
    }
    return pin;
}

/**
 * Calculate tip suggestions
 */
function calculateTipSuggestions(subtotal) {
    return {
        low: Math.round(subtotal * 0.10),
        medium: Math.round(subtotal * 0.15),
        high: Math.round(subtotal * 0.20)
    };
}

/**
 * Get shift time greeting
 */
function getShiftGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
}

/**
 * Calculate age from birthday
 */
function calculateAge(birthday) {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

/**
 * Check if birthday is today
 */
function isBirthdayToday(birthday) {
    const today = new Date();
    const birthDate = new Date(birthday);
    return today.getMonth() === birthDate.getMonth() && 
           today.getDate() === birthDate.getDate();
}

/**
 * Get upcoming birthdays
 */
function getUpcomingBirthdays(customers, days = 7) {
    const today = new Date();
    const future = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return customers.filter(customer => {
        if (!customer.birthday) return false;
        const birthDate = new Date(customer.birthday);
        birthDate.setFullYear(today.getFullYear());
        
        return birthDate >= today && birthDate <= future;
    });
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Deep clone object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Group array by key
 */
function groupBy(array, key) {
    return array.reduce((result, item) => {
        (result[item[key]] = result[item[key]] || []).push(item);
        return result;
    }, {});
}

/**
 * Calculate average
 */
function average(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return sum / numbers.length;
}

/**
 * Get color by status
 */
function getStatusColor(status) {
    const colors = {
        pending: '#f59e0b',
        confirmed: '#3b82f6',
        preparing: '#8b5cf6',
        ready: '#10b981',
        delivered: '#059669',
        paid: '#14b8a6',
        cancelled: '#ef4444',
        available: '#10b981',
        occupied: '#f59e0b',
        reserved: '#3b82f6'
    };
    return colors[status] || '#6b7280';
}

/**
 * Retry async function
 */
async function retry(fn, retries = 3, delay = 1000) {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
        return retry(fn, retries - 1, delay);
    }
}

/**
 * Rate limiter
 */
class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = new Map();
    }

    isAllowed(key) {
        const now = Date.now();
        const userRequests = this.requests.get(key) || [];
        
        // Remove old requests outside window
        const validRequests = userRequests.filter(time => now - time < this.windowMs);
        
        if (validRequests.length >= this.maxRequests) {
            return false;
        }
        
        validRequests.push(now);
        this.requests.set(key, validRequests);
        return true;
    }

    reset(key) {
        this.requests.delete(key);
    }
}

/**
 * Export utilities
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        formatDateTime,
        minutesSince,
        generateOrderNumber,
        isValidEmail,
        isValidPhone,
        formatPhone,
        percentage,
        sanitize,
        generatePIN,
        calculateTipSuggestions,
        getShiftGreeting,
        calculateAge,
        isBirthdayToday,
        getUpcomingBirthdays,
        formatFileSize,
        debounce,
        deepClone,
        groupBy,
        average,
        getStatusColor,
        retry,
        RateLimiter
    };
}
