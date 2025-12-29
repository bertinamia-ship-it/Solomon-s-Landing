# 🚨 URGENT: Netlify Functions 404 Fix

## ✅ Code Verification (COMPLETE)

**Verified File Structure:**
```
/netlify/functions/createReservation.js  ✅ EXISTS
/netlify/functions/send-catering.js      ✅ EXISTS
/netlify.toml                            ✅ EXISTS (at repo root)
/package.json                             ✅ HAS DEPENDENCIES
```

**Function Names:**
- `createReservation.js` → Endpoint: `/.netlify/functions/createReservation`
- `send-catering.js` → Endpoint: `/.netlify/functions/send-catering`

**All code is correct and pushed to `netlify-backend` branch!**

---

## 🔧 THE FIX (Netlify Dashboard)

### Step 1: Change Production Branch ⚠️ CRITICAL

1. **Netlify Dashboard** → Site `solomons.netlify.app`
2. **Site settings** (gear icon) → **Build & deploy**
3. **Continuous Deployment** section
4. **Production branch**: 
   - **Current**: Probably `main` ❌
   - **Change to**: `netlify-backend` ✅
5. **Save**

### Step 2: Verify Build Settings

In **Build & deploy** → **Build settings**:

| Setting | Must Be | Current? |
|---------|---------|----------|
| **Base directory** | (empty) | ⬜ Check |
| **Build command** | (empty) | ⬜ Check |
| **Publish directory** | `website` | ⬜ Check |
| **Functions directory** | `netlify/functions` | ⬜ Check |

**These MUST match `netlify.toml` exactly!**

### Step 3: Force Clean Redeploy

1. **Site overview** → **Deploys**
2. **Trigger deploy** → **Clear cache and deploy site**
3. **Wait**: 2-3 minutes

---

## ✅ Verification (After Redeploy)

### A) Check Functions Tab

1. **Netlify Dashboard** → **Functions** tab
2. **Must see**:
   - ✅ `createReservation`
   - ✅ `send-catering`
3. **If missing**: Functions not packaged (check build logs)

### B) Test Endpoint

**Open**: `https://solomons.netlify.app/.netlify/functions/createReservation`

**Expected Results:**
- ✅ **405 Method Not Allowed** → Function exists! (GET not allowed, POST only)
- ✅ **200 OK** with JSON → Function exists! (validation error is fine)
- ❌ **404 Not Found** → Function not deployed (check branch/build settings)

### C) Check Build Logs

1. **Deploys** → Latest deploy → **View build log**
2. **Search for**: "Packaging functions"
3. **Should see**:
   ```
   Packaging functions from netlify/functions
   - createReservation
   - send-catering
   ```

---

## 🐛 If Still 404

### Check 1: Branch Mismatch

**Symptom**: Functions tab is empty

**Fix**: 
- Verify production branch = `netlify-backend`
- Check deploy log shows correct branch name

### Check 2: Functions Directory Mismatch

**Symptom**: Build log shows "No functions found"

**Fix**:
- Netlify UI: Functions directory = `netlify/functions`
- Must match `netlify.toml`: `directory = "netlify/functions"`

### Check 3: Function Name Mismatch

**Symptom**: Functions appear in tab but endpoint 404

**Possible causes**:
- Function name in tab is different (e.g., `create-reservation` vs `createReservation`)
- Check exact name in Functions tab
- Update frontend endpoint to match

### Check 4: Redirects Interfering

**Symptom**: Functions exist but redirects catch them

**Fix**: 
- Netlify auto-excludes `/.netlify/*` from redirects
- But verify `netlify.toml` redirects don't have `force = true` on catch-all

---

## 📸 Screenshots Needed

After fixing, provide:

1. **Netlify Functions Tab Screenshot**:
   - Should show: `createReservation`, `send-catering`

2. **Endpoint Test Result**:
   - `https://solomons.netlify.app/.netlify/functions/createReservation`
   - Should show: 405 or 200 (NOT 404)

3. **Build Log Screenshot**:
   - Should show: "Packaging functions from netlify/functions"

---

## 🎯 Expected Final State

After fixing branch and redeploying:

- ✅ Functions tab shows both functions
- ✅ `/.netlify/functions/createReservation` → **405** (not 404)
- ✅ Reservation submission works
- ✅ Function logs show success
- ✅ Emails sent via Resend
- ✅ Database row created

---

## Summary

**Root Cause**: Netlify is deploying `main` branch (no functions) instead of `netlify-backend` branch (has functions).

**Fix**: Change production branch to `netlify-backend` in Netlify Dashboard, then redeploy.

**Code Status**: ✅ All correct, all pushed, ready to deploy!

