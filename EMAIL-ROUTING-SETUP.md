# Email Routing Setup - Separate Recipients by Form

## Overview
This document outlines the email routing changes implemented to send form submissions to the correct email addresses based on form type.

## Changes Made

### 1. **email-config.js** - Updated Configuration
- **Added Email Recipients Configuration**:
  ```javascript
  EMAILS: {
    CATERING: 'samantha@solomonslanding.com.mx',
    RESERVATIONS: 'contact@solomonslanding.com.mx',
    RESTAURANT: 'solomonslanding@gmail.com'
  }
  ```

- **Added Template ID for Catering**:
  ```javascript
  CATERING_QUOTE: 'template_catering_quote'
  ```

- **Added New Method**: `sendCateringQuote(cateringData)`
  - Sends catering requests to `samantha@solomonslanding.com.mx`
  - Uses EmailJS template: `template_catering_quote`
  - Parameters:
    - `to_email`: samantha@solomonslanding.com.mx
    - `from_name`: Customer name
    - `from_email`: Customer email
    - `phone`: Customer phone
    - `event_date`: Event date
    - `guest_count`: Number of guests
    - `event_type`: Type of event (wedding, corporate, etc.)
    - `message`: Additional details

- **Updated Method**: `sendRestaurantAlert()`
  - Changed from hardcoded `'solomonslanding@gmail.com'`
  - Now uses `EMAIL_CONFIG.EMAILS.RESERVATIONS` → `contact@solomonslanding.com.mx`

### 2. **app.js** - Updated Catering Form Handler
- Modified `initCateringForm()` function
- Form submission now calls `emailService.sendCateringQuote(formData)`
- Success message: "✅ Thank you! Your catering request has been sent to our team. We will contact you within 24 hours."
- Error handling with fallback message
- Form validation remains unchanged (minimum 20 guests, etc.)

### 3. **catering.html** - Script Loading Order
- **Added EmailJS Library** CDN:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js" defer></script>
  ```

- **Added Email Configuration Script**:
  ```html
  <script src="email-config.js?v=21"></script>
  ```

- Updated inline form handler to use `emailService.sendCateringQuote()` with fallback to direct EmailJS call
- Email recipient: `samantha@solomonslanding.com.mx`

### 4. **reservations.html** - Updated for New Config
- **Added Email Configuration Script**:
  ```html
  <script src="email-config.js?v=21"></script>
  ```

- **Updated Form Handler**:
  - Changed from hardcoded `'solomonslanding@gmail.com'`
  - Now uses `EMAIL_CONFIG.EMAILS.RESERVATIONS` → `contact@solomonslanding.com.mx`
  - Email recipient for all reservation forms: `contact@solomonslanding.com.mx`

## Email Recipients Summary

| Form Type | Email Recipient | Template | Status |
|-----------|-----------------|----------|--------|
| **Catering Request** | samantha@solomonslanding.com.mx | template_catering_quote | ✅ Configured |
| **Reservation** | contact@solomonslanding.com.mx | template_ij3p83j | ✅ Configured |
| **Admin** | solomonslanding@gmail.com | Various | N/A |

## Testing Instructions

### Test 1: Catering Form Submission
1. Navigate to `/website/catering.html`
2. Scroll to "Contact for Quote" section
3. Fill in all required fields:
   - Name
   - Email (use a test email you can access)
   - Phone
   - Event Date (future date)
   - Number of Guests (minimum 20)
   - Event Type
   - Message (optional)
4. Click "Request Quote"
5. **Expected Result**: Email should be received at `samantha@solomonslanding.com.mx`

### Test 2: Reservation Form Submission
1. Navigate to `/website/reservations.html`
2. Scroll to reservation form
3. Fill in all required fields:
   - Name
   - Email
   - Phone (optional)
   - Date
   - Time
   - Number of Guests
   - Notes (optional)
4. Click submit button
5. **Expected Result**: Email should be received at `contact@solomonslanding.com.mx`

### Test 3: Homepage Catering Form (if exists)
1. Navigate to `/website/index.html`
2. Scroll to catering section
3. Fill in and submit catering form
4. **Expected Result**: Email should be received at `samantha@solomonslanding.com.mx`

## Key Features

✅ **No UI Changes** - Only email routing logic was modified
✅ **No Reservation Logic Changes** - Validation and form behavior remain the same
✅ **Centralized Config** - All email addresses managed in `email-config.js`
✅ **Error Handling** - Both methods have try-catch with fallback messages
✅ **Backwards Compatible** - Fallback if emailService is not available
✅ **Dynamic Recipient** - Easy to change emails in one place (email-config.js)

## Files Modified

1. `/website/email-config.js` - Email configuration and service
2. `/website/app.js` - Catering form handler
3. `/website/catering.html` - Script loading and form submission
4. `/website/reservations.html` - Email configuration and form submission

## EmailJS Configuration Required

**NOTE**: The templates must be created in EmailJS dashboard:

1. `template_catering_quote` - For catering requests
   - Required variables: `to_email`, `from_name`, `from_email`, `phone`, `event_date`, `guest_count`, `event_type`, `message`

2. `template_ij3p83j` - For reservation alerts (already exists)
   - Required variables: `to_email`, `customer_name`, `customer_email`, `customer_phone`, `reservation_date`, `reservation_time`, `party_size`, `special_requests`, `confirmation_code`, `confirm_url`, `customer_language`

## Troubleshooting

### Emails Not Sending
- Check EmailJS account is active
- Verify API keys are correct in `email-config.js`
- Check EmailJS dashboard for template creation
- Open browser console (F12) for error messages

### Wrong Email Recipient
- Verify `EMAIL_CONFIG.EMAILS` in `email-config.js`
- Check that `email-config.js` is loaded before the form handler
- Clear browser cache and reload

### Form Stuck on "Sending..."
- Check browser console for JavaScript errors
- Verify EmailJS SDK is loaded from CDN
- Check network tab for failed API calls

## Future Improvements

- Add email confirmation to customer after submission
- Implement email templates for both customer and restaurant notifications
- Add phone number validation for different countries
- Implement email validation with verification code
- Add spam protection (reCAPTCHA)

---
**Last Updated**: December 26, 2025
**Status**: Ready for Testing
