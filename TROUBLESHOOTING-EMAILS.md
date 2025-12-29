# Troubleshooting: Emails Not Sending on Netlify

## What to Check in Netlify Function Logs

After submitting a reservation or catering request, check **Netlify Dashboard** → **Functions** → **View logs** for `createReservation` or `send-catering`.

### ✅ Success Indicators

Look for these log messages (in order):

1. **Environment Variables Check:**
   ```
   🔍 Environment Variables Check:
     SUPABASE_URL: ✅ Set
     SUPABASE_SERVICE_ROLE_KEY: ✅ Set
     RESEND_API_KEY: ✅ Set
     RESERVATIONS_TO_EMAIL: ✅ Set
     RESEND_FROM_EMAIL: ✅ Set
     Using emailFrom: onboarding@resend.dev
     Using emailRestaurant: bertinamia@gmail.com
   ```

2. **Database Save:**
   ```
   ✅ Reservation saved to database: [uuid]
   ```

3. **Email Sending:**
   ```
   📧 Sending restaurant email...
     From: onboarding@resend.dev
     To: bertinamia@gmail.com
     Subject: New Reservation - [name]
   ✅ Restaurant email sent successfully
     Email ID: [resend-email-id]
   ```

### ❌ Common Errors

#### Error 1: Missing Environment Variables

**Logs show:**
```
🔍 Environment Variables Check:
  RESEND_FROM_EMAIL: ❌ Missing
  RESEND_API_KEY: ❌ Missing
```

**Fix:**
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add missing variables:
   - `RESEND_FROM_EMAIL=onboarding@resend.dev`
   - `RESEND_API_KEY=re_xxxxx...`
3. **Redeploy** site (Trigger deploy → Clear cache and deploy)

#### Error 2: Resend API Error

**Logs show:**
```
❌ Error sending restaurant email: [Error object]
  Error message: Invalid API key
```

**Fix:**
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard → API Keys
- Regenerate key if needed
- Update in Netlify env vars
- Redeploy

#### Error 3: Invalid From Address

**Logs show:**
```
❌ Error sending restaurant email: [Error object]
  Error message: Invalid 'from' field
```

**Fix:**
- Verify `RESEND_FROM_EMAIL` format: `onboarding@resend.dev` (no quotes, no "Name <email>")
- For production: Use verified domain email
- Check Resend dashboard → Domains for verified senders

#### Error 4: Database Error

**Logs show:**
```
❌ Database error: [error details]
```

**Fix:**
- Verify `SUPABASE_URL` is correct
- Verify `SUPABASE_SERVICE_ROLE_KEY` is service_role key (not anon key)
- Check Supabase table exists: `reservations`
- Verify RLS policy allows service role access

#### Error 5: Function Not Found (404)

**Browser console shows:**
```
Failed to fetch: /.netlify/functions/createReservation
404 Not Found
```

**Fix:**
- Verify functions directory is set: `netlify/functions`
- Check function file exists: `netlify/functions/createReservation.js`
- Redeploy site
- Check Netlify build logs for function compilation errors

---

## Step-by-Step Debugging

### Step 1: Check Environment Variables

In Netlify Function logs, look for:
```
🔍 Environment Variables Check:
```

All should show `✅ Set`. If any show `❌ Missing`, add that variable and redeploy.

### Step 2: Check Database Connection

Look for:
```
✅ Reservation saved to database: [uuid]
```

If missing, check:
- Supabase URL is correct
- Service role key is correct
- Table `reservations` exists
- RLS policy allows access

### Step 3: Check Email Sending

Look for:
```
📧 Sending restaurant email...
✅ Restaurant email sent successfully
  Email ID: [id]
```

If you see `❌ Error sending restaurant email:`, check:
- Resend API key is valid
- `RESEND_FROM_EMAIL` is correct format
- Sender domain is verified (or using test domain)
- Check Resend dashboard → Emails for delivery status

### Step 4: Check Resend Dashboard

1. Go to: https://resend.com → **Emails**
2. Look for your test emails
3. Check delivery status:
   - ✅ **Delivered**: Email sent successfully
   - ⚠️ **Pending**: Still processing
   - ❌ **Failed**: Check error message

### Step 5: Check Spam Folder

- Emails might be in spam/junk folder
- Check `bertinamia@gmail.com` spam folder
- Resend test emails sometimes go to spam initially

---

## Frontend Verification

### Check Browser Console

After submitting form, browser console should show:

**On Netlify:**
```
✅ Reservation created via Netlify Function: [uuid]
```

**On GitHub Pages (fallback):**
```
⚠️ Netlify Function failed, falling back to EmailJS
✅ Reservation email sent via EmailJS (fallback)
```

### Check Network Tab

1. Open DevTools → **Network** tab
2. Submit reservation
3. Look for request to: `/.netlify/functions/createReservation`
4. Check:
   - **Status**: Should be `200 OK`
   - **Response**: Should contain `"success": true`

---

## Quick Fixes

### If Emails Still Don't Arrive

1. **Verify RESEND_FROM_EMAIL format:**
   - ✅ Correct: `onboarding@resend.dev`
   - ❌ Wrong: `"Solomon's Landing <onboarding@resend.dev>"`
   - ❌ Wrong: `Solomon's Landing <onboarding@resend.dev>`

2. **Check Resend API key:**
   - Must start with `re_`
   - Should be from Resend dashboard → API Keys
   - Marked as "Secret" in Netlify

3. **Verify recipient emails:**
   - `RESERVATIONS_TO_EMAIL=bertinamia@gmail.com`
   - `CATERING_TO_EMAIL=bertinamia@gmail.com`
   - No quotes, no spaces

4. **Redeploy after env var changes:**
   - Always redeploy after adding/updating env vars
   - Use: Trigger deploy → Clear cache and deploy

---

## Expected Log Flow (Success)

```
START Request received
🔍 Environment Variables Check:
  SUPABASE_URL: ✅ Set
  SUPABASE_SERVICE_ROLE_KEY: ✅ Set
  RESEND_API_KEY: ✅ Set
  RESERVATIONS_TO_EMAIL: ✅ Set
  RESEND_FROM_EMAIL: ✅ Set
  Using emailFrom: onboarding@resend.dev
  Using emailRestaurant: bertinamia@gmail.com
✅ Reservation saved to database: abc123-uuid-456
📧 Sending restaurant email...
  From: onboarding@resend.dev
  To: bertinamia@gmail.com
  Subject: New Reservation - Test User
✅ Restaurant email sent successfully
  Email ID: re_abc123...
📧 Sending customer confirmation email...
  From: onboarding@resend.dev
  To: test@example.com
✅ Customer confirmation email sent successfully
  Email ID: re_def456...
END Success response
```

---

## Still Not Working?

If emails still don't arrive after checking all above:

1. **Share Netlify Function logs** (full log output)
2. **Share Resend dashboard** screenshot (Emails section)
3. **Share browser console** output
4. **Verify** all 6 environment variables are set correctly

The logs will tell us exactly what's wrong! 🔍

