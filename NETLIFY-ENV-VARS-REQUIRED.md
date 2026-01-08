# Required Netlify Environment Variables

## Quick Reference

Set these in **Netlify Dashboard** → **Site Settings** → **Environment Variables** → **Add variable**

### Required for All Functions (Database Access)

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Mark as Secret:** ✅ `SUPABASE_SERVICE_ROLE_KEY`

### Required for Email Functions (Reservations & Catering)

```
RESEND_API_KEY=re_xxxxx...
RESEND_FROM_EMAIL=onboarding@resend.dev
RESERVATIONS_TO_EMAIL=contact@solomonslanding.com.mx
CATERING_TO_EMAIL=samantha@solomonslanding.com.mx
```

**Mark as Secret:** ✅ `RESEND_API_KEY`

### Optional Fallbacks (Not Required)

These are used as fallbacks if primary env vars are missing:
- `EMAIL_FROM` → fallback for `RESEND_FROM_EMAIL`
- `EMAIL_RESTAURANT` → fallback for `RESERVATIONS_TO_EMAIL`
- `CATERING_EMAIL` → fallback for `CATERING_TO_EMAIL`
- `SUPABASE_ANON_KEY` → fallback for `SUPABASE_SERVICE_ROLE_KEY` (not recommended)

## Error Messages

If you see these errors, the corresponding env var is missing:

| Error Message | Missing Variable |
|--------------|------------------|
| `{"ok":false,"error":"Missing SUPABASE_URL"}` | `SUPABASE_URL` |
| `{"ok":false,"error":"Missing SUPABASE_SERVICE_ROLE_KEY..."}` | `SUPABASE_SERVICE_ROLE_KEY` |
| `{"success":false,"error":"Server configuration error"}` | `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` |
| `{"success":false,"error":"Email service configuration error..."}` | `RESEND_API_KEY` or `RESEND_FROM_EMAIL` |

## After Setting Variables

1. **Redeploy**: Netlify Dashboard → Deploys → Trigger deploy → Clear cache and deploy site
2. **Verify**: Test a function endpoint (e.g., `/hostess-dashboard.html` should load tables)
3. **Check Logs**: Netlify Dashboard → Functions → View logs for any errors

## Functions That Use Each Variable

### `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
Used by ALL functions that access the database:
- `get-tables.js`
- `get-layout.js`
- `get-reservations.js`
- `get-table-assignments.js`
- `send-reservation.js`
- `update-reservation.js`
- `cancel-reservation.js`
- `set-assignment.js`
- `block-table.js`
- `find-available-tables.js`
- `check-availability.js`
- `upsert-table.js`
- `delete-table.js`
- `save-layout.js`
- `get-blocks.js`
- `add-block.js`
- `release-assignment.js`
- `add-opentable-reservation.js`
- `create-hold.js`
- `createReservation.js`

### `RESEND_API_KEY` + `RESEND_FROM_EMAIL`
Used by email functions:
- `send-reservation.js`
- `createReservation.js`
- `send-catering.js`

### `RESERVATIONS_TO_EMAIL`
Used by:
- `send-reservation.js`
- `createReservation.js`

### `CATERING_TO_EMAIL`
Used by:
- `send-catering.js`

