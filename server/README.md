# Solomon's Landing Backend

Backend API for Solomon's Landing Restaurant POS System.

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Initialize Database
```bash
npm run init-db
```

This will create the SQLite database with all tables and seed initial data.

### 3. Start Server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server runs on port 3000 by default.

## Default Credentials

After initialization, you can login with:

- **Admin**: `admin` / `SolomonsAdmin2025!`
- **Manager**: `manager1` / `Manager123!`
- **Waiter**: `mesero1` / `Waiter123!`
- **Kitchen**: `cocina` / `Waiter123!`
- **Bar**: `bar` / `Waiter123!`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-pin` - Verify manager PIN

### Tables (Coming soon)
- `GET /api/tables` - Get all tables
- `GET /api/tables/:id` - Get table by ID
- `PUT /api/tables/:id` - Update table status

### Orders (Coming soon)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Cancel order

### Menu (Coming soon)
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item (admin only)
- `PUT /api/menu/:id` - Update menu item (admin only)
- `DELETE /api/menu/:id` - Delete menu item (admin only)

## Database Schema

- **users** - User accounts (admin, manager, waiter, kitchen, bar)
- **tables** - Physical restaurant tables
- **menu_items** - Menu dishes and drinks
- **menu_options** - Menu item options (add-ons)
- **orders** - Customer orders
- **order_items** - Individual items in orders
- **sales** - Completed transactions
- **audit_logs** - Security and action logging
- **waiter_calls** - Customer service requests
- **waste_tracking** - Food/drink waste tracking
- **discounts** - Discount and comp tracking
- **sessions** - Active user sessions

## Environment Variables

See `.env` file for configuration options.

## Security Features

- JWT authentication
- Role-based access control
- Manager PIN verification for sensitive actions
- Audit logging for all actions
- Rate limiting
- Helmet security headers
- CORS protection

## Development

The server uses:
- Express.js for API
- SQLite (better-sqlite3) for database
- JWT for authentication
- bcrypt for password hashing
