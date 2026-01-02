-- Migration: Create tables definition and table_assignments
-- Run this in Supabase SQL Editor

-- Create tables definition table
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    table_number INTEGER NOT NULL UNIQUE,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    area TEXT, -- e.g., 'main', 'patio', 'window'
    is_active BOOLEAN DEFAULT true,
    notes TEXT
);

-- Insert initial table inventory
-- 17 tables of 4 pax
INSERT INTO tables (table_number, capacity, area, is_active) VALUES
(1, 4, 'main', true), (2, 4, 'main', true), (3, 4, 'main', true), (4, 4, 'main', true),
(5, 4, 'main', true), (6, 4, 'main', true), (7, 4, 'main', true), (8, 4, 'main', true),
(9, 4, 'main', true), (10, 4, 'main', true), (11, 4, 'main', true), (12, 4, 'main', true),
(13, 4, 'main', true), (14, 4, 'main', true), (15, 4, 'main', true), (16, 4, 'main', true),
(17, 4, 'main', true)
ON CONFLICT (table_number) DO NOTHING;

-- 6 tables of 6 pax
INSERT INTO tables (table_number, capacity, area, is_active) VALUES
(18, 6, 'main', true), (19, 6, 'main', true), (20, 6, 'main', true),
(21, 6, 'main', true), (22, 6, 'main', true), (23, 6, 'main', true)
ON CONFLICT (table_number) DO NOTHING;

-- 1 table of 2 pax
INSERT INTO tables (table_number, capacity, area, is_active) VALUES
(24, 2, 'main', true)
ON CONFLICT (table_number) DO NOTHING;

-- Create table_assignments table
CREATE TABLE IF NOT EXISTS table_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    table_id UUID REFERENCES tables(id) ON DELETE RESTRICT,
    datetime_iso TEXT NOT NULL, -- ISO 8601 datetime string
    duration_minutes INTEGER DEFAULT 90,
    source TEXT NOT NULL CHECK (source IN ('website', 'chatbot', 'phone', 'opentable', 'manual')),
    note TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_table_assignments_reservation ON table_assignments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_table_assignments_table ON table_assignments(table_id);
CREATE INDEX IF NOT EXISTS idx_table_assignments_datetime ON table_assignments(datetime_iso);
CREATE INDEX IF NOT EXISTS idx_table_assignments_status ON table_assignments(status);
CREATE INDEX IF NOT EXISTS idx_tables_capacity ON tables(capacity) WHERE is_active = true;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_table_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_table_assignments_updated_at 
    BEFORE UPDATE ON table_assignments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_table_assignments_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies: Service role full access
CREATE POLICY "Service role full access tables" ON tables
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access assignments" ON table_assignments
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE tables IS 'Restaurant table inventory definition';
COMMENT ON TABLE table_assignments IS 'Table assignments for reservations (tracks which table is assigned to which reservation)';
COMMENT ON COLUMN table_assignments.duration_minutes IS 'Reservation duration in minutes (default 90)';
COMMENT ON COLUMN table_assignments.source IS 'Source of reservation: website, chatbot, phone, opentable, manual';

