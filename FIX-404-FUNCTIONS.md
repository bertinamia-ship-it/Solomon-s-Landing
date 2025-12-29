# Fix Netlify Functions 404 Error

## Problem
- `/.netlify/functions/createReservation` returns 404
- Functions are not being deployed

## Root Cause
Netlify is likely deploying the **wrong branch** (`main` instead of `netlify-backend`).

---

## Step-by-Step Fix

### Step 1: Update Netlify Branch Settings

1. **Go to**: Netlify Dashboard → Your Site (`solomons.netlify.app`)
2. **Click**: **Site settings** (gear icon)
3. **Go to**: **Build & deploy** → **Continuous Deployment**
4. **Find**: **Production branch**
5. **Change**: From `main` → **`netlify-backend`**
6. **Click**: **Save**

### Step 2: Verify Build Settings

Still in **Build & deploy** settings:

1. **Base directory**: Leave empty (or `/`)
2. **Build command**: Leave empty (or blank)
3. **Publish directory**: `website`
4. **Functions directory**: `netlify/functions`
5. **Click**: **Save**

### Step 3: Verify netlify.toml

The `netlify.toml` file should exist in the repo root with:

```toml
[build]
  command = ""
  publish = "website"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
  node_version = "18"
```

✅ **This is already correct in the repo!**

### Step 4: Force Redeploy

1. **Go to**: Site overview
2. **Click**: **Trigger deploy** → **Clear cache and deploy site**
3. **Wait**: ~2-3 minutes for deployment

### Step 5: Verify Functions Deployed

After deployment completes:

1. **Check**: Netlify Dashboard → **Functions** tab
2. **Should see**:
   - `createReservation`
   - `send-catering`
   - `send-reservation` (old, can ignore)

3. **Test endpoint**:
   - Open: `https://solomons.netlify.app/.netlify/functions/createReservation`
   - **Expected**: `405 Method Not Allowed` (not 404!)
   - This means the function exists, but GET is not allowed (POST only)

### Step 6: Test Full Flow

1. **Go to**: `https://solomons.netlify.app`
2. **Navigate**: To reservations page
3. **Submit**: Test reservation
4. **Check**: Browser console should show:
   ```
   ✅ Reservation created via Netlify Function: [uuid]
   ```
5. **Check**: Netlify Functions logs for success

---

## Verification Checklist

After completing steps above:

- [ ] Netlify branch set to `netlify-backend`
- [ ] Build settings: Publish = `website`, Functions = `netlify/functions`
- [ ] Site redeployed (with cache cleared)
- [ ] Functions tab shows `createReservation` and `send-catering`
- [ ] `/.netlify/functions/createReservation` returns 405 (not 404)
- [ ] Reservation submission works from site
- [ ] Function logs show success messages

---

## If Still 404 After Above Steps

### Check 1: Function Files Exist in Branch

```bash
# Verify files are in the branch
git checkout netlify-backend
ls -la netlify/functions/
# Should show: createReservation.js, send-catering.js
```

### Check 2: Netlify Build Logs

1. **Go to**: Netlify Dashboard → **Deploys**
2. **Click**: Latest deploy
3. **Check**: Build logs for:
   - ✅ "Installing functions dependencies"
   - ✅ "Packaging functions"
   - ❌ Any errors about missing functions

### Check 3: Function File Structure

Functions must export `handler`:

```javascript
exports.handler = async (event, context) => {
  // function code
};
```

✅ **This is already correct!**

### Check 4: Package.json Dependencies

Functions need dependencies in root `package.json`:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "resend": "^3.2.0"
  }
}
```

✅ **This is already correct!**

---

## Quick Fix Command (If You Have Netlify CLI)

```bash
# Link to existing site
npx netlify link

# Update site settings
npx netlify sites:update --name solomons

# Or manually update in dashboard (easier)
```

---

## Expected Result

After fixing branch and redeploying:

- ✅ `/.netlify/functions/createReservation` → **405 Method Not Allowed** (function exists!)
- ✅ `POST /.netlify/functions/createReservation` → **200 OK** (with valid data)
- ✅ Functions appear in Netlify Dashboard → Functions tab
- ✅ Reservation submission works from site

---

## Summary

**Most likely issue**: Netlify is deploying `main` branch instead of `netlify-backend`.

**Fix**: Change production branch to `netlify-backend` in Netlify settings, then redeploy.

The code is correct - it's just a deployment configuration issue! 🎯

