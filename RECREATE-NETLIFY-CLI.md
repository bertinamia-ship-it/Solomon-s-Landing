# Alternative: Recreate Netlify Site via CLI

If you prefer using Netlify CLI instead of the web UI:

## Prerequisites

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login
```

## Step 1: Delete Existing Site

```bash
# List your sites
netlify sites:list

# Delete the site (replace SITE_ID with your site ID)
netlify sites:delete SITE_ID
```

## Step 2: Create New Site

```bash
# Navigate to repo
cd /Users/alexis/Desktop/Solomon-s-Landing-main

# Initialize new site (will create from current directory)
netlify init

# Follow prompts:
# - Create & configure a new site
# - Team: Select your team
# - Site name: (leave default or enter new name)
# - Build command: (press Enter to leave EMPTY)
# - Directory to deploy: (press Enter to leave EMPTY - netlify.toml will handle it)
```

## Step 3: Link to GitHub Branch

```bash
# Link to specific branch
netlify link

# Or manually set:
netlify env:set NETLIFY_GIT_BRANCH netlify-backend
```

## Step 4: Deploy

```bash
# Deploy (will use netlify.toml settings)
netlify deploy --prod
```

## Step 5: Set Environment Variables

```bash
# Set each variable
netlify env:set SUPABASE_URL "your-url"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your-key" --secret
netlify env:set RESEND_API_KEY "your-key" --secret
netlify env:set RESERVATIONS_TO_EMAIL "bertinamia@gmail.com"
netlify env:set CATERING_TO_EMAIL "bertinamia@gmail.com"
netlify env:set RESEND_FROM_EMAIL "onboarding@resend.dev"

# Redeploy after setting env vars
netlify deploy --prod
```

## Verify

```bash
# Check site status
netlify status

# View functions
netlify functions:list

# View logs
netlify logs:function send-reservation
```

---

**Note:** The web UI method is recommended for first-time setup as it's more visual and easier to verify settings.

