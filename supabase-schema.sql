-- Supabase Schema for Solomon's Landing Reservations
-- Run this in your Supabase SQL Editor

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size > 0),
    notes TEXT,
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es')),
    source TEXT DEFAULT 'web',
    confirmation_code TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON reservations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policy: Service role can do everything (for Netlify Functions)
CREATE POLICY "Service role full access" ON reservations
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Optional: Create blocked_slots table for future use (Phase 2)
CREATE TABLE IF NOT EXISTS blocked_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date DATE NOT NULL,
    time TEXT NOT NULL,
    reason TEXT,
    is_permanent BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots(date);

-- Grant permissions (adjust as needed for your setup)
-- Service role key already has full access via RLS policy above

