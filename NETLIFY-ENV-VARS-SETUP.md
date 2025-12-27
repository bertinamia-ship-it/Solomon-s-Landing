# Netlify Environment Variables Setup

## Required Environment Variables

Set these in **Netlify Dashboard** → **Site Settings** → **Environment Variables**:

### 1. Resend Configuration
```
RESEND_API_KEY=re_xxxxx...
```
- Get from: https://resend.com → API Keys
- **Mark as Secret**: ✅ Yes

### 2. Supabase Configuration
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```
- Get from: Supabase Dashboard → Settings → API
- **SUPABASE_SERVICE_ROLE_KEY**: Mark as Secret ✅ Yes
- **SUPABASE_URL**: Can be public

### 3. Email Recipients (Testing)
```
RESERVATIONS_TO_EMAIL=bertinamia@gmail.com
CATERING_TO_EMAIL=bertinamia@gmail.com
```
- For testing: Use `bertinamia@gmail.com`
- For production: Change to actual emails
- **Mark as Secret**: Optional (not sensitive)

### 4. Email From Address (Resend)
```
EMAIL_FROM="Solomon's Landing <onboarding@resend.dev>"
```
- For testing: Use `"Solomon's Landing <onboarding@resend.dev>"`
- For production: Use your verified domain
- Format: `"Name <email@domain.com>"` (with quotes)

---

## Step-by-Step Setup

### Step 1: Get Resend API Key
1. Go to: https://resend.com
2. Sign up/Login
3. Go to: **API Keys** → **Create API Key**
4. Name: `Solomon's Landing Netlify`
5. Copy the key: `re_xxxxx...`

### Step 2: Get Supabase Credentials
1. Go to: https://supabase.com
2. Open your project
3. Go to: **Settings** → **API**
4. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **service_role key**: `eyJhbGc...` (under "Project API keys")

### Step 3: Set Environment Variables in Netlify
1. Go to: Netlify Dashboard → Your Site
2. **Site Settings** → **Environment Variables**
3. Click **"Add variable"** for each:

| Variable | Value | Secret? |
|----------|-------|---------|
| `RESEND_API_KEY` | `re_xxxxx...` | ✅ Yes |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | No |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | ✅ Yes |
| `RESERVATIONS_TO_EMAIL` | `bertinamia@gmail.com` | No |
| `CATERING_TO_EMAIL` | `bertinamia@gmail.com` | No |
| `EMAIL_FROM` | `"Solomon's Landing <onboarding@resend.dev>"` | No |

4. Click **"Save"** after each variable

### Step 4: Redeploy Site
1. After setting all variables, go to: **Site overview**
2. Click: **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait for deployment to complete (~2-3 minutes)

---

## Verification

### Test Reservation Function
1. Go to your Netlify URL
2. Navigate to reservations page
3. Submit a test reservation
4. Check:
   - ✅ Browser console: `Reservation created via Netlify Function: [uuid]`
   - ✅ Netlify Function logs: `Reservation saved to database: [uuid]`
   - ✅ Supabase: New row in `reservations` table
   - ✅ Email received at `bertinamia@gmail.com`

### Test Catering Function
1. Go to your Netlify URL
2. Navigate to catering page
3. Submit a test catering request
4. Check:
   - ✅ Browser console: Success message
   - ✅ Netlify Function logs: `Catering email sent: [email-id]`
   - ✅ Email received at `bertinamia@gmail.com`

---

## Troubleshooting

### Function Returns 500 Error
- Check all environment variables are set
- Verify RESEND_API_KEY is correct
- Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correct
- Check function logs for specific error message

### Emails Not Received
- Check RESEND_API_KEY is correct
- Verify EMAIL_FROM format: `"Name <email@domain.com>"` (with quotes)
- Check spam/junk folder
- Verify sender domain is verified in Resend (or using test domain)
- Check Resend dashboard → Emails for delivery status

### Database Errors
- Verify SUPABASE_URL is correct
- Verify SUPABASE_SERVICE_ROLE_KEY is correct (service_role, not anon key)
- Check Supabase table exists: `reservations`
- Verify RLS policy allows service role access

### Function Not Found (404)
- Verify functions directory is set: `netlify/functions`
- Check function file exists: `netlify/functions/createReservation.js`
- Redeploy site after adding functions

---

## Security Notes

- ✅ **SUPABASE_SERVICE_ROLE_KEY**: Never expose to frontend (server-only)
- ✅ **RESEND_API_KEY**: Never expose to frontend (server-only)
- ✅ Both keys are marked as "Secret" in Netlify (encrypted)
- ✅ Service role key has full database access - keep it secure!

---

## Production Checklist

Before going live:
- [ ] Change `RESERVATIONS_TO_EMAIL` to `contact@solomonslanding.com.mx`
- [ ] Change `CATERING_TO_EMAIL` to `samantha@solomonslanding.com.mx`
- [ ] Verify your domain in Resend
- [ ] Update `EMAIL_FROM` to use your verified domain
- [ ] Test both functions on production URL
- [ ] Verify emails are received correctly

