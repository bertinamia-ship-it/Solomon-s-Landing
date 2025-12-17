// ============================================
// RESTAURANT SYSTEM - UI HANDLER
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initRestaurantUI();
});

function initRestaurantUI() {
    // Crear modal de login
    createLoginModal();
    
    // Crear dashboard container
    createDashboardContainer();
    
    // Event listeners
    document.getElementById('restaurantLoginTrigger')?.addEventListener('click', showLoginModal);
    
    // Verificar si hay sesión activa
    const user = restaurantSystem.getCurrentUser();
    if (user) {
        showDashboard(user.role);
    }
}

// ============================================
// LOGIN MODAL
// ============================================

function createLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'restaurant-modal';
    modal.id = 'restaurantLoginModal';
    modal.innerHTML = `
        <div class="restaurant-modal-content">
            <h2>🔐 Sistema de Restaurante</h2>
            <div class="restaurant-error" id="loginError">Usuario o contraseña incorrectos</div>
            <input type="text" id="loginUsername" placeholder="Usuario (ej: ipad1, meseros, admin)" autocomplete="off">
            <input type="password" id="loginPassword" placeholder="Contraseña">
            <button onclick="handleLogin()">Iniciar Sesión</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer click fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideLoginModal();
        }
    });
    
    // Enter para login
    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
}

function showLoginModal() {
    document.getElementById('restaurantLoginModal').classList.add('active');
    document.getElementById('loginUsername').focus();
}

function hideLoginModal() {
    document.getElementById('restaurantLoginModal').classList.remove('active');
    document.getElementById('loginError').classList.remove('show');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    
    if (restaurantSystem.login(username, password)) {
        hideLoginModal();
        const user = restaurantSystem.getCurrentUser();
        showDashboard(user.role);
    } else {
        document.getElementById('loginError').classList.add('show');
    }
}

// ============================================
// DASHBOARD CONTAINER
// ============================================

function createDashboardContainer() {
    const dashboard = document.createElement('div');
    dashboard.className = 'restaurant-dashboard';
    dashboard.id = 'restaurantDashboard';
    document.body.appendChild(dashboard);
}

function showDashboard(role) {
    // Ocultar página principal
    document.querySelector('main').style.display = 'none';
    document.querySelector('header').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    document.querySelector('.chatbot-button').style.display = 'none';
    
    // Mostrar dashboard
    const dashboard = document.getElementById('restaurantDashboard');
    dashboard.classList.add('active');
    
    // Cargar interfaz según rol
    switch(role) {
        case 'ipad':
            loadIPadInterface();
            break;
        case 'waiter':
            loadWaiterInterface();
            break;
        case 'bar':
            loadBarInterface();
            break;
        case 'admin':
            loadAdminInterface();
            break;
    }
}

function hideDashboard() {
    document.querySelector('main').style.display = 'block';
    document.querySelector('header').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
    document.querySelector('.chatbot-button').style.display = 'flex';
    document.getElementById('restaurantDashboard').classList.remove('active');
    document.getElementById('restaurantDashboard').innerHTML = '';
}

function handleLogout() {
    // Limpiar información del cliente
    sessionStorage.removeItem('customer_info');
    restaurantSystem.logout();
    hideDashboard();
}

// ============================================
// iPAD INTERFACE
// ============================================

function loadIPadInterface() {
    const user = restaurantSystem.getCurrentUser();
    const currentTable = sessionStorage.getItem('current_table');
    const customerInfo = sessionStorage.getItem('customer_info');
    
    const dashboard = document.getElementById('restaurantDashboard');
    dashboard.innerHTML = `
        <div class="dashboard-header">
            <h1>🍽️ ${user.device}</h1>
            <div class="dashboard-user-info">
                <span>${user.username}</span>
                <button class="btn-logout" onclick="handleLogout()">Cerrar Sesión</button>
            </div>
        </div>
        
        <div class="dashboard-content">
            <div class="ipad-interface">
                ${currentTable ? (customerInfo ? loadTableMenu(currentTable) : loadCustomerWelcome(currentTable)) : `
                    <div class="table-selector">
                        <h2>Iniciar Mesa</h2>
                        <p style="color: var(--text-light); margin-bottom: 2rem;">Ingrese el número de mesa</p>
                        <input type="number" id="tableNumberInput" min="1" max="99" placeholder="Ej: 5">
                        <br>
                        <button onclick="startTableSession()">Iniciar Mesa</button>
                    </div>
                `}
            </div>
        </div>
    `;
}

function startTableSession() {
    const tableNumber = document.getElementById('tableNumberInput').value;
    
    if (!tableNumber) {
        alert('Por favor ingrese un número de mesa');
        return;
    }
    
    if (restaurantSystem.startTable(tableNumber)) {
        // No guardar customer_info aún, se pedirá en la siguiente pantalla
        sessionStorage.removeItem('customer_info');
        loadIPadInterface();
    } else {
        alert('Esta mesa ya está activa. Por favor elija otro número.');
    }
}

// ============================================
// CUSTOMER WELCOME SCREEN
// ============================================

function loadCustomerWelcome(tableNumber) {
    return `
        <div class="customer-welcome-container">
            <div class="welcome-header">
                <div class="logo-welcome">🍽️</div>
                <h1 class="restaurant-name-welcome">SOLOMON'S LANDING</h1>
                <p class="welcome-subtitle">Bienvenido a su experiencia gastronómica</p>
            </div>
            
            <div class="welcome-card">
                <div class="welcome-card-header">
                    <h2>👋 ¡Bienvenido!</h2>
                    <p>Mesa #${tableNumber}</p>
                </div>
                
                <div class="welcome-form">
                    <div class="form-section">
                        <label for="customerName">
                            <span class="label-icon">👤</span>
                            <span>Nombre (opcional)</span>
                        </label>
                        <input type="text" 
                               id="customerName" 
                               placeholder="Ingrese su nombre"
                               class="welcome-input">
                    </div>
                    
                    <div class="form-section">
                        <label for="customerPreferences">
                            <span class="label-icon">❤️</span>
                            <span>Preferencias Alimentarias</span>
                        </label>
                        <textarea id="customerPreferences" 
                                  placeholder="Ej: Vegetariano, sin gluten, picante, etc."
                                  class="welcome-textarea"
                                  rows="3"></textarea>
                    </div>
                    
                    <div class="form-section">
                        <label for="customerAllergies">
                            <span class="label-icon">⚠️</span>
                            <span>Alergias o Restricciones</span>
                        </label>
                        <textarea id="customerAllergies" 
                                  placeholder="Ej: Mariscos, lactosa, frutos secos, etc."
                                  class="welcome-textarea"
                                  rows="3"></textarea>
                    </div>
                    
                    <div class="form-section">
                        <label for="customerCelebration">
                            <span class="label-icon">🎉</span>
                            <span>¿Alguna Celebración Especial?</span>
                        </label>
                        <textarea id="customerCelebration" 
                                  placeholder="Ej: Cumpleaños, aniversario, etc."
                                  class="welcome-textarea"
                                  rows="2"></textarea>
                    </div>
                    
                    <button class="btn-continue-menu" onclick="saveCustomerInfoAndContinue()">
                        <span>Continuar al Menú</span>
                        <span style="font-size: 1.5rem;">→</span>
                    </button>
                    
                    <p class="privacy-note">
                        <span style="opacity: 0.7;">🔒 Su información es privada y solo se usa para mejorar su experiencia</span>
                    </p>
                </div>
            </div>
        </div>
    `;
}

function saveCustomerInfoAndContinue() {
    const customerInfo = {
        name: document.getElementById('customerName').value.trim(),
        preferences: document.getElementById('customerPreferences').value.trim(),
        allergies: document.getElementById('customerAllergies').value.trim(),
        celebration: document.getElementById('customerCelebration').value.trim(),
        timestamp: new Date().toISOString()
    };
    
    // Guardar en sessionStorage
    sessionStorage.setItem('customer_info', JSON.stringify(customerInfo));
    
    // Guardar en la mesa
    const currentTable = sessionStorage.getItem('current_table');
    const table = restaurantSystem.getTable(currentTable);
    if (table) {
        table.customerInfo = customerInfo;
        restaurantSystem.saveData();
    }
    
    // Recargar interfaz para mostrar menú
    loadIPadInterface();
}

function loadTableMenu(tableNumber) {
    const table = restaurantSystem.getTable(tableNumber);
    const menuData = getMenuData();
    
    return `
        <div class="table-info-bar" style="background: var(--primary-color); color: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h3 style="margin: 0; font-size: 2rem;">Mesa #${tableNumber}</h3>
                <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Iniciada: ${restaurantSystem.formatTime(table.startTime)}</p>
            </div>
            <div style="text-align: right;">
                <p style="margin: 0; font-size: 1rem; opacity: 0.9;">Total Actual</p>
                <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: 800;">${restaurantSystem.formatCurrency(table.total)}</p>
            </div>
        </div>
        
        <div class="menu-display active">
            ${menuData.categories.map(category => `
                <div class="menu-category">
                    <h3>${category.name}</h3>
                    <div class="menu-items-grid">
                        ${category.items.map(item => `
                            <div class="menu-item-card" id="item-${item.id}">
                                <h4>${item.name}</h4>
                                <div class="price">${restaurantSystem.formatCurrency(item.price)}</div>
                                <p class="description">${item.description}</p>
                                <div class="quantity-controls">
                                    <button onclick="updateQuantity(${item.id}, -1)">−</button>
                                    <span id="qty-${item.id}">0</span>
                                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="order-summary" id="orderSummary">
            <div class="order-summary-content">
                <div>
                    <span style="font-size: 1.2rem; color: var(--text-light);">Subtotal del pedido:</span>
                    <div class="order-total" id="orderTotal">${restaurantSystem.formatCurrency(0)}</div>
                </div>
                <button class="btn-place-order" onclick="placeOrder()">Enviar Pedido</button>
            </div>
        </div>
        
        ${table.orders.length > 0 ? `
            <div class="orders-history">
                <h3>📋 Historial de Pedidos</h3>
                ${table.orders.map(order => `
                    <div class="order-card">
                        <div class="order-time">⏰ ${restaurantSystem.formatTime(order.time)}</div>
                        <div class="order-items">
                            ${order.items.map(item => `
                                <div>${item.quantity}x ${item.name} - ${restaurantSystem.formatCurrency(item.adjustedPrice * item.quantity)}</div>
                            `).join('')}
                        </div>
                        <div class="order-total">${restaurantSystem.formatCurrency(order.total)}</div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;
}

// Carrito temporal
let currentCart = {};

function updateQuantity(itemId, change) {
    if (!currentCart[itemId]) {
        currentCart[itemId] = 0;
    }
    
    currentCart[itemId] = Math.max(0, currentCart[itemId] + change);
    
    document.getElementById(`qty-${itemId}`).textContent = currentCart[itemId];
    
    // Actualizar total
    updateOrderTotal();
}

function updateOrderTotal() {
    const menuData = getMenuData();
    let total = 0;
    let hasItems = false;
    
    Object.keys(currentCart).forEach(itemId => {
        const qty = currentCart[itemId];
        if (qty > 0) {
            hasItems = true;
            const item = findMenuItem(parseInt(itemId), menuData);
            if (item) {
                total += item.price * qty;
            }
        }
    });
    
    document.getElementById('orderTotal').textContent = restaurantSystem.formatCurrency(total);
    
    if (hasItems) {
        document.getElementById('orderSummary').classList.add('active');
    } else {
        document.getElementById('orderSummary').classList.remove('active');
    }
}

function placeOrder() {
    const tableNumber = sessionStorage.getItem('current_table');
    const menuData = getMenuData();
    const items = [];
    
    Object.keys(currentCart).forEach(itemId => {
        const qty = currentCart[itemId];
        if (qty > 0) {
            const item = findMenuItem(parseInt(itemId), menuData);
            if (item) {
                items.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: qty,
                    description: item.description
                });
            }
        }
    });
    
    if (items.length === 0) {
        alert('Por favor seleccione al menos un artículo');
        return;
    }
    
    const result = restaurantSystem.addOrder(tableNumber, items);
    
    if (result.success) {
        alert('✅ Pedido enviado exitosamente!');
        currentCart = {};
        loadIPadInterface();
    } else {
        alert('❌ Error: ' + result.message);
    }
}

function findMenuItem(id, menuData) {
    for (const category of menuData.categories) {
        const item = category.items.find(item => item.id === id);
        if (item) return item;
    }
    return null;
}

// ============================================
// MESEROS INTERFACE
// ============================================

function loadWaiterInterface() {
    const user = restaurantSystem.getCurrentUser();
    const tables = restaurantSystem.getAllTables();
    
    const dashboard = document.getElementById('restaurantDashboard');
    dashboard.innerHTML = `
        <div class="dashboard-header">
            <h1>👨‍🍳 Panel de Meseros</h1>
            <div class="dashboard-user-info">
                <span>${user.device}</span>
                <button class="btn-logout" onclick="handleLogout()">Cerrar Sesión</button>
            </div>
        </div>
        
        <div class="dashboard-content">
            <h2 style="color: var(--primary-color); margin-bottom: 2rem;">Mesas Activas</h2>
            <div class="tables-grid">
                ${Object.values(tables).map(table => `
                    <div class="table-card">
                        <div class="table-number">Mesa #${table.number}</div>
                        <div class="table-info">📱 Dispositivo: ${table.device}</div>
                        <div class="table-info">⏰ Inicio: ${restaurantSystem.formatTime(table.startTime)}</div>
                        <div class="table-info">🍽️ Pedidos: ${table.orders.length}</div>
                        <div class="table-total">Total: ${restaurantSystem.formatCurrency(table.total)}</div>
                        <button onclick="viewTableDetails(${table.number})" style="width: 100%; margin-top: 1rem; padding: 0.75rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Ver Detalles</button>
                        <button onclick="closeTableConfirm(${table.number})" style="width: 100%; margin-top: 0.5rem; padding: 0.75rem; background: #c41e3a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Cerrar Mesa</button>
                    </div>
                `).join('') || '<p style="text-align: center; color: var(--text-light); font-size: 1.2rem;">No hay mesas activas</p>'}
            </div>
        </div>
    `;
    
    // Auto-refresh cada 30 segundos
    setTimeout(() => {
        if (document.getElementById('restaurantDashboard').classList.contains('active')) {
            loadWaiterInterface();
        }
    }, 30000);
}

function viewTableDetails(tableNumber) {
    const table = restaurantSystem.getTable(tableNumber);
    if (!table) return;
    
    const details = `
        Mesa #${tableNumber}
        
        Inicio: ${restaurantSystem.formatTime(table.startTime)}
        Dispositivo: ${table.device}
        
        Pedidos (${table.orders.length}):
        ${table.orders.map((order, index) => `
        
        Pedido #${index + 1} - ${restaurantSystem.formatTime(order.time)}
        ${order.items.map(item => `  • ${item.quantity}x ${item.name} - ${restaurantSystem.formatCurrency(item.adjustedPrice * item.quantity)}`).join('\n')}
        Subtotal: ${restaurantSystem.formatCurrency(order.total)}
        `).join('\n')}
        
        TOTAL MESA: ${restaurantSystem.formatCurrency(table.total)}
    `;
    
    alert(details);
}

function closeTableConfirm(tableNumber) {
    const table = restaurantSystem.getTable(tableNumber);
    if (confirm(`¿Cerrar Mesa #${tableNumber}?\n\nTotal: ${restaurantSystem.formatCurrency(table.total)}`)) {
        restaurantSystem.closeTable(tableNumber);
        loadWaiterInterface();
    }
}

// ============================================
// BAR INTERFACE (Similar a Meseros)
// ============================================

function loadBarInterface() {
    loadWaiterInterface(); // Por ahora usa la misma interfaz
}

// ============================================
// ADMIN INTERFACE
// ============================================

function loadAdminInterface() {
    const user = restaurantSystem.getCurrentUser();
    const stats = restaurantSystem.getStats();
    const todayStats = restaurantSystem.getTodayStats();
    const tables = restaurantSystem.getAllTables();
    const currentAdjustment = restaurantSystem.getPriceAdjustment();
    
    const dashboard = document.getElementById('restaurantDashboard');
    dashboard.innerHTML = `
        <div class="dashboard-header">
            <h1>👑 Panel de Administrador</h1>
            <div class="dashboard-user-info">
                <span>${user.device}</span>
                <button class="btn-logout" onclick="handleLogout()">Cerrar Sesión</button>
            </div>
        </div>
        
        <div class="dashboard-content">
            <!-- Estadísticas -->
            <div class="admin-controls">
                <div class="admin-card">
                    <h3>💰 Ventas Totales</h3>
                    <div class="stat-value">${restaurantSystem.formatCurrency(stats.totalSales)}</div>
                    <div class="stat-label">Acumulado</div>
                </div>
                <div class="admin-card">
                    <h3>📊 Ventas Hoy</h3>
                    <div class="stat-value">${restaurantSystem.formatCurrency(todayStats.sales)}</div>
                    <div class="stat-label">${todayStats.tables} mesas</div>
                </div>
                <div class="admin-card">
                    <h3>🍽️ Mesas Activas</h3>
                    <div class="stat-value">${Object.keys(tables).length}</div>
                    <div class="stat-label">En este momento</div>
                </div>
            </div>
            
            <!-- Ajuste de Precios -->
            <div class="price-adjustment">
                <h3>💵 Ajuste de Precios del Menú</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">Actual: ${currentAdjustment > 0 ? '+' : ''}${currentAdjustment}%</p>
                <div class="price-buttons">
                    <button class="${currentAdjustment === 0 ? 'active' : ''}" onclick="adjustPrices(0)">Normal (0%)</button>
                    <button class="${currentAdjustment === 5 ? 'active' : ''}" onclick="adjustPrices(5)">+5%</button>
                    <button class="${currentAdjustment === 10 ? 'active' : ''}" onclick="adjustPrices(10)">+10%</button>
                    <button class="${currentAdjustment === 15 ? 'active' : ''}" onclick="adjustPrices(15)">+15%</button>
                </div>
            </div>
            
            <!-- Mesas Activas -->
            <h2 style="color: var(--primary-color); margin-bottom: 2rem;">Mesas Activas</h2>
            <div class="tables-grid">
                ${Object.values(tables).map(table => `
                    <div class="table-card">
                        <div class="table-number">Mesa #${table.number}</div>
                        <div class="table-info">📱 ${table.device}</div>
                        <div class="table-info">⏰ ${restaurantSystem.formatTime(table.startTime)}</div>
                        <div class="table-info">🍽️ ${table.orders.length} pedidos</div>
                        <div class="table-total">${restaurantSystem.formatCurrency(table.total)}</div>
                        <button onclick="viewTableDetails(${table.number})" style="width: 100%; margin-top: 1rem; padding: 0.75rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">Ver Detalles</button>
                    </div>
                `).join('') || '<p style="text-align: center; color: var(--text-light);">No hay mesas activas</p>'}
            </div>
        </div>
    `;
    
    // Auto-refresh cada 30 segundos
    setTimeout(() => {
        if (document.getElementById('restaurantDashboard').classList.contains('active')) {
            loadAdminInterface();
        }
    }, 30000);
}

function adjustPrices(percentage) {
    if (restaurantSystem.adjustMenuPrices(percentage)) {
        alert(`✅ Precios ajustados a ${percentage > 0 ? '+' : ''}${percentage}%`);
        loadAdminInterface();
    }
}

// ============================================
// MENU DATA
// ============================================

function getMenuData() {
    // Este menú se puede cargar dinámicamente desde la página de menús
    return {
        categories: [
            {
                name: "🦞 Seafood Specialties",
                items: [
                    { id: 1, name: "Grilled Lobster", price: 45.99, description: "Fresh Maine lobster with garlic butter" },
                    { id: 2, name: "Shrimp Cocktail", price: 18.99, description: "Jumbo shrimp with cocktail sauce" },
                    { id: 3, name: "Seared Scallops", price: 32.99, description: "Pan-seared sea scallops with risotto" },
                    { id: 4, name: "Fish & Chips", price: 22.99, description: "Beer-battered cod with fries" }
                ]
            },
            {
                name: "🥩 Prime Cuts",
                items: [
                    { id: 5, name: "Ribeye Steak", price: 42.99, description: "16oz USDA Prime ribeye" },
                    { id: 6, name: "Filet Mignon", price: 48.99, description: "8oz center-cut tenderloin" },
                    { id: 7, name: "NY Strip", price: 39.99, description: "14oz New York strip steak" },
                    { id: 8, name: "Lamb Chops", price: 36.99, description: "Grilled lamb chops with mint jus" }
                ]
            },
            {
                name: "🍝 Pasta & Risotto",
                items: [
                    { id: 9, name: "Seafood Linguine", price: 28.99, description: "Linguine with mixed seafood" },
                    { id: 10, name: "Mushroom Risotto", price: 24.99, description: "Creamy risotto with wild mushrooms" },
                    { id: 11, name: "Carbonara", price: 21.99, description: "Classic Italian carbonara" },
                    { id: 12, name: "Lobster Ravioli", price: 32.99, description: "Homemade ravioli with lobster filling" }
                ]
            },
            {
                name: "🍹 Beverages",
                items: [
                    { id: 13, name: "Margarita", price: 12.99, description: "Classic lime margarita" },
                    { id: 14, name: "Wine (Glass)", price: 10.99, description: "House red or white" },
                    { id: 15, name: "Beer", price: 6.99, description: "Domestic or import" },
                    { id: 16, name: "Soft Drink", price: 3.99, description: "Coke, Sprite, etc." }
                ]
            },
            {
                name: "🍰 Desserts",
                items: [
                    { id: 17, name: "Chocolate Lava Cake", price: 9.99, description: "Warm chocolate cake with ice cream" },
                    { id: 18, name: "Cheesecake", price: 8.99, description: "New York style cheesecake" },
                    { id: 19, name: "Tiramisu", price: 10.99, description: "Classic Italian tiramisu" },
                    { id: 20, name: "Ice Cream", price: 6.99, description: "Three scoops, various flavors" }
                ]
            }
        ]
    };
}
