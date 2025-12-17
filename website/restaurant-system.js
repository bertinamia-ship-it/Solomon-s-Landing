// ============================================
// SOLOMON'S LANDING - RESTAURANT MANAGEMENT SYSTEM
// Sistema de gestión para iPads, Meseros, Bar y Admin
// ============================================

class RestaurantSystem {
    constructor() {
        this.currentUser = null;
        this.currentTable = null;
        this.init();
    }

    init() {
        // Inicializar datos si no existen
        if (!localStorage.getItem('restaurant_orders')) {
            localStorage.setItem('restaurant_orders', JSON.stringify([]));
        }
        if (!localStorage.getItem('restaurant_tables')) {
            localStorage.setItem('restaurant_tables', JSON.stringify({}));
        }
        if (!localStorage.getItem('restaurant_menu_adjustments')) {
            localStorage.setItem('restaurant_menu_adjustments', JSON.stringify({ percentage: 0 }));
        }
        if (!localStorage.getItem('restaurant_stats')) {
            localStorage.setItem('restaurant_stats', JSON.stringify({
                totalSales: 0,
                totalTables: 0,
                salesByDay: {}
            }));
        }
    }

    // ============================================
    // AUTENTICACIÓN
    // ============================================
    
    login(username, password) {
        const validUsers = {
            // iPads para clientes
            'ipad1': { password: 'bertina123', role: 'ipad', device: 'iPad 1' },
            'ipad2': { password: 'bertina123', role: 'ipad', device: 'iPad 2' },
            'ipad3': { password: 'bertina123', role: 'ipad', device: 'iPad 3' },
            'ipad4': { password: 'bertina123', role: 'ipad', device: 'iPad 4' },
            'ipad5': { password: 'bertina123', role: 'ipad', device: 'iPad 5' },
            'ipad6': { password: 'bertina123', role: 'ipad', device: 'iPad 6' },
            'ipad7': { password: 'bertina123', role: 'ipad', device: 'iPad 7' },
            'ipad8': { password: 'bertina123', role: 'ipad', device: 'iPad 8' },
            'ipad9': { password: 'bertina123', role: 'ipad', device: 'iPad 9' },
            'ipad10': { password: 'bertina123', role: 'ipad', device: 'iPad 10' },
            
            // Staff
            'meseros': { password: 'bertina123', role: 'waiter', device: 'Meseros' },
            'bar': { password: 'bertina123', role: 'bar', device: 'Bar' },
            'admin': { password: 'bertina123', role: 'admin', device: 'Administrador' }
        };

        if (validUsers[username] && validUsers[username].password === password) {
            this.currentUser = {
                username: username,
                role: validUsers[username].role,
                device: validUsers[username].device
            };
            sessionStorage.setItem('restaurant_user', JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        this.currentTable = null;
        sessionStorage.removeItem('restaurant_user');
        sessionStorage.removeItem('current_table');
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const stored = sessionStorage.getItem('restaurant_user');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    // ============================================
    // GESTIÓN DE MESAS
    // ============================================
    
    startTable(tableNumber) {
        const tables = JSON.parse(localStorage.getItem('restaurant_tables'));
        
        if (!tables[tableNumber]) {
            tables[tableNumber] = {
                number: tableNumber,
                startTime: new Date().toISOString(),
                orders: [],
                total: 0,
                status: 'active',
                device: this.currentUser.device
            };
            localStorage.setItem('restaurant_tables', JSON.stringify(tables));
            sessionStorage.setItem('current_table', tableNumber);
            this.currentTable = tableNumber;
            return true;
        }
        return false; // Mesa ya existe
    }

    getTable(tableNumber) {
        const tables = JSON.parse(localStorage.getItem('restaurant_tables'));
        return tables[tableNumber] || null;
    }

    getAllTables() {
        return JSON.parse(localStorage.getItem('restaurant_tables'));
    }

    closeTable(tableNumber) {
        const tables = JSON.parse(localStorage.getItem('restaurant_tables'));
        if (tables[tableNumber]) {
            // Guardar en estadísticas
            const stats = JSON.parse(localStorage.getItem('restaurant_stats'));
            const today = new Date().toISOString().split('T')[0];
            
            stats.totalSales += tables[tableNumber].total;
            stats.totalTables += 1;
            
            if (!stats.salesByDay[today]) {
                stats.salesByDay[today] = { sales: 0, tables: 0 };
            }
            stats.salesByDay[today].sales += tables[tableNumber].total;
            stats.salesByDay[today].tables += 1;
            
            localStorage.setItem('restaurant_stats', JSON.stringify(stats));
            
            // Eliminar mesa
            delete tables[tableNumber];
            localStorage.setItem('restaurant_tables', JSON.stringify(tables));
            return true;
        }
        return false;
    }

    // ============================================
    // GESTIÓN DE PEDIDOS
    // ============================================
    
    addOrder(tableNumber, items) {
        const tables = JSON.parse(localStorage.getItem('restaurant_tables'));
        const orders = JSON.parse(localStorage.getItem('restaurant_orders'));
        const adjustments = JSON.parse(localStorage.getItem('restaurant_menu_adjustments'));
        
        if (!tables[tableNumber]) {
            return { success: false, message: 'Mesa no iniciada' };
        }

        const order = {
            id: Date.now(),
            tableNumber: tableNumber,
            items: items,
            time: new Date().toISOString(),
            status: 'pending',
            device: this.currentUser.device,
            total: 0
        };

        // Calcular total con ajuste de precio
        const priceMultiplier = 1 + (adjustments.percentage / 100);
        order.items.forEach(item => {
            item.adjustedPrice = item.price * priceMultiplier;
            order.total += item.adjustedPrice * item.quantity;
        });

        // Agregar a órdenes globales
        orders.push(order);
        localStorage.setItem('restaurant_orders', JSON.stringify(orders));

        // Agregar a mesa
        tables[tableNumber].orders.push(order);
        tables[tableNumber].total += order.total;
        localStorage.setItem('restaurant_tables', JSON.stringify(tables));

        return { success: true, order: order };
    }

    getTableOrders(tableNumber) {
        const table = this.getTable(tableNumber);
        return table ? table.orders : [];
    }

    getAllOrders() {
        return JSON.parse(localStorage.getItem('restaurant_orders'));
    }

    updateOrderStatus(orderId, status) {
        const orders = JSON.parse(localStorage.getItem('restaurant_orders'));
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            localStorage.setItem('restaurant_orders', JSON.stringify(orders));
            return true;
        }
        return false;
    }

    // ============================================
    // GESTIÓN DE MENÚ (ADMIN)
    // ============================================
    
    adjustMenuPrices(percentage) {
        if (this.currentUser && this.currentUser.role === 'admin') {
            localStorage.setItem('restaurant_menu_adjustments', JSON.stringify({ percentage: percentage }));
            return true;
        }
        return false;
    }

    getPriceAdjustment() {
        const adjustments = JSON.parse(localStorage.getItem('restaurant_menu_adjustments'));
        return adjustments.percentage;
    }

    // ============================================
    // ESTADÍSTICAS (ADMIN)
    // ============================================
    
    getStats() {
        return JSON.parse(localStorage.getItem('restaurant_stats'));
    }

    getTodayStats() {
        const stats = this.getStats();
        const today = new Date().toISOString().split('T')[0];
        return stats.salesByDay[today] || { sales: 0, tables: 0 };
    }

    // ============================================
    // UTILIDADES
    // ============================================
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Instancia global
const restaurantSystem = new RestaurantSystem();
