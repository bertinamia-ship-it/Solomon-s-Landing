#!/bin/bash

# Netlify Deployment Script
# This script helps deploy the netlify-backend branch to Netlify

set -e

echo "🚀 Netlify Backend Deployment Script"
echo "====================================="
echo ""

# Check if we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "netlify-backend" ]; then
    echo "⚠️  Warning: You're on branch '$CURRENT_BRANCH', not 'netlify-backend'"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if Netlify CLI is available
if ! command -v netlify &> /dev/null && ! npx netlify --version &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

echo "✅ Netlify CLI available"
echo ""

# Check if logged in
echo "Checking Netlify login status..."
if npx netlify status &> /dev/null; then
    echo "✅ Already logged in to Netlify"
else
    echo "🔐 Please login to Netlify (this will open a browser)..."
    npx netlify login
fi

echo ""
echo "📋 Deployment Steps:"
echo "==================="
echo ""
echo "1. If this is a NEW site, run:"
echo "   npx netlify init"
echo ""
echo "2. If site already exists, link it:"
echo "   npx netlify link"
echo ""
echo "3. Deploy to production:"
echo "   npx netlify deploy --prod"
echo ""
echo "4. Set environment variables in Netlify Dashboard:"
echo "   - Go to: Site Settings → Environment Variables"
echo "   - Add: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, EMAIL_RESTAURANT, EMAIL_FROM"
echo ""
echo "5. After setting env vars, redeploy:"
echo "   npx netlify deploy --prod"
echo ""

read -p "Would you like to run 'netlify init' now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx netlify init
fi

read -p "Would you like to deploy now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to Netlify..."
    npx netlify deploy --prod
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "⚠️  IMPORTANT: Don't forget to set environment variables in Netlify Dashboard!"
    echo "   Then redeploy: npx netlify deploy --prod"
fi

