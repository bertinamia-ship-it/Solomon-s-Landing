-- Migration: Update blocked_slots table and add availability tracking
-- Run this in Supabase SQL Editor

-- Update blocked_slots table to include seats_blocked
ALTER TABLE blocked_slots 
ADD COLUMN IF NOT EXISTS seats_blocked INTEGER NOT NULL DEFAULT 0;

-- Add reason column if it doesn't exist (should already exist from schema)
-- ALTER TABLE blocked_slots ADD COLUMN IF NOT EXISTS reason TEXT;

-- Create index on date and time for faster availability queries
CREATE INDEX IF NOT EXISTS idx_blocked_slots_datetime ON blocked_slots(date, time);

-- Add comment for documentation
COMMENT ON COLUMN blocked_slots.seats_blocked IS 'Number of seats blocked for this slot (e.g., from OpenTable)';

-- Table inventory constants (stored as comments, actual logic in application)
-- 17 tables of 4 = 68 seats
-- 6 tables of 6 = 36 seats  
-- 1 table of 2 = 2 seats
-- Total: 106 seats
-- Reservation window: 90 minutes (3 slots of 30 min)

