#!/bin/bash

# Test Netlify Function Script
# Usage: ./test-netlify-function.sh [NETLIFY_URL]

set -e

NETLIFY_URL=${1:-"http://localhost:8888"}

echo "🧪 Testing Netlify Functions"
echo "============================"
echo ""
echo "Netlify URL: $NETLIFY_URL"
echo ""

# Test createReservation function
echo "1. Testing createReservation function..."
RESERVATION_RESPONSE=$(curl -s -X POST "$NETLIFY_URL/.netlify/functions/createReservation" \
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
  }')

echo "Response: $RESERVATION_RESPONSE"
echo ""

# Check if successful
if echo "$RESERVATION_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Reservation function works!"
    RESERVATION_ID=$(echo "$RESERVATION_RESPONSE" | grep -o '"reservationId":"[^"]*"' | cut -d'"' -f4)
    echo "   Reservation ID: $RESERVATION_ID"
else
    echo "❌ Reservation function failed"
    echo "$RESERVATION_RESPONSE" | jq '.' 2>/dev/null || echo "$RESERVATION_RESPONSE"
fi

echo ""
echo "2. Testing send-catering function..."
CATERING_RESPONSE=$(curl -s -X POST "$NETLIFY_URL/.netlify/functions/send-catering" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Catering",
    "email": "test@example.com",
    "phone": "+526241234567",
    "eventDate": "2025-12-31",
    "guestCount": "50",
    "eventType": "Wedding",
    "message": "Test catering request"
  }')

echo "Response: $CATERING_RESPONSE"
echo ""

# Check if successful
if echo "$CATERING_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Catering function works!"
else
    echo "❌ Catering function failed"
    echo "$CATERING_RESPONSE" | jq '.' 2>/dev/null || echo "$CATERING_RESPONSE"
fi

echo ""
echo "✅ Testing complete!"
echo ""
echo "Next steps:"
echo "1. Check Netlify Function logs for any errors"
echo "2. Check Supabase database for reservation row"
echo "3. Check email inbox for test emails"

