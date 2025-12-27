# Quick Reference: Netlify Environment Variables

## Copy-Paste Ready List

Set these in **Netlify Dashboard** → **Site Settings** → **Environment Variables**:

```
RESEND_API_KEY=re_xxxxx...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESERVATIONS_TO_EMAIL=bertinamia@gmail.com
CATERING_TO_EMAIL=bertinamia@gmail.com
EMAIL_FROM="Solomon's Landing <onboarding@resend.dev>"
```

## Mark as Secret (✅)

- `RESEND_API_KEY` → ✅ Secret
- `SUPABASE_SERVICE_ROLE_KEY` → ✅ Secret
- Others can be public

## After Setting Variables

1. **Redeploy**: Site overview → Trigger deploy → Clear cache and deploy
2. **Test**: Submit reservation on Netlify URL
3. **Verify**: Check function logs, database, emails

## Function Endpoints

- Reservations: `/.netlify/functions/createReservation`
- Catering: `/.netlify/functions/send-catering`

Both use Resend for emails.

