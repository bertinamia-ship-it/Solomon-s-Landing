// Admin Panel JS - Solomon's Landing
// Sistema de gestión de reservaciones

let currentReservations = [];
let currentStats = {
    today: 0,
    pending: 0,
    capacity: 0,
    holds: 0
};

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', async () => {
    await initializeDashboard();
    setDefaultDate();
    await loadReservations();
    subscribeToChanges();
});

// ===== TAB NAVIGATION =====
function switchTab(tabName) {
    // Ocultar todos
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar seleccionado
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Inicializar según tab
    if (tabName === 'dashboard') {
        initializeDashboard();
    } else if (tabName === 'tables') {
        initializeTableManagement();
    }
}

// ===== DASHBOARD =====
async function initializeDashboard() {
    // Cargar estadísticas
    await loadStats();

    // Inicializar mapa de mesas
    const mapContainer = document.getElementById('table-map');
    if (mapContainer && !mapContainer.classList.contains('initialized')) {
        const tableMap = new TableMap('table-map');
        await tableMap.render();
        mapContainer.classList.add('initialized');
    }
}

async function loadStats() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Reservaciones de hoy
        const { data: todayReservations, error: todayError } = await window.supabaseClient
            .from('reservations')
            .select('*')
            .gte('reservation_date', today)
            .lt('reservation_date', new Date(Date.now() + 86400000).toISOString().split('T')[0]);

        if (!todayError) {
            currentStats.today = todayReservations.length;
            
            // Contar pendientes
            currentStats.pending = todayReservations.filter(r => r.status === 'pending').length;
            
            // Calcular capacidad actual
            const confirmed = todayReservations.filter(r => 
                r.status === 'confirmed' || r.status === 'pending'
            );
            currentStats.capacity = confirmed.reduce((sum, r) => sum + r.party_size, 0);
        }

        // Calcular holds activos
        const { data: payments, error: paymentsError } = await window.supabaseClient
            .from('payments')
            .select('hold_amount')
            .eq('status', 'authorized');

        if (!paymentsError) {
            currentStats.holds = payments.reduce((sum, p) => sum + (p.hold_amount || 0), 0);
        }

        // Actualizar UI
        updateStatsUI();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function updateStatsUI() {
    document.getElementById('stat-today').textContent = currentStats.today;
    document.getElementById('stat-pending').textContent = currentStats.pending;
    document.getElementById('stat-capacity').textContent = `${currentStats.capacity}/80`;
    document.getElementById('stat-holds').textContent = `$${currentStats.holds}`;
}

// ===== RESERVACIONES =====
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filter-date').value = today;
}

async function loadReservations() {
    const dateFilter = document.getElementById('filter-date').value;
    const statusFilter = document.getElementById('filter-status').value;
    const searchFilter = document.getElementById('filter-search').value.toLowerCase();

    try {
        let query = window.supabaseClient
            .from('reservations')
            .select(`
                *,
                tables (table_number, capacity),
                payments (status, hold_amount, payment_intent_id)
            `)
            .order('reservation_date', { ascending: true })
            .order('reservation_time', { ascending: true });

        // Aplicar filtros
        if (dateFilter) {
            query = query.eq('reservation_date', dateFilter);
        }
        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Filtrar por búsqueda
        currentReservations = data.filter(r => {
            if (!searchFilter) return true;
            return (
                r.customer_name.toLowerCase().includes(searchFilter) ||
                r.customer_email.toLowerCase().includes(searchFilter) ||
                r.confirmation_code.toLowerCase().includes(searchFilter)
            );
        });

        renderReservations();
    } catch (error) {
        console.error('Error loading reservations:', error);
        showError('Error al cargar reservaciones');
    }
}

function renderReservations() {
    const tbody = document.getElementById('reservations-tbody');
    
    if (currentReservations.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem; color: #999;">
                    No hay reservaciones que coincidan con los filtros
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = currentReservations.map(reservation => {
        const statusBadge = getStatusBadge(reservation.status);
        const holdAmount = reservation.payments?.[0]?.hold_amount || 0;
        const tableNumber = reservation.tables?.table_number || 'N/A';
        
        return `
            <tr>
                <td><strong>${reservation.confirmation_code}</strong></td>
                <td>
                    ${reservation.customer_name}<br>
                    <small style="color: #666;">${reservation.customer_email}</small>
                </td>
                <td>${formatDate(reservation.reservation_date)}</td>
                <td>${reservation.reservation_time}</td>
                <td>${reservation.party_size}</td>
                <td>Mesa #${tableNumber}</td>
                <td>${statusBadge}</td>
                <td>$${holdAmount}</td>
                <td class="table-actions">
                    <button class="btn btn-primary" onclick="editReservation('${reservation.id}')">
                        ✏️
                    </button>
                    ${reservation.status === 'pending' ? `
                        <button class="btn btn-success" onclick="confirmReservation('${reservation.id}')">
                            ✓
                        </button>
                    ` : ''}
                    ${reservation.status === 'confirmed' && reservation.payments?.[0]?.payment_intent_id ? `
                        <button class="btn btn-danger" onclick="captureHold('${reservation.id}')">
                            💰
                        </button>
                    ` : ''}
                    <button class="btn btn-danger" onclick="cancelReservation('${reservation.id}')">
                        ✕
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function getStatusBadge(status) {
    const badges = {
        pending: '<span style="background: #ffc107; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">PENDIENTE</span>',
        confirmed: '<span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">CONFIRMADA</span>',
        completed: '<span style="background: #6c757d; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">COMPLETADA</span>',
        cancelled: '<span style="background: #dc3545; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">CANCELADA</span>',
        no_show: '<span style="background: #000; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">NO-SHOW</span>'
    };
    return badges[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
    });
}

// ===== ACCIONES DE RESERVACIONES =====
async function editReservation(reservationId) {
    const reservation = currentReservations.find(r => r.id === reservationId);
    if (!reservation) return;

    const modal = document.getElementById('edit-modal');
    const form = document.getElementById('edit-form');

    // Cargar mesas disponibles
    const { data: tables } = await window.supabaseClient
        .from('tables')
        .select('*')
        .order('table_number');

    form.innerHTML = `
        <div class="form-group">
            <label>Nombre del cliente:</label>
            <input type="text" id="edit-name" value="${reservation.customer_name}">
        </div>
        <div class="form-group">
            <label>Email:</label>
            <input type="email" id="edit-email" value="${reservation.customer_email}">
        </div>
        <div class="form-group">
            <label>Teléfono:</label>
            <input type="tel" id="edit-phone" value="${reservation.customer_phone || ''}">
        </div>
        <div class="form-group">
            <label>Fecha:</label>
            <input type="date" id="edit-date" value="${reservation.reservation_date}">
        </div>
        <div class="form-group">
            <label>Hora:</label>
            <input type="time" id="edit-time" value="${reservation.reservation_time}">
        </div>
        <div class="form-group">
            <label>Número de personas:</label>
            <input type="number" id="edit-party" value="${reservation.party_size}" min="1" max="12">
        </div>
        <div class="form-group">
            <label>Mesa:</label>
            <select id="edit-table">
                ${tables.map(t => `
                    <option value="${t.id}" ${t.id === reservation.table_id ? 'selected' : ''}>
                        Mesa #${t.table_number} (${t.capacity} personas)
                    </option>
                `).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Estado:</label>
            <select id="edit-status">
                <option value="pending" ${reservation.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                <option value="confirmed" ${reservation.status === 'confirmed' ? 'selected' : ''}>Confirmada</option>
                <option value="completed" ${reservation.status === 'completed' ? 'selected' : ''}>Completada</option>
                <option value="cancelled" ${reservation.status === 'cancelled' ? 'selected' : ''}>Cancelada</option>
                <option value="no_show" ${reservation.status === 'no_show' ? 'selected' : ''}>No-show</option>
            </select>
        </div>
        <div class="form-group">
            <label>Notas especiales:</label>
            <textarea id="edit-notes" rows="3">${reservation.special_requests || ''}</textarea>
        </div>
        <input type="hidden" id="edit-id" value="${reservation.id}">
    `;

    modal.classList.add('active');
}

async function saveReservation() {
    const id = document.getElementById('edit-id').value;
    const updates = {
        customer_name: document.getElementById('edit-name').value,
        customer_email: document.getElementById('edit-email').value,
        customer_phone: document.getElementById('edit-phone').value,
        reservation_date: document.getElementById('edit-date').value,
        reservation_time: document.getElementById('edit-time').value,
        party_size: parseInt(document.getElementById('edit-party').value),
        table_id: document.getElementById('edit-table').value,
        status: document.getElementById('edit-status').value,
        special_requests: document.getElementById('edit-notes').value
    };

    try {
        const { error } = await window.supabaseClient
            .from('reservations')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        showSuccess('Reservación actualizada');
        closeModal();
        await loadReservations();
        await loadStats();
    } catch (error) {
        console.error('Error updating reservation:', error);
        showError('Error al actualizar reservación');
    }
}

async function confirmReservation(reservationId) {
    if (!confirm('¿Confirmar esta reservación?')) return;

    try {
        const { error } = await window.supabaseClient
            .from('reservations')
            .update({ status: 'confirmed' })
            .eq('id', reservationId);

        if (error) throw error;

        showSuccess('Reservación confirmada');
        await loadReservations();
        await loadStats();
    } catch (error) {
        console.error('Error confirming reservation:', error);
        showError('Error al confirmar reservación');
    }
}

async function cancelReservation(reservationId) {
    if (!confirm('¿Cancelar esta reservación? Se liberará el hold si existe.')) return;

    const reservation = currentReservations.find(r => r.id === reservationId);
    
    try {
        // Actualizar estado
        const { error: updateError } = await window.supabaseClient
            .from('reservations')
            .update({ status: 'cancelled' })
            .eq('id', reservationId);

        if (updateError) throw updateError;

        // Liberar hold si existe
        if (reservation.payments?.[0]?.payment_intent_id) {
            await releaseHold(reservationId);
        }

        showSuccess('Reservación cancelada');
        await loadReservations();
        await loadStats();
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        showError('Error al cancelar reservación');
    }
}

async function captureHold(reservationId) {
    if (!confirm('¿Capturar el hold? Esto cobrará $20/persona al cliente (no-show).')) return;

    try {
        const response = await fetch('http://localhost:3000/api/stripe/capture-hold', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservation_id: reservationId })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        showSuccess('Hold capturado exitosamente');
        await loadReservations();
        await loadStats();
    } catch (error) {
        console.error('Error capturing hold:', error);
        showError('Error al capturar hold: ' + error.message);
    }
}

async function releaseHold(reservationId) {
    try {
        const response = await fetch('http://localhost:3000/api/stripe/release-hold', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservation_id: reservationId })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        return true;
    } catch (error) {
        console.error('Error releasing hold:', error);
        return false;
    }
}

function closeModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

// ===== EXPORTAR CSV =====
function exportToCSV() {
    if (currentReservations.length === 0) {
        alert('No hay reservaciones para exportar');
        return;
    }

    const headers = ['Código', 'Cliente', 'Email', 'Teléfono', 'Fecha', 'Hora', 'Personas', 'Mesa', 'Estado', 'Hold USD', 'Notas'];
    
    const rows = currentReservations.map(r => [
        r.confirmation_code,
        r.customer_name,
        r.customer_email,
        r.customer_phone || '',
        r.reservation_date,
        r.reservation_time,
        r.party_size,
        r.tables?.table_number || 'N/A',
        r.status,
        r.payments?.[0]?.hold_amount || 0,
        (r.special_requests || '').replace(/,/g, ';')
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reservaciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess('Archivo CSV descargado');
}

// ===== TABLE MANAGEMENT =====
async function initializeTableManagement() {
    const mapContainer = document.getElementById('table-map-admin');
    if (mapContainer && !mapContainer.classList.contains('initialized')) {
        const tableMap = new TableMap('table-map-admin');
        await tableMap.render();
        mapContainer.classList.add('initialized');
    }
}

// ===== SETTINGS =====
async function saveSettings() {
    const settings = {
        max_capacity_per_hour: parseInt(document.getElementById('setting-capacity').value),
        table_duration_minutes: parseInt(document.getElementById('setting-duration').value),
        hold_amount_per_person: parseInt(document.getElementById('setting-hold').value),
        max_party_size_online: parseInt(document.getElementById('setting-max-group').value)
    };

    try {
        const { error } = await window.supabaseClient
            .from('settings')
            .upsert({ id: 1, ...settings });

        if (error) throw error;

        showSuccess('Configuración guardada');
    } catch (error) {
        console.error('Error saving settings:', error);
        showError('Error al guardar configuración');
    }
}

// ===== REAL-TIME UPDATES =====
function subscribeToChanges() {
    // Suscribirse a cambios en reservaciones
    window.supabaseClient
        .channel('admin-reservations')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'reservations' },
            payload => {
                console.log('Reservation change:', payload);
                loadReservations();
                loadStats();
            }
        )
        .subscribe();

    // Suscribirse a cambios en pagos
    window.supabaseClient
        .channel('admin-payments')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'payments' },
            payload => {
                console.log('Payment change:', payload);
                loadStats();
            }
        )
        .subscribe();
}

// ===== NOTIFICATIONS =====
function showSuccess(message) {
    alert('✅ ' + message);
}

function showError(message) {
    alert('❌ ' + message);
}
