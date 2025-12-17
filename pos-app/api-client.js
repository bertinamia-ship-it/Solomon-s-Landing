// API Configuration and Helper Functions
const API_BASE_URL = 'http://localhost:3000/api';

// Global state
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// API Helper Functions
const API = {
    // Set auth token
    setToken(token) {
        authToken = token;
        localStorage.setItem('authToken', token);
    },

    // Clear auth token
    clearToken() {
        authToken = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    },

    // Make authenticated request
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const config = {
            ...options,
            headers
        };

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth endpoints
    auth: {
        async login(username, password) {
            const data = await API.request('/auth/login', {
                method: 'POST',
                body: { username, password }
            });
            
            API.setToken(data.token);
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            return data;
        },

        async logout() {
            await API.request('/auth/logout', { method: 'POST' });
            API.clearToken();
            currentUser = null;
        },

        async getMe() {
            const data = await API.request('/auth/me');
            return data.user;
        },

        async verifyPin(pin) {
            return await API.request('/auth/verify-pin', {
                method: 'POST',
                body: { pin }
            });
        }
    },

    // Tables endpoints
    tables: {
        async getAll() {
            const data = await API.request('/tables');
            return data.tables;
        },

        async getById(id) {
            const data = await API.request(`/tables/${id}`);
            return data;
        },

        async update(id, updates) {
            const data = await API.request(`/tables/${id}`, {
                method: 'PUT',
                body: updates
            });
            return data.table;
        },

        async occupy(id, customerData) {
            const data = await API.request(`/tables/${id}/occupy`, {
                method: 'POST',
                body: customerData
            });
            return data.order;
        },

        async free(id) {
            return await API.request(`/tables/${id}/free`, {
                method: 'POST'
            });
        }
    },

    // Menu endpoints
    menu: {
        async getAll(filters = {}) {
            const params = new URLSearchParams(filters);
            const data = await API.request(`/menu?${params}`);
            return data.items;
        },

        async getById(id) {
            const data = await API.request(`/menu/${id}`);
            return data.item;
        },

        async create(item) {
            const data = await API.request('/menu', {
                method: 'POST',
                body: item
            });
            return data.item;
        },

        async update(id, updates) {
            const data = await API.request(`/menu/${id}`, {
                method: 'PUT',
                body: updates
            });
            return data.item;
        },

        async bulkPriceUpdate(percentage, category = null) {
            return await API.request('/menu/bulk-price-update', {
                method: 'POST',
                body: { percentage, category }
            });
        },

        async import(items) {
            return await API.request('/menu/import', {
                method: 'POST',
                body: { items }
            });
        }
    },

    // Orders endpoints
    orders: {
        async getAll(filters = {}) {
            const params = new URLSearchParams(filters);
            const data = await API.request(`/orders?${params}`);
            return data.orders;
        },

        async getById(id) {
            const data = await API.request(`/orders/${id}`);
            return data.order;
        },

        async create(orderData) {
            const data = await API.request('/orders', {
                method: 'POST',
                body: orderData
            });
            return data.order;
        },

        async addItems(orderId, items) {
            const data = await API.request(`/orders/${orderId}/items`, {
                method: 'POST',
                body: { items }
            });
            return data.items;
        },

        async updateStatus(orderId, status) {
            const data = await API.request(`/orders/${orderId}/status`, {
                method: 'PUT',
                body: { status }
            });
            return data.order;
        },

        async updateItemStatus(orderId, itemId, status) {
            return await API.request(`/orders/${orderId}/items/${itemId}`, {
                method: 'PUT',
                body: { status }
            });
        },

        async cancel(orderId, managerPin) {
            return await API.request(`/orders/${orderId}`, {
                method: 'DELETE',
                body: { manager_pin: managerPin }
            });
        },

        async getKitchenPending() {
            const data = await API.request('/orders/kitchen/pending');
            return data.items;
        },

        async getBarPending() {
            const data = await API.request('/orders/bar/pending');
            return data.items;
        }
    },

    // Sales endpoints
    sales: {
        async complete(saleData) {
            return await API.request('/sales/complete', {
                method: 'POST',
                body: saleData
            });
        },

        async getAll(filters = {}) {
            const params = new URLSearchParams(filters);
            const data = await API.request(`/sales?${params}`);
            return data;
        },

        async getMetrics() {
            return await API.request('/sales/metrics');
        }
    },

    // Reports endpoints
    reports: {
        async getDiscounts(filters = {}) {
            const params = new URLSearchParams(filters);
            return await API.request(`/reports/discounts?${params}`);
        },

        async getCancellations(filters = {}) {
            const params = new URLSearchParams(filters);
            return await API.request(`/reports/cancellations?${params}`);
        },

        async getWaste(filters = {}) {
            const params = new URLSearchParams(filters);
            return await API.request(`/reports/waste?${params}`);
        },

        async getSuspiciousPatterns() {
            return await API.request('/reports/suspicious-patterns');
        },

        async getAuditLog(filters = {}) {
            const params = new URLSearchParams(filters);
            return await API.request(`/reports/audit-log?${params}`);
        },

        async getDashboard() {
            return await API.request('/reports/dashboard');
        }
    },

    // Export endpoints (opens download in new window)
    export: {
        downloadSales(filters = {}) {
            const params = new URLSearchParams(filters);
            window.open(`${API_BASE_URL.replace('/api', '')}/api/export/sales?${params}`, '_blank');
        },

        downloadOrders(filters = {}) {
            const params = new URLSearchParams(filters);
            window.open(`${API_BASE_URL.replace('/api', '')}/api/export/orders?${params}`, '_blank');
        },

        downloadAuditLog(filters = {}) {
            const params = new URLSearchParams(filters);
            window.open(`${API_BASE_URL.replace('/api', '')}/api/export/audit-log?${params}`, '_blank');
        },

        downloadCompleteReport(filters = {}) {
            const params = new URLSearchParams(filters);
            window.open(`${API_BASE_URL.replace('/api', '')}/api/export/complete-report?${params}`, '_blank');
        }
    },

    // Waiter calls endpoints
    waiterCalls: {
        async create(tableId, reason, message) {
            return await API.request('/waiter-calls', {
                method: 'POST',
                body: {
                    table_id: tableId,
                    reason: reason || 'assistance',
                    message: message || null
                }
            });
        },

        async getAll(filters = {}) {
            const params = new URLSearchParams(filters);
            const data = await API.request(`/waiter-calls?${params}`);
            return data.calls;
        },

        async getPending() {
            const data = await API.request('/waiter-calls/pending');
            return data.calls;
        },

        async respond(callId) {
            return await API.request(`/waiter-calls/${callId}/respond`, {
                method: 'PUT'
            });
        },

        async complete(callId, notes) {
            return await API.request(`/waiter-calls/${callId}/complete`, {
                method: 'PUT',
                body: { notes: notes || null }
            });
        },

        async getStats() {
            return await API.request('/waiter-calls/stats');
        }
    }
};

// Make API available globally
window.API = API;
window.currentUser = currentUser;

console.log('🔌 API Client loaded');
if (currentUser) {
    console.log(`👤 Logged in as: ${currentUser.full_name} (${currentUser.role})`);
}
