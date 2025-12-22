# UI/UX Improvements Implementation Guide

## Files Created

### CSS
1. **assets/css/global-improvements.css** - Main improvements file
   - Global container system
   - Responsive hero sizing
   - Professional footer styles
   - Refined chatbot UI
   - Standardized components

2. **assets/footer-component.html** - New footer template

## Changes to Apply to Each Page

### 1. Add CSS Link (in `<head>`)
```html
<!-- After navbar CSS, before mobile.css -->
<link rel="stylesheet" href="assets/css/global-improvements.css">
```

### 2. Replace Header (all pages except index.html - already done)
Use the navbar from `assets/navbar-component.html`
**IMPORTANT**: Remove any "Reserve" or "Book" buttons from navbar

### 3. Replace Footer (all pages)
Use the footer from `assets/footer-component.html`

### 4. Fix Hero Sections

#### index.html (Home) - Already has good structure
Add class: `class="home-hero"`

#### Other pages (menus.html, location.html, catering.html, reviews.html)
- Add class: `class="page-hero"`
- Update inline styles to use `height: clamp(220px, 30vw, 360px) !important`
- Remove `height: 100vh` or `min-height: 600px`

### 5. Location Page Specific
Replace content grid with:
```html
<div class="location-content">
  <div class="location-info">
    <!-- Info cards -->
  </div>
  <div class="location-map">
    <!-- Map iframe -->
  </div>
</div>
```

## Priority Pages to Update

1. ✅ index.html - Footer updated, CSS added
2. 🔄 menus.html - Need to update navbar, footer, hero
3. 🔄 location.html - Need everything
4. 🔄 catering.html - Need everything
5. 🔄 reviews.html - Need everything
6. 🔄 reservations.html - Need everything

## Testing Checklist

### Mobile (≤768px)
- [ ] Footer social icons centered
- [ ] Footer columns stack properly
- [ ] Hero heights appropriate
- [ ] Chatbot doesn't cover content
- [ ] No horizontal scroll

### Desktop (>768px)
- [ ] Footer 3-column grid
- [ ] Social icons horizontal
- [ ] Heroes controlled height
- [ ] Content max-width respected
- [ ] Spacing consistent

### All Pages
- [ ] No "Reserve" button in navbar
- [ ] Booking CTAs only in home hero & menu page
- [ ] Typography scales properly
- [ ] Buttons consistent style
- [ ] Cards have hover effects
