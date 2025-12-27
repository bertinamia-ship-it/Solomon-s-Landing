# 🚀 Complete Deployment Guide - Netlify Backend

## ⚠️ IMPORTANT: Manual Steps Required

I cannot automate browser-based authentication and dashboard access. You'll need to complete steps 1-4 manually, then I can help verify.

---

## Step 1: Netlify Site Creation (MANUAL - Browser Required)

### Option A: Via Netlify Dashboard (Recommended)

1. **Go to**: https://app.netlify.com
2. **Click**: "Add new site" → "Import an existing project"
3. **Connect GitHub** (if not already connected)
4. **Select repository**: `bertinamia-ship-it/Solomon-s-Landing`
5. **Configure**:
   - **Branch to deploy**: `netlify-backend`
   - **Build command**: (leave empty)
   - **Publish directory**: `website`
   - **Functions directory**: `netlify/functions`
6. **Click**: "Deploy site"
7. **Wait**: ~2-3 minutes for deployment
8. **Copy your Netlify URL**: `https://xxxxx.netlify.app`

### Option B: Via Netlify CLI (If you prefer terminal)

```bash
# Login to Netlify (opens browser)
npx netlify login

# Initialize new site
npx netlify init

# Follow prompts:
# - Create & configure a new site
# - Team: (select your team)
# - Site name: (or leave blank for auto-generated)
# - Build command: (press Enter - leave empty)
# - Directory to deploy: website
# - Netlify functions folder: netlify/functions

# Deploy
npx netlify deploy --prod
```

**After deployment, you'll get a URL like**: `https://xxxxx.netlify.app`

---

## Step 2: Environment Variables (MANUAL - Netlify Dashboard)

1. **Go to**: Netlify Dashboard → Your Site → **Site Settings** → **Environment Variables**
2. **Click**: "Add variable" for each:

| Variable | Value | Notes |
|----------|-------|-------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | From Supabase Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | From Supabase Settings → API (service_role key) |
| `RESEND_API_KEY` | `re_xxxxx` | From Resend Dashboard → API Keys |
| `EMAIL_RESTAURANT` | `contact@solomonslanding.com.mx` | Restaurant email |
| `EMAIL_FROM` | `"Solomon's Landing <onboarding@resend.dev>"` | For testing, or your verified domain |

3. **Click**: "Save" after each variable
4. **Redeploy**: Site overview → "Trigger deploy" → "Clear cache and deploy site"

---

## Step 3: Supabase Setup (MANUAL - Browser Required)

### A. Create Project

1. **Go to**: https://supabase.com
2. **Sign up/Login**
3. **Click**: "New Project"
4. **Fill in**:
   - Name: `solomons-landing`
   - Database Password: (save this!)
   - Region: Choose closest to Mexico
5. **Click**: "Create new project" (takes ~2 minutes)

### B. Run SQL Schema

1. **Go to**: SQL Editor (left sidebar)
2. **Click**: "New query"
3. **Copy** the ENTIRE contents of `supabase-schema.sql`
4. **Paste** into SQL Editor
5. **Click**: "Run" (or Cmd/Ctrl + Enter)
6. **Verify**: Should see "Success. No rows returned"

### C. Verify Table

1. **Go to**: Table Editor → **reservations**
2. **Verify** columns exist:
   - id (uuid)
   - created_at (timestamp)
   - status (text)
   - name, email, phone, date, time, party_size, notes, language, source

### D. Get Credentials

1. **Go to**: Settings → **API**
2. **Copy**:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 4: Resend Setup (MANUAL - Browser Required)

### A. Create Account

1. **Go to**: https://resend.com
2. **Sign up** (free tier: 3,000 emails/month)
3. **Verify** your email

### B. Get API Key

1. **Go to**: API Keys (left sidebar)
2. **Click**: "Create API Key"
3. **Name**: `Solomon's Landing Netlify`
4. **Click**: "Add"
5. **Copy** the API key immediately → `RESEND_API_KEY`

### C. Verify Sender (Choose ONE)

**Option 1: Use Test Domain** (For immediate testing)
- Use: `"Solomon's Landing <onboarding@resend.dev>"`
- No verification needed
- Works immediately

**Option 2: Verify Your Domain** (For production)
1. **Go to**: Domains → Add Domain
2. **Enter**: Your domain (e.g., `solomonslanding.com.mx`)
3. **Follow**: DNS verification steps
4. **Once verified**: Use `"Solomon's Landing <reservations@yourdomain.com>"`

---

## Step 5: Test Deployment (YOU DO THIS)

### A. Submit Test Reservation

1. **Go to**: Your Netlify URL (e.g., `https://xxxxx.netlify.app`)
2. **Navigate**: To reservations page
3. **Fill form**:
   - Name: Test User
   - Email: your-email@example.com
   - Phone: +526241234567
   - Date: (future date)
   - Time: 19:00
   - Guests: 4
   - Notes: Test reservation
4. **Submit**

### B. Check Function Logs

1. **Netlify Dashboard** → Functions → View logs
2. **Look for**:
   - ✅ `Reservation saved to database: [uuid]`
   - ✅ `Restaurant email sent: [email-id]`
   - ✅ `Customer confirmation email sent: [email-id]`

### C. Verify Database

1. **Supabase Dashboard** → Table Editor → reservations
2. **Should see**: New row with your test data
3. **Take screenshot**: Show the row with all columns

### D. Verify Emails

1. **Restaurant Email** (contact@solomonslanding.com.mx):
   - Subject: "New Reservation - Test User - [date] at [time]"
   - Contains: All reservation details + reservation ID
   - **Take screenshot**: Full email

2. **Customer Email** (your test email):
   - Subject: "Reservation Request Received - [date] at [time]"
   - Contains: Reservation ID + confirmation message
   - **Take screenshot**: Full email

### E. Check Console

1. **Browser DevTools** (F12) → Console
2. **Look for**: `✅ Reservation created via Netlify Function: [uuid]`
3. **No errors**: Should be clean
4. **Take screenshot**: If there are any errors

### F. Verify No 404 Links

1. **Open both emails**
2. **Check all links**
3. **Verify**: No confirmation links exist yet (Phase 2 feature)
4. **Verify**: All links are valid (no 404s)

---

## Step 6: Deliverables (SEND TO ME)

After completing all steps, provide:

1. **Netlify Deploy URL**: `https://xxxxx.netlify.app`
2. **Supabase Row Screenshot**: 
   - Table Editor → reservations → Show the test row
3. **Restaurant Email Screenshot**: 
   - Full email with all details visible
4. **Customer Email Screenshot**: 
   - Full confirmation email
5. **Console Output** (if any errors):
   - Browser console showing success/errors

---

## 🎯 Quick Checklist

- [ ] Netlify site created and deployed
- [ ] Environment variables set in Netlify
- [ ] Supabase project created
- [ ] SQL schema run successfully
- [ ] Resend account created and API key obtained
- [ ] Sender domain verified (or using test domain)
- [ ] Test reservation submitted on Netlify URL
- [ ] Database row created in Supabase
- [ ] Restaurant email received
- [ ] Customer email received
- [ ] No console errors
- [ ] No 404 links in emails
- [ ] Screenshots taken and ready to share

---

## 🐛 Troubleshooting

### Function Returns 500
- Check all env vars are set correctly
- Verify Supabase credentials
- Check function logs for specific error

### Emails Not Received
- Check Resend API key is correct
- Verify EMAIL_FROM format: `"Name <email@domain.com>"`
- Check spam folder
- Verify sender domain is verified

### Database Errors
- Verify Supabase URL and service_role key
- Check table exists (Table Editor)
- Verify RLS policy allows service role access

---

## ✅ Once Complete

Send me:
1. Netlify URL
2. Screenshots (Supabase row, both emails)
3. Console output (if any errors)

Then we can mark this as **COMPLETE**! 🎉

