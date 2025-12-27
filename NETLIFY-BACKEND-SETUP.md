# Netlify Backend Setup Guide - Reservations System

## Overview

This guide explains how to set up the Netlify backend for Solomon's Landing reservations system, replacing EmailJS with a scalable solution using Supabase database and Resend email service.

## Architecture

```
Frontend (GitHub Pages/Netlify) 
  ↓
POST /.netlify/functions/createReservation
  ↓
Netlify Function:
  1. Validates inputs
  2. Saves to Supabase database
  3. Sends email to restaurant via Resend
  4. Sends confirmation email to customer
  5. Returns JSON response
```

## Prerequisites

1. **Supabase Account** (free tier is sufficient)
   - Sign up at https://supabase.com
   - Create a new project

2. **Resend Account** (free tier: 3,000 emails/month)
   - Sign up at https://resend.com
   - Verify your sender domain or use their test domain

3. **Netlify Account**
   - Sign up at https://netlify.com (if not already)

## Step 1: Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the SQL script from `supabase-schema.sql`:
   - Copy the entire contents of `supabase-schema.sql`
   - Paste into SQL Editor
   - Click "Run"

4. Verify the table was created:
   - Go to **Table Editor**
   - You should see `reservations` table with all columns

5. Get your Supabase credentials:
   - Go to **Settings** → **API**
   - Copy:
     - **Project URL** (SUPABASE_URL)
     - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - ⚠️ Keep this secret!

## Step 2: Set Up Resend

1. Sign up/login at https://resend.com
2. Go to **API Keys** → **Create API Key**
3. Name it "Solomon's Landing Netlify"
4. Copy the API key (RESEND_API_KEY) - ⚠️ Keep this secret!

5. **Verify Sender Domain** (or use test domain):
   - Go to **Domains** → **Add Domain**
   - Add your domain (e.g., `solomonslanding.com.mx`)
   - Follow DNS verification steps
   - OR use Resend's test domain for development

6. **Set Email From Address**:
   - Format: `"Solomon's Landing <reservations@yourdomain.com>"`
   - Or use Resend test: `"Solomon's Landing <onboarding@resend.dev>"` (for testing)

## Step 3: Deploy to Netlify

### Option A: Deploy from GitHub

1. Push this branch to GitHub:
   ```bash
   git push origin netlify-backend
   ```

2. In Netlify Dashboard:
   - Click **Add new site** → **Import an existing project**
   - Connect your GitHub repository
   - Select branch: `netlify-backend`
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `website`
     - Functions directory: `netlify/functions`

3. Click **Deploy site**

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site (if first time)
netlify init

# Deploy
netlify deploy --prod
```

## Step 4: Configure Environment Variables

In Netlify Dashboard → Your Site → **Site Settings** → **Environment Variables**, add:

| Variable | Value | Description |
|----------|-------|-------------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Supabase service role key (secret!) |
| `RESEND_API_KEY` | `re_xxxxx` | Resend API key (secret!) |
| `EMAIL_RESTAURANT` | `contact@solomonslanding.com.mx` | Restaurant email address |
| `EMAIL_FROM` | `"Solomon's Landing <reservations@yourdomain.com>"` | Verified sender address |

⚠️ **Important**: 
- Never commit these values to git
- Use Netlify's environment variables (encrypted)
- Service role key has full database access - keep it secret!

## Step 5: Test the Function

### Test Locally (Optional)

```bash
# Install dependencies
npm install

# Start Netlify Dev (runs functions locally)
netlify dev

# Test the function
curl -X POST http://localhost:8888/.netlify/functions/createReservation \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+526241234567",
    "date": "2025-12-31",
    "time": "19:00",
    "guests": "4",
    "notes": "Test reservation",
    "language": "en"
  }'
```

### Test on Netlify

1. Go to your Netlify site URL
2. Navigate to the reservations page
3. Submit a test reservation
4. Check:
   - ✅ Netlify Function logs (Dashboard → Functions → View logs)
   - ✅ Supabase database (Table Editor → reservations)
   - ✅ Restaurant email inbox
   - ✅ Customer email inbox

## Step 6: Verify GitHub Pages Fallback

The frontend automatically detects GitHub Pages and falls back to EmailJS:

1. Test on GitHub Pages URL:
   - Should use EmailJS (console will show "EmailJS fallback")
   - Reservation still works

2. Test on Netlify URL:
   - Should use Netlify Function (console will show "Netlify Function")
   - Reservation saved to database

## Monitoring

### Netlify Function Logs

- Dashboard → Functions → View logs
- Look for:
  - `✅ Reservation saved to database: [id]`
  - `✅ Restaurant email sent: [email-id]`
  - `✅ Customer confirmation email sent: [email-id]`
  - `❌ Error...` (if failures occur)

### Supabase Dashboard

- Table Editor → reservations
- See all reservations in real-time
- Filter by status, date, etc.

### Resend Dashboard

- Emails → See all sent emails
- Check delivery status
- View email content

## Troubleshooting

### Function Returns 500 Error

1. Check environment variables are set correctly
2. Verify Supabase credentials
3. Check function logs in Netlify Dashboard
4. Ensure Supabase table exists and has correct schema

### Emails Not Received

1. Check Resend API key is correct
2. Verify sender domain is verified (or using test domain)
3. Check spam/junk folder
4. Verify EMAIL_FROM format is correct: `"Name <email@domain.com>"`
5. Check Resend dashboard for delivery status

### Database Errors

1. Verify Supabase URL and service role key
2. Check table schema matches `supabase-schema.sql`
3. Ensure RLS policies allow service role access
4. Check Supabase logs for errors

### GitHub Pages Still Using EmailJS

This is expected! The code automatically detects GitHub Pages and uses EmailJS as fallback. To fully migrate:
1. Point your domain to Netlify
2. Or update DNS to use Netlify as primary

## Next Steps (Phase 2)

- [ ] Stripe payment holds
- [ ] Admin dashboard for managing reservations
- [ ] Blocked time slots system
- [ ] Customer confirmation workflow
- [ ] Cancellation system
- [ ] Email templates customization

## Security Notes

- ✅ Service role key never exposed to frontend
- ✅ All API keys stored in Netlify environment variables (encrypted)
- ✅ Input validation on server-side
- ✅ CORS properly configured
- ✅ Rate limiting can be added (Netlify Functions have built-in limits)

## Support

If you encounter issues:
1. Check Netlify Function logs
2. Check Supabase logs
3. Check Resend dashboard
4. Verify all environment variables are set
5. Test locally with `netlify dev`

## Cost Estimate

- **Supabase Free Tier**: 500MB database, 2GB bandwidth (sufficient for small-medium restaurant)
- **Resend Free Tier**: 3,000 emails/month (sufficient for ~100 reservations/month)
- **Netlify Free Tier**: 125,000 function invocations/month (more than enough)

Total: **$0/month** for small-medium volume! 🎉

