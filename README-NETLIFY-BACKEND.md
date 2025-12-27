# Netlify Backend - Quick Start

## Branch: `netlify-backend`

This branch implements Netlify Functions + Supabase + Resend for reservations, replacing EmailJS.

## Quick Setup

1. **Supabase**: Run `supabase-schema.sql` in SQL Editor
2. **Resend**: Get API key from dashboard
3. **Netlify**: Set environment variables (see NETLIFY-BACKEND-SETUP.md)
4. **Deploy**: Push branch and deploy to Netlify

## Environment Variables (Netlify)

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_xxxxx
EMAIL_RESTAURANT=contact@solomonslanding.com.mx
EMAIL_FROM="Solomon's Landing <reservations@yourdomain.com>"
```

## Testing

- **Netlify URL**: Uses Netlify Function → Database → Resend emails
- **GitHub Pages URL**: Falls back to EmailJS (automatic detection)

## Files Changed

- `netlify/functions/createReservation.js` - New function
- `website/app.js` - Updated `sendReservationToBackend()` with Netlify + fallback
- `package.json` - Added Supabase and Resend dependencies
- `supabase-schema.sql` - Database schema
- `NETLIFY-BACKEND-SETUP.md` - Full setup guide

## Status

✅ Function created
✅ Frontend updated with fallback
✅ Database schema ready
✅ Documentation complete

Ready for deployment and testing!

