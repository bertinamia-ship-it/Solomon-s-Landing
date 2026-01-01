-- Migration: Add payment_intent_id and datetime_iso columns to reservations table
-- Run this in Supabase SQL Editor

-- Add payment_intent_id column (for Stripe holds)
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Add datetime_iso column (ISO 8601 datetime string)
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS datetime_iso TEXT;

-- Add index on payment_intent_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_reservations_payment_intent ON reservations(payment_intent_id) 
WHERE payment_intent_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN reservations.payment_intent_id IS 'Stripe PaymentIntent ID for reservation holds';
COMMENT ON COLUMN reservations.datetime_iso IS 'ISO 8601 datetime string (YYYY-MM-DDTHH:MM:SS)';

