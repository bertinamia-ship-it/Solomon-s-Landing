# Netlify Functions 404 - Deployment Fix Checklist

## ✅ Code Verification (COMPLETE)

**File Structure (Verified):**
- ✅ `netlify/functions/createReservation.js` exists at repo root
- ✅ `netlify/functions/send-catering.js` exists at repo root
- ✅ `netlify.toml` exists at repo root
- ✅ `package.json` has dependencies

**Function Names:**
- ✅ `createReservation.js` → Endpoint: `/.netlify/functions/createReservation`
- ✅ `send-catering.js` → Endpoint: `/.netlify/functions/send-catering`

**Configuration:**
- ✅ `netlify.toml` has correct paths
- ✅ Functions directory: `netlify/functions`
- ✅ Publish directory: `website`

---

## 🔧 Netlify Dashboard Settings (DO THESE)

### Step 1: Verify Branch

1. **Netlify Dashboard** → Your Site → **Site settings**
2. **Build & deploy** → **Continuous Deployment**
3. **Production branch**: Must be **`netlify-backend`**
4. If it says `main`, change it to `netlify-backend` and **Save**

### Step 2: Verify Build Settings

In **Build & deploy** → **Build settings**:

| Setting | Value | Notes |
|---------|-------|-------|
| **Base directory** | (empty) or `/` | Leave empty |
| **Build command** | (empty) | Leave empty |
| **Publish directory** | `website` | Must match netlify.toml |
| **Functions directory** | `netlify/functions` | Must match netlify.toml |

**Important**: These must match `netlify.toml` exactly!

### Step 3: Force Clean Redeploy

1. **Site overview** → **Deploys**
2. **Trigger deploy** → **Clear cache and deploy site**
3. **Wait**: ~2-3 minutes for deployment

---

## ✅ Verification Steps

### A) Check Functions Tab

1. **Netlify Dashboard** → **Functions** tab
2. **Must see**:
   - ✅ `createReservation`
   - ✅ `send-catering`
3. **If missing**: Functions are not being packaged (check build logs)

### B) Check Build Logs

1. **Deploys** → Latest deploy → **View build log**
2. **Look for**:
   ```
   Installing functions dependencies
   Packaging functions from netlify/functions
   ```
3. **Should see**:
   - `createReservation.js`
   - `send-catering.js`

### C) Test Endpoint

1. **Open**: `https://solomons.netlify.app/.netlify/functions/createReservation`
2. **Expected**: 
   - ✅ **405 Method Not Allowed** (function exists, GET not allowed)
   - ✅ **200 OK** with JSON error (function exists, validation error)
   - ❌ **404 Not Found** (function not deployed)

### D) Test from Site

1. **Go to**: `https://solomons.netlify.app`
2. **Navigate**: Reservations page
3. **Submit**: Test reservation
4. **Check**: Browser console → Should show:
   ```
   ✅ Reservation created via Netlify Function: [uuid]
   ```
5. **Check**: Netlify Functions logs → Should show success

---

## 🐛 Troubleshooting

### Functions Still Not Appearing

**Check 1: Branch**
- Verify Netlify is deploying `netlify-backend` branch
- Check deploy log shows correct branch

**Check 2: File Paths**
- Functions must be at: `/netlify/functions/createReservation.js` (repo root)
- NOT at: `/website/netlify/functions/...`

**Check 3: Build Settings**
- Functions directory in Netlify UI must match `netlify.toml`
- If mismatch, Netlify won't find functions

**Check 4: Build Logs**
- Look for "Packaging functions" message
- Check for any errors about missing files

### Endpoint Returns 404 But Functions Appear in UI

**Possible causes:**
1. **Function name mismatch**: Check exact name in Functions tab
2. **Redirects interfering**: Netlify should auto-exclude `/.netlify/*` but verify
3. **Caching**: Clear cache and redeploy

**Fix**: Use the exact function name from Netlify Functions tab in frontend code.

---

## 📋 Final Checklist

- [ ] Netlify branch = `netlify-backend`
- [ ] Build settings match `netlify.toml`:
  - [ ] Publish = `website`
  - [ ] Functions = `netlify/functions`
- [ ] Site redeployed (cache cleared)
- [ ] Functions appear in Functions tab
- [ ] `/.netlify/functions/createReservation` returns 405 (not 404)
- [ ] Reservation submission works from site
- [ ] Function logs show success

---

## 🎯 Expected Result

After fixing branch and redeploying:

- ✅ Functions tab shows: `createReservation`, `send-catering`
- ✅ `/.netlify/functions/createReservation` → **405** (not 404)
- ✅ Reservation submission works
- ✅ Emails sent via Resend
- ✅ Database row created in Supabase

---

## Code Status

- ✅ All files in correct location
- ✅ `netlify.toml` updated and correct
- ✅ Functions properly structured
- ✅ Committed and pushed to `netlify-backend`

**Action Required**: Update Netlify Dashboard settings (branch + build config) and redeploy!

