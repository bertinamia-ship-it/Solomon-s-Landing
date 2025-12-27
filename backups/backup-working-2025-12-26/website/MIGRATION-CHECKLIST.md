# 🚀 Migration Checklist - Apply New Navbar to All Pages

## ✅ Completed
- [x] Created `/assets/` folder structure
- [x] Built navbar component CSS
- [x] Built main.js with i18n system
- [x] Updated index.html with new navbar
- [x] Tested on mobile/desktop

## 📋 To-Do: Apply to Other Pages

### 1. menus.html
- [ ] Add CSS link: `<link rel="stylesheet" href="assets/css/components/navbar.css">`
- [ ] Add JS link: `<script src="assets/js/main.js"></script>`
- [ ] Replace old header with new navbar HTML
- [ ] Add `data-i18n` attributes to content
- [ ] Test mobile menu
- [ ] Test language toggle

### 2. reviews.html
- [ ] Add CSS link: `<link rel="stylesheet" href="assets/css/components/navbar.css">`
- [ ] Add JS link: `<script src="assets/js/main.js"></script>`
- [ ] Replace old header with new navbar HTML
- [ ] Add `data-i18n` attributes to content
- [ ] Test mobile menu
- [ ] Test language toggle

### 3. catering.html
- [ ] Add CSS link: `<link rel="stylesheet" href="assets/css/components/navbar.css">`
- [ ] Add JS link: `<script src="assets/js/main.js"></script>`
- [ ] Replace old header with new navbar HTML
- [ ] Add `data-i18n` attributes to content
- [ ] Test mobile menu
- [ ] Test language toggle

### 4. location.html
- [ ] Add CSS link: `<link rel="stylesheet" href="assets/css/components/navbar.css">`
- [ ] Add JS link: `<script src="assets/js/main.js"></script>`
- [ ] Replace old header with new navbar HTML
- [ ] Add `data-i18n` attributes to content
- [ ] Test mobile menu
- [ ] Test language toggle

### 5. reservations.html
- [ ] Add CSS link: `<link rel="stylesheet" href="assets/css/components/navbar.css">`
- [ ] Add JS link: `<script src="assets/js/main.js"></script>`
- [ ] Replace old header with new navbar HTML
- [ ] Add `data-i18n` attributes to content
- [ ] Test mobile menu
- [ ] Test language toggle

### 6. admin.html
- [ ] Add CSS link: `<link rel="stylesheet" href="assets/css/components/navbar.css">`
- [ ] Add JS link: `<script src="assets/js/main.js"></script>`
- [ ] Replace old header with new navbar HTML
- [ ] Test mobile menu

## 🎯 Quick Copy-Paste Steps

### Step 1: Add to `<head>` (after other CSS)
```html
<!-- Navbar Component -->
<link rel="stylesheet" href="assets/css/components/navbar.css">
```

### Step 2: Add before `</body>` (or after other scripts)
```html
<!-- Main JavaScript -->
<script src="assets/js/main.js"></script>
```

### Step 3: Replace `<header>` section
Copy from: `assets/navbar-component.html`

### Step 4: Add translations to content
```html
<!-- Before -->
<h1>International Cuisine Restaurant</h1>

<!-- After -->
<h1 data-i18n="hero.title">International Cuisine Restaurant</h1>
```

## 🧪 Testing Checklist (Each Page)

- [ ] Desktop: Navbar looks correct
- [ ] Desktop: Links work
- [ ] Desktop: Language toggle works
- [ ] Desktop: Active page highlighted
- [ ] Mobile: Hamburger button appears
- [ ] Mobile: Menu slides out smoothly
- [ ] Mobile: Overlay closes menu
- [ ] Mobile: Links work
- [ ] Mobile: Language toggle works
- [ ] Scroll: Header gets sticky
- [ ] Accessibility: Tab navigation works
- [ ] Accessibility: ESC closes mobile menu

## 📱 Test Devices

- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Desktop Firefox
- [ ] Tablet

## 🐛 Common Issues & Fixes

### Issue: Navbar doesn't show
**Fix:** Check file paths are correct:
- CSS: `assets/css/components/navbar.css`
- JS: `assets/js/main.js`

### Issue: Mobile menu doesn't open
**Fix:** Ensure main.js is loaded and navbar HTML matches template

### Issue: Language doesn't switch
**Fix:** Check elements have `data-i18n` attributes and keys exist in main.js

### Issue: Styles conflict
**Fix:** Navbar CSS uses specific class names (`.navbar-*`), check for conflicts in old CSS

## 💡 Pro Tips

1. **Test incrementally**: Do one page at a time
2. **Keep backup**: Copy old header HTML before replacing
3. **Clear cache**: Use Cmd/Ctrl + Shift + R to hard refresh
4. **Use DevTools**: Check console for JavaScript errors
5. **Mobile first**: Test on real mobile device, not just browser resize

## 📊 Progress Tracker

- **Pages migrated:** 1/7 (14%)
- **Estimated time:** ~30 min per page
- **Priority order:** index.html → menus.html → reservations.html → others

---

## 🎉 When Complete

- [ ] All pages use new navbar
- [ ] All pages support EN/ES switching
- [ ] Mobile menu works everywhere
- [ ] No console errors
- [ ] Tested on multiple devices
- [ ] Language persists across pages
- [ ] Active page detection works

**Then:** Delete old navbar code from styles.css and mobile.css ✨
