-- Migration: Create tables, table_layout, and table_assignments for floor plan system
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. TABLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    table_number INTEGER NOT NULL UNIQUE,
    name TEXT, -- e.g., "Main 1", "Sushi Bar 30"
    area TEXT NOT NULL, -- 'Main Floor', 'Sushi Bar', etc.
    seats INTEGER NOT NULL CHECK (seats > 0), -- 2, 4, or 6
    is_active BOOLEAN DEFAULT true,
    notes TEXT
);

-- Indexes for tables
CREATE INDEX IF NOT EXISTS idx_tables_area ON tables(area);
CREATE INDEX IF NOT EXISTS idx_tables_table_number ON tables(table_number);
CREATE INDEX IF NOT EXISTS idx_tables_capacity ON tables(seats) WHERE is_active = true;

-- ============================================
-- 2. TABLE_LAYOUT TABLE (for floor plan positions)
-- ============================================
CREATE TABLE IF NOT EXISTS table_layout (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    area TEXT NOT NULL UNIQUE, -- 'Main Floor', 'Sushi Bar', etc.
    layout_json JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {table_id, x, y, w, h, rotation}
    notes TEXT
);

-- Index for table_layout
CREATE INDEX IF NOT EXISTS idx_table_layout_area ON table_layout(area);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_table_layout_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_table_layout_updated_at ON table_layout;
CREATE TRIGGER update_table_layout_updated_at
    BEFORE UPDATE ON table_layout
    FOR EACH ROW
    EXECUTE FUNCTION update_table_layout_updated_at();

-- ============================================
-- 3. TABLE_ASSIGNMENTS TABLE (updated)
-- ============================================
CREATE TABLE IF NOT EXISTS table_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date DATE NOT NULL,
    time TEXT NOT NULL, -- HH:MM format
    datetime_iso TEXT NOT NULL, -- ISO 8601 datetime string for overlap checking
    duration_minutes INTEGER DEFAULT 90,
    table_id UUID REFERENCES tables(id) ON DELETE RESTRICT,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL, -- Nullable for blocks
    status TEXT NOT NULL CHECK (status IN ('reserved', 'blocked', 'unavailable')) DEFAULT 'reserved',
    source TEXT NOT NULL CHECK (source IN ('website', 'chatbot', 'phone', 'opentable', 'manual')) DEFAULT 'manual',
    notes TEXT
);

-- Indexes for table_assignments
CREATE INDEX IF NOT EXISTS idx_table_assignments_date_time ON table_assignments(date, time);
CREATE INDEX IF NOT EXISTS idx_table_assignments_table_id ON table_assignments(table_id);
CREATE INDEX IF NOT EXISTS idx_table_assignments_reservation_id ON table_assignments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_table_assignments_datetime ON table_assignments(datetime_iso);
CREATE INDEX IF NOT EXISTS idx_table_assignments_status ON table_assignments(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_table_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_table_assignments_updated_at ON table_assignments;
CREATE TRIGGER update_table_assignments_updated_at
    BEFORE UPDATE ON table_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_table_assignments_updated_at();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_layout ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_assignments ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for Netlify Functions)
CREATE POLICY IF NOT EXISTS "Service role full access tables" ON tables
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access table_layout" ON table_layout
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access assignments" ON table_assignments
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 5. SEED INITIAL TABLES (if not exists)
-- ============================================
-- Main Floor: 17 tables of 4 seats, 6 tables of 6 seats, 1 table of 2 seats
INSERT INTO tables (table_number, name, area, seats, is_active) VALUES
-- Tables 1-15: 4 seats each
(1, 'Main 1', 'Main Floor', 4, true),
(2, 'Main 2', 'Main Floor', 4, true),
(3, 'Main 3', 'Main Floor', 4, true),
(4, 'Main 4', 'Main Floor', 4, true),
(5, 'Main 5', 'Main Floor', 4, true),
(6, 'Main 6', 'Main Floor', 4, true),
(7, 'Main 7', 'Main Floor', 4, true),
(8, 'Main 8', 'Main Floor', 4, true),
(9, 'Main 9', 'Main Floor', 4, true),
(10, 'Main 10', 'Main Floor', 4, true),
(11, 'Main 11', 'Main Floor', 4, true),
(12, 'Main 12', 'Main Floor', 4, true),
(13, 'Main 13', 'Main Floor', 4, true),
(14, 'Main 14', 'Main Floor', 6, true),
(15, 'Main 15', 'Main Floor', 6, true),
-- Tables 16-17: 4 seats each (to make 17 total of 4)
(16, 'Main 16', 'Main Floor', 4, true),
(17, 'Main 17', 'Main Floor', 4, true),
-- Tables 18-23: 6 seats each (6 tables of 6)
(18, 'Main 18', 'Main Floor', 6, true),
(19, 'Main 19', 'Main Floor', 6, true),
(20, 'Main 20', 'Main Floor', 6, true),
(21, 'Main 21', 'Main Floor', 6, true),
(22, 'Main 22', 'Main Floor', 6, true),
(23, 'Main 23', 'Main Floor', 6, true),
-- Table 24: 2 seats
(24, 'Main 24', 'Main Floor', 2, true),
-- Sushi Bar: Tables 30-32 (4 seats), 40-42 (2 seats)
(30, 'Sushi Bar 30', 'Sushi Bar', 4, true),
(31, 'Sushi Bar 31', 'Sushi Bar', 4, true),
(32, 'Sushi Bar 32', 'Sushi Bar', 4, true),
(40, 'Sushi Bar 40', 'Sushi Bar', 2, true),
(41, 'Sushi Bar 41', 'Sushi Bar', 2, true),
(42, 'Sushi Bar 42', 'Sushi Bar', 2, true)
ON CONFLICT (table_number) DO NOTHING;

-- ============================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE tables IS 'Restaurant table inventory definition';
COMMENT ON COLUMN tables.seats IS 'Number of seats at this table (2, 4, or 6)';
COMMENT ON COLUMN tables.area IS 'Area of the restaurant where the table is located';
COMMENT ON TABLE table_layout IS 'Floor plan layout positions for tables (drag/drop positions)';
COMMENT ON COLUMN table_layout.layout_json IS 'JSON array of {table_id, x, y, w, h, rotation} for each table';
COMMENT ON TABLE table_assignments IS 'Table assignments for reservations and blocks';
COMMENT ON COLUMN table_assignments.status IS 'reserved: assigned to a reservation, blocked: manually blocked, unavailable: table out of service';
COMMENT ON COLUMN table_assignments.duration_minutes IS 'Reservation duration in minutes (default 90)';

