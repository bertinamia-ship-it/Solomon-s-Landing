# Hostess Dashboard Documentation

## Access

- URL: `/hostess-dashboard.html`
- Password: `solomons2024` (change in production - edit `ADMIN_PASSWORD` constant in the HTML file)

## Features

### 1. Overview Tab
- View occupancy by date and time slot
- Color-coded status:
  - 🟢 Green: Available (30+ seats)
  - 🟡 Yellow: Full (10-29 seats)
  - 🔴 Red: Overbooked (<10 seats)
- Shows:
  - Booked seats
  - Blocked seats (OpenTable)
  - Available seats
  - Reservation count
  - Table assignments per reservation

### 2. Reservations Tab
- View all reservations for a selected date
- Shows:
  - Customer name, email, phone
  - Party size, time, source (website/chatbot/phone)
  - Reservation status
  - Notes

### 3. Block Tables Tab
- Add manual blocks for OpenTable reservations
- Fields:
  - Date
  - Time (5:30 PM - 9:30 PM)
  - Seats to block (1-106)
  - Reason (default: "OpenTable")
- Automatically applies block to all 3 slots in 90-min window

### 4. Manual Reservation Tab
- Add phone reservations directly
- Fields:
  - Full name
  - Email
  - Phone
  - Date
  - Time
  - Party size
  - Notes
- Automatically assigns tables and creates reservation

## How to Toggle HOLD_ENABLED

### In Netlify Dashboard:
1. Go to Site Settings → Environment Variables
2. Find or add: `HOLD_ENABLED`
3. Set value:
   - `"true"` or `"1"` → Stripe holds enabled
   - `"false"` or `"0"` or unset → Stripe holds disabled
4. Trigger a new deploy

### Behavior:
- **HOLD_ENABLED = false**: 
  - Reservation flow: Check availability → Create reservation
  - No payment step
  
- **HOLD_ENABLED = true**:
  - Reservation flow: Check availability → Create Stripe hold → Confirm payment → Create reservation
  - Payment hold amount: `party_size * 10 USD`
  - Test card: `4242 4242 4242 4242`

## Table Assignment System

### Tables Definition
- Stored in `tables` Supabase table
- Initial inventory:
  - 17 tables of 4 pax (tables 1-17)
  - 6 tables of 6 pax (tables 18-23)
  - 1 table of 2 pax (table 24)
  - Total: 106 seats

### Table Assignments
- Stored in `table_assignments` Supabase table
- Tracks which table(s) are assigned to each reservation
- Prevents double-booking
- Assignment logic:
  - Prefers exact fit (2, 4, 6 guests)
  - Can combine tables for larger parties
  - Checks 90-minute window overlap

## SQL Migrations Required

Run these in Supabase SQL Editor in order:

1. `supabase-migration-add-payment-datetime.sql` - Adds payment_intent_id and datetime_iso
2. `supabase-migration-availability.sql` - Updates blocked_slots with seats_blocked
3. `supabase-migration-tables-assignments.sql` - Creates tables and table_assignments tables

## Environment Variables

### Required:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESERVATIONS_TO_EMAIL`
- `CATERING_TO_EMAIL`

### Optional (for Stripe holds):
- `HOLD_ENABLED` (default: false)
- `STRIPE_SECRET_KEY` (if HOLD_ENABLED=true)
- `STRIPE_PUBLISHABLE_KEY` (if HOLD_ENABLED=true, for frontend)

## Reservation Flow

### With HOLD_ENABLED=false:
1. User submits form/chatbot
2. Check availability (table-based)
3. Create reservation + table assignments
4. Send emails

### With HOLD_ENABLED=true:
1. User submits form/chatbot
2. Check availability (table-based)
3. Create Stripe PaymentIntent (hold)
4. Confirm payment with Stripe.js
5. Create reservation + table assignments
6. Send emails

## OpenTable Integration

Currently manual:
1. Hostess receives OpenTable reservation
2. Go to Hostess Dashboard → Block Tables
3. Enter date, time, seats blocked
4. Reason: "OpenTable"
5. Block is applied to all 3 slots in 90-min window

Future: CSV import or API integration if available.

