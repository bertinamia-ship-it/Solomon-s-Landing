-- Migration: Add seated and no_show statuses to reservations
-- Run this in Supabase SQL Editor

-- Update status constraint to include new lifecycle states
ALTER TABLE reservations 
DROP CONSTRAINT IF EXISTS reservations_status_check;

ALTER TABLE reservations 
ADD CONSTRAINT reservations_status_check 
CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'no_show', 'cancelled'));

-- Add comment for documentation
COMMENT ON COLUMN reservations.status IS 'Reservation lifecycle: pending (new), confirmed (accepted), seated (guests arrived), completed (finished dining), no_show (did not arrive), cancelled (cancelled)';

