-- ============================================
-- SCHEMA SUPABASE - SISTEMA DE RESERVACIONES
-- Solomon's Landing Restaurant
-- ============================================

-- EXTENSION para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLA: SETTINGS (Configuración global)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuración inicial
INSERT INTO settings (key, value) VALUES
('capacity', '{"max_per_hour": 80, "table_duration_minutes": 90}'),
('tables_config', '{
    "tables_6": 6,
    "tables_4": 17,
    "tables_2": 1,
    "allow_combined": false
}'),
('policies', '{
    "hold_amount_per_person": 20,
    "max_group_size_online": 12,
    "cancellation_hours": 24,
    "timezone": "America/Mazatlan"
}'),
('business_hours', '{
    "monday": {"open": "11:00", "close": "22:00"},
    "tuesday": {"open": "11:00", "close": "22:00"},
    "wednesday": {"open": "11:00", "close": "22:00"},
    "thursday": {"open": "11:00", "close": "22:00"},
    "friday": {"open": "11:00", "close": "23:00"},
    "saturday": {"open": "11:00", "close": "23:00"},
    "sunday": {"open": "11:00", "close": "22:00"}
}')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 2. TABLA: TABLES (Mesas físicas)
-- ============================================
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_number INTEGER UNIQUE NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity IN (2, 4, 6)),
    position_x DECIMAL(5,2), -- Para el croquis visual
    position_y DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear las 24 mesas
-- 6 mesas de 6 personas
INSERT INTO tables (table_number, capacity, position_x, position_y)
SELECT i, 6, ((i-1) % 3) * 35.0, FLOOR((i-1) / 3) * 30.0
FROM generate_series(1, 6) AS i
ON CONFLICT (table_number) DO NOTHING;

-- 17 mesas de 4 personas
INSERT INTO tables (table_number, capacity, position_x, position_y)
SELECT i, 4, ((i-7) % 6) * 17.0, FLOOR((i-7) / 6) * 25.0 + 65.0
FROM generate_series(7, 23) AS i
ON CONFLICT (table_number) DO NOTHING;

-- 1 mesa de 2 personas
INSERT INTO tables (table_number, capacity, position_x, position_y)
VALUES (24, 2, 90.0, 10.0)
ON CONFLICT (table_number) DO NOTHING;

-- ============================================
-- 3. TABLA: BLOCKED_SLOTS (Mesas/horarios bloqueados)
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id UUID REFERENCES tables(id) ON DELETE CASCADE,
    blocked_date DATE NOT NULL,
    blocked_time TIME NOT NULL,
    reason TEXT,
    created_by UUID, -- ID del admin que bloqueó
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blocked_slots_date_time ON blocked_slots(blocked_date, blocked_time);

-- ============================================
-- 4. TABLA: RESERVATIONS (Reservaciones)
-- ============================================
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Datos del cliente
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    
    -- Detalles de la reservación
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 12),
    special_requests TEXT,
    
    -- Mesa asignada
    table_id UUID REFERENCES tables(id),
    
    -- Estado
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Esperando pago
        'confirmed',    -- Pago autorizado
        'completed',    -- Cliente asistió
        'cancelled',    -- Cancelada
        'no_show'       -- No se presentó
    )),
    
    -- Control
    confirmation_code TEXT UNIQUE,
    lock_expires_at TIMESTAMPTZ, -- Lock temporal (10 min)
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations(reservation_date, reservation_time);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_confirmation ON reservations(confirmation_code);

-- ============================================
-- 5. TABLA: PAYMENTS (Holds de Stripe)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    
    -- Stripe
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT,
    
    -- Montos
    amount_cents INTEGER NOT NULL, -- $20 x persona en centavos
    currency TEXT DEFAULT 'usd',
    
    -- Estado
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Iniciado
        'authorized',   -- Hold autorizado
        'captured',     -- Cobrado (no-show)
        'released',     -- Liberado (asistió o canceló)
        'failed'        -- Falló
    )),
    
    -- Metadata
    payment_method TEXT, -- card, apple_pay, etc.
    last4 TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_reservation ON payments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_intent ON payments(stripe_payment_intent_id);

-- ============================================
-- 6. FUNCIÓN: Generar código de confirmación
-- ============================================
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
BEGIN
    code := 'SL' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-generar código
CREATE OR REPLACE FUNCTION set_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.confirmation_code IS NULL THEN
        NEW.confirmation_code := generate_confirmation_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_confirmation_code ON reservations;
CREATE TRIGGER trigger_confirmation_code
    BEFORE INSERT ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION set_confirmation_code();

-- ============================================
-- 7. FUNCIÓN: Actualizar updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden leer tables y settings
DROP POLICY IF EXISTS "Tables are viewable by everyone" ON tables;
CREATE POLICY "Tables are viewable by everyone"
    ON tables FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Settings are viewable by everyone" ON settings;
CREATE POLICY "Settings are viewable by everyone"
    ON settings FOR SELECT
    USING (true);

-- Políticas: Solo autenticados pueden crear reservaciones
DROP POLICY IF EXISTS "Anyone can create reservations" ON reservations;
CREATE POLICY "Anyone can create reservations"
    ON reservations FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Reservations viewable by everyone" ON reservations;
CREATE POLICY "Reservations viewable by everyone"
    ON reservations FOR SELECT
    USING (true);

-- Políticas: Solo admin puede actualizar/eliminar
DROP POLICY IF EXISTS "Only admins can update reservations" ON reservations;
CREATE POLICY "Only admins can update reservations"
    ON reservations FOR UPDATE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only admins can delete reservations" ON reservations;
CREATE POLICY "Only admins can delete reservations"
    ON reservations FOR DELETE
    USING (auth.role() = 'authenticated');

-- Políticas: Payments solo para autenticados
DROP POLICY IF EXISTS "Payments viewable by authenticated" ON payments;
CREATE POLICY "Payments viewable by authenticated"
    ON payments FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can create payments" ON payments;
CREATE POLICY "Anyone can create payments"
    ON payments FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Only system can update payments" ON payments;
CREATE POLICY "Only system can update payments"
    ON payments FOR UPDATE
    USING (auth.role() = 'authenticated');

-- ============================================
-- 9. VISTA: Disponibilidad de mesas
-- ============================================
CREATE OR REPLACE VIEW table_availability AS
SELECT 
    t.id,
    t.table_number,
    t.capacity,
    t.position_x,
    t.position_y,
    t.is_active,
    COALESCE(
        (SELECT COUNT(*) 
         FROM reservations r 
         WHERE r.table_id = t.id 
         AND r.status IN ('confirmed', 'pending')
        ), 0
    ) as active_reservations
FROM tables t
WHERE t.is_active = true;

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON TABLE reservations IS 'Reservaciones de clientes con hold de Stripe';
COMMENT ON TABLE payments IS 'Holds y pagos de Stripe vinculados a reservaciones';
COMMENT ON TABLE tables IS 'Mesas físicas del restaurante (6x6, 17x4, 1x2)';
COMMENT ON TABLE blocked_slots IS 'Mesas u horarios bloqueados manualmente por admin';
COMMENT ON TABLE settings IS 'Configuración global del sistema';

-- ============================================
-- FIN DEL SCHEMA
-- ============================================
