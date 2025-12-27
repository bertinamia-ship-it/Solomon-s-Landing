# 🚀 DEPLOY NOW - Step-by-Step Guide

## ✅ Step 1: Branch Pushed (COMPLETE)

- **Branch**: `netlify-backend`
- **Commit**: `09b3d4f` - "Netlify backend: Supabase + Resend reservations"
- **Status**: ✅ Pushed to GitHub

---

## 📋 Step 2: Create Netlify Site

### A. Go to Netlify Dashboard
1. Visit: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to **GitHub** (if not already connected)
4. Select repository: `bertinamia-ship-it/Solomon-s-Landing`

### B. Configure Build Settings
- **Branch to deploy**: `netlify-backend`
- **Build command**: (leave empty)
- **Publish directory**: `website`
- **Functions directory**: `netlify/functions`

### C. Deploy
- Click **"Deploy site"**
- Wait for deployment to complete (~2-3 minutes)

### D. Get Your Netlify URL
- After deployment, you'll get a URL like: `https://random-name-12345.netlify.app`
- **Save this URL** - you'll need it for testing

---

## 🗄️ Step 3: Set Up Supabase Database

### A. Create Supabase Project
1. Go to: https://supabase.com
2. Sign up/login
3. Click **"New Project"**
4. Fill in:
   - **Name**: `solomons-landing`
   - **Database Password**: (save this!)
   - **Region**: Choose closest to Mexico
5. Click **"Create new project"** (takes ~2 minutes)

### B. Run SQL Schema
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the ENTIRE contents of `supabase-schema.sql`
4. Paste into SQL Editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see: "Success. No rows returned"

### C. Verify Table Created
1. Go to **Table Editor** (left sidebar)
2. Click **"reservations"** table
3. You should see all columns:
   - id (uuid)
   - created_at (timestamp)
   - status (text)
   - name, email, phone, date, time, party_size, notes, language, source

### D. Get Supabase Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co` → This is `SUPABASE_URL`
   - **service_role key** (under "Project API keys"): `eyJhbGc...` → This is `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **Keep service_role key SECRET!** Never expose it to frontend.

---

## 📧 Step 4: Set Up Resend

### A. Create Resend Account
1. Go to: https://resend.com
2. Sign up (free tier: 3,000 emails/month)
3. Verify your email

### B. Get API Key
1. Go to **API Keys** (left sidebar)
2. Click **"Create API Key"**
3. Name: `Solomon's Landing Netlify`
4. Click **"Add"**
5. **Copy the API key** immediately (you won't see it again!)
   - Format: `re_xxxxx...` → This is `RESEND_API_KEY`

### C. Verify Sender Domain (Choose ONE)

**Option 1: Use Your Domain** (Recommended for production)
1. Go to **Domains** → **Add Domain**
2. Enter: `solomonslanding.com.mx` (or your domain)
3. Follow DNS verification steps
4. Once verified, use: `"Solomon's Landing <reservations@solomonslanding.com.mx>"`

**Option 2: Use Resend Test Domain** (For testing/development)
- Use: `"Solomon's Landing <onboarding@resend.dev>"`
- No verification needed
- Works immediately for testing

### D. Set EMAIL_FROM
- Format: `"Solomon's Landing <email@domain.com>"`
- For testing: `"Solomon's Landing <onboarding@resend.dev>"`
- For production: `"Solomon's Landing <reservations@yourdomain.com>"`

---

## ⚙️ Step 5: Configure Netlify Environment Variables

1. In Netlify Dashboard → Your Site → **Site Settings** → **Environment Variables**
2. Click **"Add variable"** for each:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `SUPABASE_URL` | Your Supabase Project URL | `https://abcdefgh.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `RESEND_API_KEY` | Resend API key | `re_1234567890abcdef...` |
| `EMAIL_RESTAURANT` | Restaurant email | `contact@solomonslanding.com.mx` |
| `EMAIL_FROM` | Verified sender | `"Solomon's Landing <onboarding@resend.dev>"` |

3. Click **"Save"** after adding each variable
4. **Redeploy** the site (Site overview → **"Trigger deploy"** → **"Clear cache and deploy site"**)

---

## ✅ Step 6: Verify Deployment

### A. Test Reservation Submission

1. Go to your Netlify URL: `https://your-site.netlify.app`
2. Navigate to reservations page
3. Fill out the form:
   - Name: Test User
   - Email: your-email@example.com
   - Phone: +526241234567
   - Date: (future date)
   - Time: 19:00
   - Guests: 4
   - Notes: Test reservation
4. Click **"Submit"**

### B. Check Function Logs

1. Netlify Dashboard → **Functions** → **View logs**
2. Look for:
   - ✅ `Reservation saved to database: [uuid]`
   - ✅ `Restaurant email sent: [email-id]`
   - ✅ `Customer confirmation email sent: [email-id]`
3. If errors, check the error message

### C. Verify Database

1. Supabase Dashboard → **Table Editor** → **reservations**
2. You should see a new row with:
   - Your test reservation data
   - Status: `pending`
   - Created_at: current timestamp

### D. Verify Emails

1. **Restaurant Email** (contact@solomonslanding.com.mx):
   - Subject: "New Reservation - Test User - [date] at [time]"
   - Contains all reservation details
   - Contains reservation ID (UUID)

2. **Customer Email** (your test email):
   - Subject: "Reservation Request Received - [date] at [time]"
   - Contains reservation ID
   - Contains confirmation message

3. **Check Resend Dashboard**:
   - Go to Resend → **Emails**
   - See both emails with delivery status

### E. Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Submit reservation
4. Look for:
   - ✅ `Reservation created via Netlify Function: [uuid]`
   - ❌ No errors

### F. Verify No 404 Links

1. Open both emails
2. Check all links
3. ✅ **No confirmation links should exist yet** (Phase 2 feature)
4. ✅ All links should be valid (no 404s)

---

## 🔒 Step 7: Keep GitHub Pages Safe

### Current Status
- ✅ GitHub Pages branch/config: **UNCHANGED**
- ✅ Smart fallback code: **ACTIVE**
  - Netlify URL → Uses Netlify Function
  - github.io URL → Uses EmailJS fallback

### Verify GitHub Pages Still Works

1. Go to: `https://bertinamia-ship-it.github.io/Solomon-s-Landing/`
2. Navigate to reservations page
3. Submit a test reservation
4. Check console: Should show `"EmailJS fallback"`
5. ✅ Reservation should still work via EmailJS

---

## 📸 Screenshots Needed

After testing, provide:

1. **Netlify Deploy URL**: `https://your-site.netlify.app`
2. **Supabase Row Screenshot**: 
   - Table Editor → reservations → Show the test row
3. **Restaurant Email Screenshot**:
   - Full email with all details visible
4. **Customer Email Screenshot**:
   - Full confirmation email
5. **Console Output** (if any errors):
   - Browser console showing success/errors

---

## 🐛 Troubleshooting

### Function Returns 500 Error
- Check all environment variables are set
- Verify Supabase credentials are correct
- Check function logs for specific error

### Emails Not Received
- Check Resend API key is correct
- Verify EMAIL_FROM format: `"Name <email@domain.com>"`
- Check spam/junk folder
- Verify sender domain is verified (or using test domain)

### Database Errors
- Verify Supabase URL and service_role key
- Check table exists (Table Editor)
- Verify RLS policy allows service role access

### GitHub Pages Not Working
- Check EmailJS is still loaded in HTML
- Verify fallback code in app.js is correct
- Check browser console for errors

---

## ✅ Final Checklist

- [ ] Branch pushed to GitHub
- [ ] Netlify site created and deployed
- [ ] Supabase database created and schema run
- [ ] Resend account created and API key obtained
- [ ] All environment variables set in Netlify
- [ ] Site redeployed after env vars added
- [ ] Test reservation submitted on Netlify URL
- [ ] Database row created in Supabase
- [ ] Restaurant email received
- [ ] Customer email received
- [ ] No console errors
- [ ] No 404 links in emails
- [ ] GitHub Pages still works (EmailJS fallback)

---

## 🎉 Success!

Once all checkboxes are complete, the system is fully operational:
- ✅ Scalable (no 200/month limit)
- ✅ Database-backed (all reservations stored)
- ✅ Professional emails (Resend)
- ✅ GitHub Pages protected (fallback intact)

Ready for production! 🚀

