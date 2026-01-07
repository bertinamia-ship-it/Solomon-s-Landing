# Reservation App - Quick Reference

## Entry Points

The reservation management system consists of three main pages:

- **`dashboard-login.html`** - Login page for hostess and admin access
- **`hostess-dashboard.html`** - Hostess dashboard for managing reservations and table assignments
- **`admin-dashboard.html`** - Admin dashboard for table management and floor plan editing

## Local Development

1. Open the project root in VS Code
2. Use Live Server extension to serve from the repo root
3. Navigate to: `http://localhost:5500/website/dashboard-login.html`

Or use Python:
```bash
cd website
python3 -m http.server 5500
# Then open: http://localhost:5500/dashboard-login.html
```

## Netlify Deployment

- **Publish Directory**: `website` (configured in `netlify.toml`)
- **Functions**: `netlify/functions/`
- All reservation app pages are served from `/website/`

## File Structure

```
website/
├── dashboard-login.html      # Login page
├── hostess-dashboard.html    # Hostess interface
├── admin-dashboard.html      # Admin interface
├── assets/                   # Shared assets (CSS, JS, components)
└── solomons-logo.png         # Logo file
```

## Backend Functions

All API endpoints are in `netlify/functions/`:
- `send-reservation.js` - Create reservations
- `get-reservations.js` - Fetch reservations by date
- `update-reservation.js` - Edit reservations
- `cancel-reservation.js` - Cancel reservations
- `get-table-assignments.js` - Get table assignments
- `set-assignment.js` - Assign tables
- `block-table.js` - Block tables
- `get-tables.js` - Get all tables
- `get-layout.js` / `save-layout.js` - Floor plan management

## Authentication

- Login credentials stored in `dashboard-login.html`
- Session stored in `sessionStorage` (role + token)
- All API calls require `Authorization: Bearer <token>` header

