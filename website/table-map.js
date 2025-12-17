// ============================================
// CROQUIS VISUAL DE MESAS - TIEMPO REAL
// Solomon's Landing Restaurant
// ============================================

class TableMap {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.selectedDate = options.date || this.getTodayDate();
        this.selectedTime = options.time || '19:00';
        this.tables = [];
        this.reservations = [];
        this.subscription = null;
        this.onTableClick = options.onTableClick || null;
        
        this.init();
    }

    async init() {
        // Cargar mesas
        this.tables = await SupabaseAPI.getAllTables();
        
        // Cargar reservaciones del día
        await this.loadReservations();
        
        // Renderizar
        this.render();
        
        // Subscribirse a cambios en tiempo real
        this.subscribeToChanges();
    }

    async loadReservations() {
        this.reservations = await SupabaseAPI.getReservationsByDate(this.selectedDate);
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="table-map-container">
                <!-- Controles -->
                <div class="map-controls">
                    <div class="control-group">
                        <label>📅 Fecha:</label>
                        <input type="date" id="map-date" value="${this.selectedDate}" />
                    </div>
                    <div class="control-group">
                        <label>🕐 Hora:</label>
                        <input type="time" id="map-time" value="${this.selectedTime}" />
                    </div>
                    <button id="refresh-map" class="btn-refresh">🔄 Actualizar</button>
                </div>

                <!-- Leyenda -->
                <div class="map-legend">
                    <div class="legend-item">
                        <span class="legend-badge available"></span>
                        <span>Disponible</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-badge reserved"></span>
                        <span>Reservada</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-badge pending"></span>
                        <span>Pendiente</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-badge blocked"></span>
                        <span>Bloqueada</span>
                    </div>
                </div>

                <!-- Mapa de mesas -->
                <div class="tables-grid">
                    ${this.renderTables()}
                </div>

                <!-- Info panel -->
                <div id="table-info" class="table-info hidden"></div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderTables() {
        // Agrupar por capacidad
        const tables6 = this.tables.filter(t => t.capacity === 6);
        const tables4 = this.tables.filter(t => t.capacity === 4);
        const tables2 = this.tables.filter(t => t.capacity === 2);

        return `
            <!-- Mesas de 6 -->
            <div class="table-section">
                <h3>Mesas de 6 personas</h3>
                <div class="table-row">
                    ${tables6.map(table => this.renderTable(table)).join('')}
                </div>
            </div>

            <!-- Mesas de 4 -->
            <div class="table-section">
                <h3>Mesas de 4 personas</h3>
                <div class="table-row table-row-4">
                    ${tables4.map(table => this.renderTable(table)).join('')}
                </div>
            </div>

            <!-- Mesa de 2 -->
            <div class="table-section">
                <h3>Mesa de 2 personas</h3>
                <div class="table-row">
                    ${tables2.map(table => this.renderTable(table)).join('')}
                </div>
            </div>
        `;
    }

    renderTable(table) {
        const status = this.getTableStatus(table.id);
        const reservation = this.getTableReservation(table.id);
        
        let statusClass = 'available';
        let statusIcon = '✓';
        let statusText = 'Disponible';

        if (status === 'reserved') {
            statusClass = 'reserved';
            statusIcon = '🔒';
            statusText = 'Reservada';
        } else if (status === 'pending') {
            statusClass = 'pending';
            statusIcon = '⏳';
            statusText = 'Pendiente';
        } else if (status === 'blocked') {
            statusClass = 'blocked';
            statusIcon = '🚫';
            statusText = 'Bloqueada';
        }

        return `
            <div class="table-card ${statusClass}" 
                 data-table-id="${table.id}"
                 data-table-number="${table.table_number}"
                 onclick="tableMap.handleTableClick('${table.id}')">
                <div class="table-number">Mesa ${table.table_number}</div>
                <div class="table-icon">${this.getTableIcon(table.capacity)}</div>
                <div class="table-capacity">${table.capacity} personas</div>
                <div class="table-status">
                    <span class="status-icon">${statusIcon}</span>
                    <span>${statusText}</span>
                </div>
                ${reservation ? `
                    <div class="table-reservation-info">
                        <small>${reservation.reservation_time}</small>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getTableIcon(capacity) {
        if (capacity === 6) return '🪑🪑🪑';
        if (capacity === 4) return '🪑🪑';
        return '🪑';
    }

    getTableStatus(tableId) {
        const reservation = this.getTableReservation(tableId);
        
        if (!reservation) return 'available';
        
        if (reservation.status === 'confirmed') return 'reserved';
        if (reservation.status === 'pending') return 'pending';
        
        return 'available';
    }

    getTableReservation(tableId) {
        return this.reservations.find(r => 
            r.table_id === tableId && 
            r.reservation_time === this.selectedTime &&
            ['pending', 'confirmed'].includes(r.status)
        );
    }

    handleTableClick(tableId) {
        const table = this.tables.find(t => t.id === tableId);
        const reservation = this.getTableReservation(tableId);
        
        if (this.onTableClick) {
            this.onTableClick(table, reservation);
        } else {
            this.showTableInfo(table, reservation);
        }
    }

    showTableInfo(table, reservation) {
        const infoPanel = document.getElementById('table-info');
        if (!infoPanel) return;

        infoPanel.classList.remove('hidden');
        
        if (reservation) {
            infoPanel.innerHTML = `
                <h4>Mesa ${table.table_number} - Reservada</h4>
                <p><strong>Cliente:</strong> ${reservation.customer_name}</p>
                <p><strong>Hora:</strong> ${reservation.reservation_time}</p>
                <p><strong>Personas:</strong> ${reservation.party_size}</p>
                <p><strong>Email:</strong> ${reservation.customer_email}</p>
                <p><strong>Teléfono:</strong> ${reservation.customer_phone}</p>
                <p><strong>Estado:</strong> ${this.getStatusBadge(reservation.status)}</p>
                ${reservation.special_requests ? `<p><strong>Notas:</strong> ${reservation.special_requests}</p>` : ''}
                <button onclick="tableMap.closeInfo()" class="btn-close">Cerrar</button>
            `;
        } else {
            infoPanel.innerHTML = `
                <h4>Mesa ${table.table_number}</h4>
                <p><strong>Capacidad:</strong> ${table.capacity} personas</p>
                <p><strong>Estado:</strong> <span class="badge-available">Disponible</span></p>
                <button onclick="tableMap.closeInfo()" class="btn-close">Cerrar</button>
            `;
        }
    }

    getStatusBadge(status) {
        const badges = {
            'pending': '<span class="badge-pending">⏳ Pendiente</span>',
            'confirmed': '<span class="badge-confirmed">✓ Confirmada</span>',
            'completed': '<span class="badge-completed">✓ Completada</span>',
            'cancelled': '<span class="badge-cancelled">✗ Cancelada</span>',
            'no_show': '<span class="badge-no-show">⚠️ No-show</span>'
        };
        return badges[status] || status;
    }

    closeInfo() {
        const infoPanel = document.getElementById('table-info');
        if (infoPanel) infoPanel.classList.add('hidden');
    }

    attachEventListeners() {
        const dateInput = document.getElementById('map-date');
        const timeInput = document.getElementById('map-time');
        const refreshBtn = document.getElementById('refresh-map');

        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                this.selectedDate = e.target.value;
                this.refresh();
            });
        }

        if (timeInput) {
            timeInput.addEventListener('change', (e) => {
                this.selectedTime = e.target.value;
                this.refresh();
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }
    }

    async refresh() {
        await this.loadReservations();
        this.render();
    }

    subscribeToChanges() {
        this.subscription = SupabaseAPI.subscribeToReservations(
            this.selectedDate,
            (payload) => {
                console.log('🔔 Cambio detectado:', payload);
                this.refresh();
            }
        );
    }

    destroy() {
        if (this.subscription) {
            SupabaseAPI.unsubscribeFromReservations(this.subscription);
        }
    }

    getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }
}

// Exportar
window.TableMap = TableMap;
