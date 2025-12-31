# Recreate Netlify Site - Step-by-Step Guide

## ✅ Repository Verification (COMPLETE)

**Repository:** `https://github.com/bertinamia-ship-it/Solomon-s-Landing`  
**Branch:** `netlify-backend`  
**netlify.toml:** ✅ Correct (publish = "website", functions = "netlify/functions")

---

## 🗑️ Step 1: Delete Existing Netlify Site

1. **Go to:** [Netlify Dashboard](https://app.netlify.com)
2. **Find:** Your site (likely named "solomons" or "Solomon-s-Landing")
3. **Click:** Site name to open site overview
4. **Go to:** **Site settings** (gear icon in top right)
5. **Scroll down** to **General** section
6. **Click:** **Delete site** (at the bottom, red button)
7. **Confirm deletion** by typing the site name
8. **Click:** **Delete**

⚠️ **Note:** This will permanently delete the site. You'll need to recreate it from scratch.

---

## 🆕 Step 2: Create New Netlify Site

1. **Go to:** [Netlify Dashboard](https://app.netlify.com)
2. **Click:** **Add new site** → **Import an existing project**
3. **Choose:** **GitHub** (or Git provider you're using)
4. **Authorize** Netlify if prompted
5. **Search for:** `Solomon-s-Landing` repository
6. **Select:** `bertinamia-ship-it/Solomon-s-Landing`
7. **Click:** **Next**

---

## ⚙️ Step 3: Configure Build Settings (CRITICAL)

**IMPORTANT:** Leave these fields **EMPTY** to let `netlify.toml` control everything:

### Build settings:
- **Branch to deploy:** Select `netlify-backend` from dropdown
- **Base directory:** Leave **EMPTY** (blank)
- **Build command:** Leave **EMPTY** (blank)
- **Publish directory:** Leave **EMPTY** (blank) ⚠️ **CRITICAL - Must be empty!**

### Advanced build settings:
- **Functions directory:** Leave **EMPTY** (blank) - `netlify.toml` will set this

**Why empty?** When these fields are empty, Netlify will read `netlify.toml` and use:
- `publish = "website"` from `netlify.toml`
- `functions = "netlify/functions"` from `netlify.toml`

---

## 🚀 Step 4: Deploy

1. **Click:** **Deploy site**
2. **Wait:** 2-3 minutes for initial deployment
3. **Watch:** Build logs to confirm:
   - ✅ "Publishing directory: website"
   - ✅ "Functions directory: netlify/functions"
   - ✅ "Packaging functions from netlify/functions"

---

## ✅ Step 5: Verify Deployment

### A) Check Deploy Status
1. **Site overview** → **Deploys** tab
2. **Latest deploy** should show: **Published** ✅

### B) Check Build Logs
1. **Click:** Latest deploy → **View build log**
2. **Look for:**
   ```
   Publishing directory: website
   Functions directory: netlify/functions
   Packaging functions from netlify/functions
   ```

### C) Check Site Settings
1. **Site settings** → **Build & deploy** → **Build settings**
2. **Verify:**
   - **Publish directory:** Should show `website` (from netlify.toml)
   - **Functions directory:** Should show `netlify/functions` (from netlify.toml)
   - **Base directory:** Should be empty
   - **Build command:** Should be empty

### D) Test Homepage
1. **Click:** Site URL (e.g., `https://solomons.netlify.app`)
2. **Verify:** Homepage loads correctly
3. **Check:** No 404 errors in console

### E) Test Functions
1. **Site overview** → **Functions** tab
2. **Should see:**
   - ✅ `send-reservation`
   - ✅ `send-catering`
3. **Test endpoint:**
   - Open: `https://[your-site].netlify.app/.netlify/functions/send-reservation`
   - Expected: **405 Method Not Allowed** (not 404)

---

## 🔧 Step 6: Set Environment Variables

After site is created, set environment variables:

1. **Site settings** → **Environment variables**
2. **Add variables:**
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (mark as Secret)
   - `RESEND_API_KEY` (mark as Secret)
   - `RESERVATIONS_TO_EMAIL`
   - `CATERING_TO_EMAIL`
   - `RESEND_FROM_EMAIL`

3. **Save** and **Redeploy** site

---

## 🐛 Troubleshooting

### Issue: "Deploy directory 'solomons' does not exist"
**Cause:** Netlify UI settings are overriding `netlify.toml`  
**Fix:** 
1. Go to **Site settings** → **Build & deploy** → **Build settings**
2. **Clear** the "Publish directory" field (make it empty)
3. **Save**
4. **Trigger deploy** → **Clear cache and deploy site**

### Issue: Functions not appearing
**Check:**
1. Functions directory in UI matches `netlify.toml`
2. Functions exist at `netlify/functions/` in repo
3. Build logs show "Packaging functions"

### Issue: Homepage 404
**Check:**
1. Publish directory is `website` (not `solomons`)
2. `website/index.html` exists in repo
3. Build logs show "Publishing directory: website"

---

## 📋 Final Checklist

- [ ] Old site deleted
- [ ] New site created from GitHub
- [ ] Branch set to `netlify-backend`
- [ ] Build command: **EMPTY**
- [ ] Publish directory: **EMPTY** (in UI)
- [ ] Functions directory: **EMPTY** (in UI)
- [ ] Site deployed successfully
- [ ] Deploy status: **Published**
- [ ] Homepage loads correctly
- [ ] Functions appear in Functions tab
- [ ] Environment variables set
- [ ] Test reservation submission works

---

## 🎯 Expected Result

After recreation:
- ✅ Site serves from `/website` directory
- ✅ Functions work at `/.netlify/functions/send-reservation`
- ✅ No "solomons" directory errors
- ✅ Clean deployment with no stale config

---

**Note:** If you prefer using Netlify CLI instead of UI, see alternative method below.

