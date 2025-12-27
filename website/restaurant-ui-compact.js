// ============================================
// COMPACT & OPTIMIZED iPad UI
// ============================================

// Carrito temporal
let currentCart = {};

// Scroll to order details
function scrollToOrderDetails() {
    document.getElementById('orderDetailsSection')?.scrollIntoView({ behavior: 'smooth' });
}

// Toggle cart modal
function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        const isVisible = modal.style.display !== 'none';
        modal.style.display = isVisible ? 'none' : 'flex';
    }
}

// Update quantity
function updateQuantity(itemId, change) {
    if (!currentCart[itemId]) {
        currentCart[itemId] = 0;
    }
    
    currentCart[itemId] = Math.max(0, currentCart[itemId] + change);
    
    const qtyElement = document.getElementById(`qty-${itemId}`);
    if (qtyElement) {
        qtyElement.textContent = currentCart[itemId];
        
        // Animación
        qtyElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            qtyElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Actualizar badge y total en vivo
    updateLiveCart();
}

// Update live cart
function updateLiveCart() {
    const menuData = getMenuData();
    let total = 0;
    let itemCount = 0;
    let cartHTML = '';
    
    Object.keys(currentCart).forEach(itemId => {
        const qty = currentCart[itemId];
        if (qty > 0) {
            const item = findMenuItem(parseInt(itemId), menuData);
            if (item) {
                itemCount += qty;
                const itemTotal = item.price * qty;
                total += itemTotal;
                
                cartHTML += `
                    <div class="cart-modal-item">
                        <span class="cart-modal-qty">${qty}×</span>
                        <span class="cart-modal-name">${item.name}</span>
                        <span class="cart-modal-price">${restaurantSystem.formatCurrency(itemTotal)}</span>
                    </div>
                `;
            }
        }
    });
    
    // Update badge
    const badge = document.getElementById('floatingCartBadge');
    const countBadge = document.getElementById('cartCountBadge');
    const totalBadge = document.getElementById('cartTotalBadge');
    const modalItems = document.getElementById('cartModalItems');
    
    if (badge && countBadge && totalBadge) {
        if (itemCount > 0) {
            badge.style.display = 'flex';
            countBadge.textContent = itemCount;
            totalBadge.textContent = restaurantSystem.formatCurrency(total);
            if (modalItems) modalItems.innerHTML = cartHTML;
        } else {
            badge.style.display = 'none';
        }
    }
}

// Switch category
function switchCategory(categoryIndex) {
    // Update tabs
    document.querySelectorAll('.category-tab-mini').forEach((tab, index) => {
        tab.classList.toggle('active', index === categoryIndex);
    });
    
    // Update sections
    document.querySelectorAll('.category-section').forEach((section, index) => {
        section.classList.toggle('active', index === categoryIndex);
    });
}

// Place order
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
        alert('❌ Por favor seleccione al menos un platillo');
        return;
    }
    
    if (restaurantSystem.addOrder(tableNumber, items)) {
        currentCart = {};
        toggleCartModal();
        loadIPadInterface();
        alert('✅ ¡Pedido enviado a la cocina!');
    } else {
        alert('❌ Error al enviar el pedido');
    }
}

// Request bill
function requestBill() {
    const tableNumber = sessionStorage.getItem('current_table');
    const table = restaurantSystem.getTable(tableNumber);
    const lang = restaurantSystem.getCurrentLanguage();
    
    if (!table || table.orders.length === 0) {
        alert(lang === 'es' ? '⚠️ No hay pedidos para facturar' : '⚠️ No orders to bill');
        return;
    }
    
    table.billRequested = true;
    table.billRequestTime = Date.now();
    restaurantSystem.updateTable(tableNumber, table);
    
    const confirmMsg = lang === 'es' ? 
        '✅ Cuenta solicitada!\n\nTu mesero traerá la cuenta pronto.\n\nTotal: ' + restaurantSystem.formatCurrency(table.total) :
        '✅ Bill requested!\n\nYour waiter will bring the bill soon.\n\nTotal: ' + restaurantSystem.formatCurrency(table.total);
    
    alert(confirmMsg);
    loadIPadInterface();
}

// Find menu item helper
function findMenuItem(itemId, menuData) {
    for (const category of menuData.categories) {
        const found = category.items.find(item => item.id === itemId);
        if (found) return found;
    }
    return null;
}
