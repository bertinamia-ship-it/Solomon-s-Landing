-- Migration: Add database constraints to table_assignments for correctness under concurrency
-- Run this in Supabase SQL Editor
-- 
-- This migration adds:
-- 1. Unique constraint on (table_id, date, time) to prevent double-booking
-- 2. Foreign key from reservation_id -> reservations.id with ON DELETE CASCADE
-- 3. Check constraint to enforce status values and reservation_id NOT NULL when status='reserved'

-- ============================================
-- 1. UNIQUE CONSTRAINT: Prevent double-booking
-- ============================================
-- This ensures a table cannot be assigned twice for the same date+time slot
-- Even under concurrent requests, database will reject duplicate assignments

DO $$
BEGIN
    -- Drop existing unique constraint if it exists (in case of re-running migration)
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'table_assignments_table_date_time_unique'
    ) THEN
        ALTER TABLE table_assignments 
        DROP CONSTRAINT table_assignments_table_date_time_unique;
    END IF;
END $$;

ALTER TABLE table_assignments
ADD CONSTRAINT table_assignments_table_date_time_unique 
UNIQUE (table_id, date, time);

-- Add comment
COMMENT ON CONSTRAINT table_assignments_table_date_time_unique ON table_assignments 
IS 'Prevents double-booking: a table cannot be assigned twice for the same date+time slot';

-- ============================================
-- 2. FOREIGN KEY: reservation_id -> reservations.id
-- ============================================
-- First, check if foreign key already exists and drop it if needed
DO $$
BEGIN
    -- Drop existing foreign key if it exists (may have been created with different options)
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'table_assignments_reservation_id_fkey'
    ) THEN
        ALTER TABLE table_assignments 
        DROP CONSTRAINT table_assignments_reservation_id_fkey;
    END IF;
END $$;

-- Add foreign key with ON DELETE CASCADE
-- When a reservation is deleted, all its assignments are automatically deleted
ALTER TABLE table_assignments
ADD CONSTRAINT table_assignments_reservation_id_fkey 
FOREIGN KEY (reservation_id) 
REFERENCES reservations(id) 
ON DELETE CASCADE;

-- Add comment
COMMENT ON CONSTRAINT table_assignments_reservation_id_fkey ON table_assignments 
IS 'Foreign key to reservations. ON DELETE CASCADE ensures assignments are deleted when reservation is deleted. NULL allowed for blocked/unavailable status.';

-- ============================================
-- 3. CHECK CONSTRAINT: Status values + reservation_id validation
-- ============================================
-- Drop existing status check constraint if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'table_assignments_status_check'
    ) THEN
        ALTER TABLE table_assignments 
        DROP CONSTRAINT table_assignments_status_check;
    END IF;
END $$;

-- Add comprehensive check constraint
-- - Status must be one of: 'reserved', 'blocked', 'unavailable'
-- - If status is 'reserved', reservation_id must NOT be NULL
-- - If status is 'blocked' or 'unavailable', reservation_id can be NULL
ALTER TABLE table_assignments
ADD CONSTRAINT table_assignments_status_check 
CHECK (
    status IN ('reserved', 'blocked', 'unavailable') 
    AND (
        (status = 'reserved' AND reservation_id IS NOT NULL) 
        OR 
        (status IN ('blocked', 'unavailable'))
    )
);

-- Add comment
COMMENT ON CONSTRAINT table_assignments_status_check ON table_assignments 
IS 'Enforces: status must be reserved/blocked/unavailable. If reserved, reservation_id is required. If blocked/unavailable, reservation_id can be NULL.';

-- ============================================
-- 4. VERIFY CONSTRAINTS
-- ============================================
-- Check for any existing data that violates the new constraints
DO $$
DECLARE
    invalid_count INTEGER;
BEGIN
    -- Check for reserved assignments without reservation_id
    SELECT COUNT(*) INTO invalid_count
    FROM table_assignments
    WHERE status = 'reserved' AND reservation_id IS NULL;
    
    IF invalid_count > 0 THEN
        RAISE WARNING 'Found % reserved assignments without reservation_id. These will need to be fixed before the constraint can be applied.', invalid_count;
        RAISE EXCEPTION 'Cannot apply constraint: existing data violates rules. Please fix reserved assignments without reservation_id first.';
    END IF;
    
    -- Check for duplicate (table_id, date, time) combinations
    SELECT COUNT(*) INTO invalid_count
    FROM (
        SELECT table_id, date, time, COUNT(*) as cnt
        FROM table_assignments
        GROUP BY table_id, date, time
        HAVING COUNT(*) > 1
    ) duplicates;
    
    IF invalid_count > 0 THEN
        RAISE WARNING 'Found % duplicate (table_id, date, time) combinations. These will need to be cleaned up before the unique constraint can be applied.', invalid_count;
        RAISE EXCEPTION 'Cannot apply constraint: existing duplicate assignments found. Please clean up duplicates first.';
    END IF;
    
    RAISE NOTICE 'All constraints applied successfully. No data violations found.';
END $$;

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE (if not exists)
-- ============================================
-- These indexes support the new constraints and improve query performance

CREATE INDEX IF NOT EXISTS idx_table_assignments_table_date_time 
ON table_assignments(table_id, date, time);

CREATE INDEX IF NOT EXISTS idx_table_assignments_reservation_id 
ON table_assignments(reservation_id) 
WHERE reservation_id IS NOT NULL;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Summary:
-- ✅ Unique constraint on (table_id, date, time) prevents double-booking
-- ✅ Foreign key with ON DELETE CASCADE ensures orphaned assignments are cleaned up
-- ✅ Check constraint enforces status values and reservation_id requirement for 'reserved'
-- ✅ Indexes added for performance
--
-- These constraints ensure correctness even under concurrent requests:
-- - Database will reject duplicate assignments at the constraint level
-- - Deleting a reservation automatically deletes its assignments
-- - Invalid status/reservation_id combinations are prevented

