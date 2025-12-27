# Netlify Email System Setup Guide

## Overview

This project uses Netlify Functions with Nodemailer to send emails via SMTP, replacing the EmailJS free tier (200 emails/month limit). EmailJS is kept as a fallback for reliability.

## Architecture

- **Primary**: Netlify Functions (`/netlify/functions/`)
  - `send-reservation.js` → Sends to `contact@solomonslanding.com.mx`
  - `send-catering.js` → Sends to `samantha@solomonslanding.com.mx`
- **Fallback**: EmailJS (if Netlify Function fails)

## Files Created

1. **Netlify Functions**:
   - `/netlify/functions/send-reservation.js`
   - `/netlify/functions/send-catering.js`

2. **Configuration**:
   - `/package.json` - Dependencies (nodemailer)
   - `/netlify.toml` - Netlify configuration
   - `.env.example` - Environment variables template

3. **Frontend Updates**:
   - `/website/app.js` - Updated to call Netlify Functions with EmailJS fallback

## Environment Variables Setup

### For Local Development

1. Copy `.env.example` to `.env` (if not blocked by gitignore):
   ```bash
   cp .env.example .env
   ```

2. Fill in your SMTP credentials in `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   RESERVATION_EMAIL=contact@solomonslanding.com.mx
   CATERING_EMAIL=samantha@solomonslanding.com.mx
   ```

### For Netlify Production

1. Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Add the following variables:
   - `SMTP_HOST` (e.g., `smtp.gmail.com`)
   - `SMTP_PORT` (e.g., `587`)
   - `SMTP_USER` (your email address)
   - `SMTP_PASS` (your app password)
   - `RESERVATION_EMAIL` (`contact@solomonslanding.com.mx`)
   - `CATERING_EMAIL` (`samantha@solomonslanding.com.mx`)

## SMTP Provider Setup

### Gmail / Google Workspace

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Netlify Functions" as the name
   - Copy the 16-character password
3. Use these settings:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

### Zoho Mail

```
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=your-email@zoho.com
SMTP_PASS=your-password
```

### Outlook / Microsoft 365

```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

## Local Testing

### Prerequisites

1. Install Node.js (v18 or higher)
2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

### Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start Netlify Dev (runs functions locally):
   ```bash
   netlify dev
   ```

3. The site will be available at:
   - Frontend: `http://localhost:8888`
   - Functions: `http://localhost:8888/.netlify/functions/send-reservation`
   - Functions: `http://localhost:8888/.netlify/functions/send-catering`

4. Test the forms:
   - Open `http://localhost:8888/website/reservations.html`
   - Submit a test reservation
   - Check console for "✅ Reservation email sent via Netlify Function"
   - Check your email inbox for the reservation email

5. Test catering form:
   - Open `http://localhost:8888/website/catering.html`
   - Submit a test catering request
   - Check console for "✅ Catering email sent via Netlify Function"
   - Check your email inbox for the catering email

### Testing Fallback (EmailJS)

To test the EmailJS fallback:

1. Temporarily break the Netlify Function (e.g., wrong SMTP credentials)
2. Submit a form
3. Check console for "⚠️ Netlify Function failed, falling back to EmailJS"
4. Verify EmailJS sends the email

## Deployment to Netlify

### First Time Setup

1. **Connect Repository**:
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - Build command: (leave empty or `npm install`)
   - Publish directory: `website`
   - Functions directory: `netlify/functions`

3. **Set Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add all SMTP variables (see above)

4. **Deploy**:
   - Netlify will auto-deploy on push to main branch
   - Or click "Deploy site" manually

### Verify Deployment

1. Check function logs:
   - Netlify Dashboard → Functions → View logs
   - Look for successful email sends

2. Test production forms:
   - Submit a reservation on the live site
   - Check function logs for success
   - Verify email received

## Monitoring

### Netlify Function Logs

- Go to: Netlify Dashboard → Functions → View logs
- Look for:
  - `✅ Reservation email sent: [messageId]`
  - `✅ Catering email sent: [messageId]`
  - `❌ Error sending...` (if failures occur)

### Console Logs (Frontend)

- Open browser DevTools → Console
- Look for:
  - `✅ Reservation email sent via Netlify Function`
  - `✅ Reservation email sent via EmailJS (fallback)`
  - `⚠️ Netlify Function failed, falling back to EmailJS`

## Troubleshooting

### Function Returns 500 Error

1. Check environment variables are set correctly
2. Verify SMTP credentials are correct
3. Check function logs in Netlify Dashboard
4. For Gmail: Ensure App Password is used (not regular password)

### Function Returns 405 Error

- Ensure you're using POST method (not GET)
- Check CORS headers are set correctly

### Emails Not Received

1. Check spam/junk folder
2. Verify recipient email addresses are correct
3. Check SMTP provider limits (Gmail: 500/day for free accounts)
4. Verify SMTP credentials are correct

### Local Testing Not Working

1. Ensure `.env` file exists with correct values
2. Run `netlify dev` (not `npm start`)
3. Check that port 8888 is not in use
4. Verify Node.js version is 18+

## Email Limits

- **Netlify Functions**: Unlimited (no per-request cost)
- **Gmail Free**: 500 emails/day
- **Google Workspace**: 2000 emails/day
- **Zoho Free**: 250 emails/day
- **Outlook Free**: 300 emails/day

## Cost Comparison

- **EmailJS Free**: 200 emails/month (then $15/month for 1,000)
- **Netlify Functions**: Free tier includes 125,000 requests/month
- **SMTP**: Free with Gmail/Outlook, or included with email hosting

## Security Notes

- Never commit `.env` file to git
- Use App Passwords for Gmail (not regular passwords)
- Environment variables are encrypted in Netlify
- Functions run server-side (credentials never exposed to frontend)

## Next Steps

1. ✅ Test locally with `netlify dev`
2. ✅ Set environment variables in Netlify Dashboard
3. ✅ Deploy to Netlify
4. ✅ Test production forms
5. ✅ Monitor function logs
6. ⏳ (Future) Remove EmailJS once Netlify Functions are proven stable

## Support

If you encounter issues:
1. Check Netlify Function logs
2. Check browser console for errors
3. Verify environment variables are set
4. Test SMTP credentials directly with a simple Node.js script

