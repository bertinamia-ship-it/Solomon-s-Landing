-- Migration: Create tables definition and table_assignments
-- Run this in Supabase SQL Editor

-- Create tables definition table
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL, -- e.g., 'Table 1', 'Sushi Bar 30'
    table_number INTEGER NOT NULL UNIQUE,
    area TEXT NOT NULL, -- 'Main Floor' or 'Sushi Bar'
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    is_active BOOLEAN DEFAULT true,
    notes TEXT
);

-- Insert initial table inventory
-- Main Floor: Tables 1-15 (mix of 2, 4, 6 capacity)
INSERT INTO tables (name, table_number, area, capacity, is_active) VALUES
('Table 1', 1, 'Main Floor', 4, true),
('Table 2', 2, 'Main Floor', 4, true),
('Table 3', 3, 'Main Floor', 4, true),
('Table 4', 4, 'Main Floor', 4, true),
('Table 5', 5, 'Main Floor', 4, true),
('Table 6', 6, 'Main Floor', 4, true),
('Table 7', 7, 'Main Floor', 4, true),
('Table 8', 8, 'Main Floor', 4, true),
('Table 9', 9, 'Main Floor', 4, true),
('Table 10', 10, 'Main Floor', 4, true),
('Table 11', 11, 'Main Floor', 4, true),
('Table 12', 12, 'Main Floor', 4, true),
('Table 13', 13, 'Main Floor', 4, true),
('Table 14', 14, 'Main Floor', 6, true),
('Table 15', 15, 'Main Floor', 6, true)
ON CONFLICT (table_number) DO NOTHING;

-- Sushi Bar: Tables 30-32, 40-42
INSERT INTO tables (name, table_number, area, capacity, is_active) VALUES
('Sushi Bar 30', 30, 'Sushi Bar', 2, true),
('Sushi Bar 31', 31, 'Sushi Bar', 2, true),
('Sushi Bar 32', 32, 'Sushi Bar', 2, true),
('Sushi Bar 40', 40, 'Sushi Bar', 4, true),
('Sushi Bar 41', 41, 'Sushi Bar', 4, true),
('Sushi Bar 42', 42, 'Sushi Bar', 4, true)
ON CONFLICT (table_number) DO NOTHING;

-- Create table_assignments table
CREATE TABLE IF NOT EXISTS table_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date DATE NOT NULL,
    time TEXT NOT NULL, -- HH:MM format
    datetime_iso TEXT NOT NULL, -- ISO 8601 datetime string
    duration_minutes INTEGER DEFAULT 90,
    table_id UUID REFERENCES tables(id) ON DELETE RESTRICT,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL, -- Nullable for OpenTable blocks
    source TEXT NOT NULL CHECK (source IN ('website', 'chatbot', 'phone', 'opentable', 'manual')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    notes TEXT
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

