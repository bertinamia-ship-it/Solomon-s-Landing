-- Migration: Add staying_place column to reservations table
-- Run this in Supabase SQL Editor

-- Add staying_place column (optional, can be null)
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS staying_place TEXT;

-- Add comment for documentation
COMMENT ON COLUMN reservations.staying_place IS 'Where the guest is staying (Hotel/Airbnb/Other + name)';

