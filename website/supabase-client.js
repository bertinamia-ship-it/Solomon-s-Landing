// ============================================
// SUPABASE CLIENT - Sistema de Reservaciones
// Solomon's Landing Restaurant
// ============================================

// Configuración de Supabase
const SUPABASE_CONFIG = {
    url: 'https://xqhpkcogbhiqwmfjdwtb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxaHBrY29nYmhpcXdtZmpkd3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1OTIwNTYsImV4cCI6MjA4MTE2ODA1Nn0.eugQmksnT7KIBYH71kj1pxbotzzSs5HCO6g_9qrlOhU'
};

// Inicializar cliente Supabase
let supabase = null;

function initSupabase() {
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
        console.warn('⚠️ Configura SUPABASE_CONFIG con tu URL y API Key');
        return null;
    }
    
    supabase = window.supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey
    );
    
    console.log('✅ Supabase inicializado');
    return supabase;
}

// ============================================
// API: SETTINGS (Configuración)
// ============================================

async function getSettings() {
    const { data, error } = await supabase
        .from('settings')
        .select('*');
    
    if (error) {
        console.error('Error obteniendo settings:', error);
        return null;
    }
    
    // Convertir array a objeto key-value
    const settings = {};
    data.forEach(item => {
        settings[item.key] = item.value;
    });
    
    return settings;
}

async function updateSetting(key, value) {
    const { data, error } = await supabase
        .from('settings')
        .update({ value, updated_at: new Date() })
        .eq('key', key)
        .select();
    
    if (error) {
        console.error('Error actualizando setting:', error);
        return null;
    }
    
    return data[0];
}

// ============================================
// API: TABLES (Mesas)
// ============================================

async function getAllTables() {
    const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('is_active', true)
        .order('table_number');
    
    if (error) {
        console.error('Error obteniendo mesas:', error);
        return [];
    }
    
    return data;
}

async function getTableById(tableId) {
    const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('id', tableId)
        .single();
    
    if (error) {
        console.error('Error obteniendo mesa:', error);
        return null;
    }
    
    return data;
}

// ============================================
// API: RESERVATIONS (Reservaciones)
// ============================================

async function createReservation(reservationData) {
    const { data, error } = await supabase
        .from('reservations')
        .insert([{
            customer_name: reservationData.name,
            customer_email: reservationData.email,
            customer_phone: reservationData.phone,
            reservation_date: reservationData.date,
            reservation_time: reservationData.time,
            party_size: reservationData.partySize,
            special_requests: reservationData.specialRequests || null,
            table_id: reservationData.tableId || null,
            status: 'pending',
            lock_expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutos
        }])
        .select();
    
    if (error) {
        console.error('Error creando reservación:', error);
        return { success: false, error: error.message };
    }
    
    return { success: true, reservation: data[0] };
}

async function getReservationById(reservationId) {
    const { data, error } = await supabase
        .from('reservations')
        .select(`
            *,
            table:tables(table_number, capacity),
            payment:payments(*)
        `)
        .eq('id', reservationId)
        .single();
    
    if (error) {
        console.error('Error obteniendo reservación:', error);
        return null;
    }
    
    return data;
}

async function getReservationByConfirmation(confirmationCode) {
    const { data, error } = await supabase
        .from('reservations')
        .select(`
            *,
            table:tables(table_number, capacity),
            payment:payments(*)
        `)
        .eq('confirmation_code', confirmationCode)
        .single();
    
    if (error) {
        console.error('Error obteniendo reservación:', error);
        return null;
    }
    
    return data;
}

async function updateReservationStatus(reservationId, status) {
    const { data, error } = await supabase
        .from('reservations')
        .update({ status, updated_at: new Date() })
        .eq('id', reservationId)
        .select();
    
    if (error) {
        console.error('Error actualizando estado:', error);
        return null;
    }
    
    return data[0];
}

async function getReservationsByDate(date) {
    const { data, error } = await supabase
        .from('reservations')
        .select(`
            *,
            table:tables(table_number, capacity),
            payment:payments(status)
        `)
        .eq('reservation_date', date)
        .in('status', ['pending', 'confirmed'])
        .order('reservation_time');
    
    if (error) {
        console.error('Error obteniendo reservaciones:', error);
        return [];
    }
    
    return data;
}

// ============================================
// API: AVAILABILITY (Disponibilidad)
// ============================================

async function checkAvailability(date, time, partySize) {
    // 1. Obtener configuración
    const settings = await getSettings();
    const maxCapacity = settings.capacity.max_per_hour;
    const tableDuration = settings.capacity.table_duration_minutes;
    
    // 2. Calcular ventana de tiempo (ej: 90 min antes y después)
    const timeWindow = calculateTimeWindow(time, tableDuration);
    
    // 3. Obtener reservaciones en esa ventana
    const { data: reservations, error } = await supabase
        .from('reservations')
        .select('party_size, reservation_time, table_id')
        .eq('reservation_date', date)
        .in('status', ['pending', 'confirmed'])
        .gte('reservation_time', timeWindow.start)
        .lte('reservation_time', timeWindow.end);
    
    if (error) {
        console.error('Error verificando disponibilidad:', error);
        return { available: false, reason: 'Error al verificar' };
    }
    
    // 4. Calcular capacidad usada
    const usedCapacity = reservations.reduce((sum, r) => sum + r.party_size, 0);
    
    // 5. Verificar si hay espacio
    if (usedCapacity + partySize > maxCapacity) {
        return { 
            available: false, 
            reason: `Capacidad excedida (${usedCapacity}/${maxCapacity})` 
        };
    }
    
    // 6. Encontrar mesa disponible
    const availableTable = await findAvailableTable(date, time, partySize, reservations);
    
    if (!availableTable) {
        return { 
            available: false, 
            reason: 'No hay mesas disponibles del tamaño necesario' 
        };
    }
    
    return { 
        available: true, 
        tableId: availableTable.id,
        tableNumber: availableTable.table_number,
        capacity: availableTable.capacity
    };
}

function calculateTimeWindow(time, durationMinutes) {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    const startMinutes = Math.max(0, totalMinutes - durationMinutes);
    const endMinutes = Math.min(1439, totalMinutes + durationMinutes); // 23:59
    
    const startHours = Math.floor(startMinutes / 60);
    const startMins = startMinutes % 60;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    
    return {
        start: `${String(startHours).padStart(2, '0')}:${String(startMins).padStart(2, '0')}`,
        end: `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
    };
}

async function findAvailableTable(date, time, partySize, existingReservations) {
    // 1. Obtener todas las mesas
    const allTables = await getAllTables();
    
    // 2. Determinar capacidad necesaria
    let requiredCapacity;
    if (partySize <= 2) requiredCapacity = 2;
    else if (partySize <= 4) requiredCapacity = 4;
    else if (partySize <= 6) requiredCapacity = 6;
    else return null; // Grupo muy grande
    
    // 3. Filtrar mesas del tamaño adecuado
    const suitableTables = allTables.filter(t => t.capacity === requiredCapacity);
    
    // 4. Encontrar una mesa no reservada
    const reservedTableIds = existingReservations.map(r => r.table_id).filter(Boolean);
    
    const availableTable = suitableTables.find(table => 
        !reservedTableIds.includes(table.id)
    );
    
    return availableTable || null;
}

// ============================================
// API: PAYMENTS (Pagos Stripe)
// ============================================

async function createPaymentRecord(reservationId, stripeIntentId, amountCents) {
    const { data, error } = await supabase
        .from('payments')
        .insert([{
            reservation_id: reservationId,
            stripe_payment_intent_id: stripeIntentId,
            amount_cents: amountCents,
            status: 'pending'
        }])
        .select();
    
    if (error) {
        console.error('Error creando registro de pago:', error);
        return null;
    }
    
    return data[0];
}

async function updatePaymentStatus(stripeIntentId, status, metadata = {}) {
    const { data, error } = await supabase
        .from('payments')
        .update({ 
            status, 
            updated_at: new Date(),
            ...metadata 
        })
        .eq('stripe_payment_intent_id', stripeIntentId)
        .select();
    
    if (error) {
        console.error('Error actualizando pago:', error);
        return null;
    }
    
    return data[0];
}

// ============================================
// API: BLOCKED SLOTS (Horarios bloqueados)
// ============================================

async function blockTimeSlot(tableId, date, time, reason) {
    const { data, error } = await supabase
        .from('blocked_slots')
        .insert([{
            table_id: tableId,
            blocked_date: date,
            blocked_time: time,
            reason
        }])
        .select();
    
    if (error) {
        console.error('Error bloqueando horario:', error);
        return null;
    }
    
    return data[0];
}

async function getBlockedSlots(date) {
    const { data, error } = await supabase
        .from('blocked_slots')
        .select('*, table:tables(table_number)')
        .eq('blocked_date', date);
    
    if (error) {
        console.error('Error obteniendo horarios bloqueados:', error);
        return [];
    }
    
    return data;
}

// ============================================
// REAL-TIME: Subscripciones
// ============================================

function subscribeToReservations(date, callback) {
    const subscription = supabase
        .channel('reservations-channel')
        .on('postgres_changes', 
            { 
                event: '*', 
                schema: 'public', 
                table: 'reservations',
                filter: `reservation_date=eq.${date}`
            }, 
            payload => {
                console.log('Cambio en reservaciones:', payload);
                callback(payload);
            }
        )
        .subscribe();
    
    return subscription;
}

function unsubscribeFromReservations(subscription) {
    if (subscription) {
        supabase.removeChannel(subscription);
    }
}

// ============================================
// UTILIDADES
// ============================================

async function cleanExpiredLocks() {
    const { data, error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('status', 'pending')
        .lt('lock_expires_at', new Date().toISOString())
        .select();
    
    if (error) {
        console.error('Error limpiando locks expirados:', error);
        return 0;
    }
    
    return data.length;
}

// Ejecutar limpieza cada 5 minutos
setInterval(cleanExpiredLocks, 5 * 60 * 1000);

// ============================================
// EXPORTAR API
// ============================================

const SupabaseAPI = {
    init: initSupabase,
    
    // Settings
    getSettings,
    updateSetting,
    
    // Tables
    getAllTables,
    getTableById,
    
    // Reservations
    createReservation,
    getReservationById,
    getReservationByConfirmation,
    updateReservationStatus,
    getReservationsByDate,
    
    // Availability
    checkAvailability,
    
    // Payments
    createPaymentRecord,
    updatePaymentStatus,
    
    // Blocked Slots
    blockTimeSlot,
    getBlockedSlots,
    
    // Real-time
    subscribeToReservations,
    unsubscribeFromReservations,
    
    // Utils
    cleanExpiredLocks
};

// Auto-inicializar si está disponible
if (typeof window !== 'undefined') {
    window.SupabaseAPI = SupabaseAPI;
}
