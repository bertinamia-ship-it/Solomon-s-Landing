const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dbDir, 'solomons.db');
const db = new Database(dbPath);

// Enable foreign keys and performance optimizations
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL'); // Write-Ahead Logging for better concurrency
db.pragma('synchronous = NORMAL'); // Faster writes
db.pragma('cache_size = 10000'); // 10MB cache

// Initialize database schema
function initializeDatabase() {
    console.log('🗄️  Initializing database schema...');

    // Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            full_name TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin', 'manager', 'waiter', 'kitchen', 'bar', 'customer')),
            pin TEXT,
            email TEXT,
            phone TEXT,
            active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tables (restaurant physical tables)
    db.exec(`
        CREATE TABLE IF NOT EXISTS tables (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_number INTEGER UNIQUE NOT NULL,
            capacity INTEGER NOT NULL,
            status TEXT DEFAULT 'available' CHECK(status IN ('available', 'occupied', 'reserved', 'waiting_payment', 'closed')),
            ipad_id TEXT,
            location TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Menu items
    db.exec(`
        CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_en TEXT NOT NULL,
            name_es TEXT NOT NULL,
            description_en TEXT,
            description_es TEXT,
            category_en TEXT NOT NULL,
            category_es TEXT NOT NULL,
            price REAL NOT NULL,
            cost REAL,
            calories INTEGER,
            allergens TEXT,
            available INTEGER DEFAULT 1,
            featured INTEGER DEFAULT 0,
            is_new INTEGER DEFAULT 0,
            icons TEXT,
            image_url TEXT,
            prep_time INTEGER,
            tags TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Menu item options (like "add chicken +$50")
    db.exec(`
        CREATE TABLE IF NOT EXISTS menu_options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            menu_item_id INTEGER NOT NULL,
            name_en TEXT NOT NULL,
            name_es TEXT NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
        )
    `);

    // Orders
    db.exec(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number TEXT UNIQUE NOT NULL,
            table_id INTEGER NOT NULL,
            waiter_id INTEGER,
            customer_name TEXT,
            customer_party_size INTEGER,
            customer_allergies TEXT,
            customer_celebration TEXT,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'paid', 'cancelled')),
            subtotal REAL DEFAULT 0,
            tax REAL DEFAULT 0,
            tip REAL DEFAULT 0,
            discount REAL DEFAULT 0,
            total REAL DEFAULT 0,
            payment_method TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME,
            FOREIGN KEY (table_id) REFERENCES tables(id),
            FOREIGN KEY (waiter_id) REFERENCES users(id)
        )
    `);

    // Order items (individual dishes in an order)
    db.exec(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            menu_item_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            unit_price REAL NOT NULL,
            subtotal REAL NOT NULL,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
            category TEXT NOT NULL,
            special_instructions TEXT,
            options TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
        )
    `);

    // Sales (completed transactions)
    db.exec(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            table_number INTEGER NOT NULL,
            waiter_id INTEGER,
            waiter_name TEXT,
            subtotal REAL NOT NULL,
            tax REAL DEFAULT 0,
            tip REAL DEFAULT 0,
            discount REAL DEFAULT 0,
            total REAL NOT NULL,
            payment_method TEXT NOT NULL,
            items_json TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            shift TEXT,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (waiter_id) REFERENCES users(id)
        )
    `);

    // Audit logs (for security and tracking)
    db.exec(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            username TEXT,
            action TEXT NOT NULL,
            resource_type TEXT,
            resource_id INTEGER,
            details TEXT,
            table_number INTEGER,
            order_number TEXT,
            ip_address TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Waiter calls (when customer presses "call waiter")
    db.exec(`
        CREATE TABLE IF NOT EXISTS waiter_calls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_id INTEGER NOT NULL,
            customer_name TEXT,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'acknowledged', 'resolved')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            acknowledged_at DATETIME,
            resolved_at DATETIME,
            acknowledged_by INTEGER,
            FOREIGN KEY (table_id) REFERENCES tables(id),
            FOREIGN KEY (acknowledged_by) REFERENCES users(id)
        )
    `);

    // Waste/Merma tracking
    db.exec(`
        CREATE TABLE IF NOT EXISTS waste_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            menu_item_id INTEGER,
            item_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            cost REAL,
            reason TEXT NOT NULL CHECK(reason IN ('dropped', 'expired', 'wrong_order', 'quality_issue', 'other')),
            notes TEXT,
            reported_by INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
            FOREIGN KEY (reported_by) REFERENCES users(id)
        )
    `);

    // Discounts/Comps tracking
    db.exec(`
        CREATE TABLE IF NOT EXISTS discounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('discount', 'comp', 'promotion')),
            amount REAL NOT NULL,
            reason TEXT,
            authorized_by INTEGER NOT NULL,
            applied_by INTEGER NOT NULL,
            requires_manager INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (authorized_by) REFERENCES users(id),
            FOREIGN KEY (applied_by) REFERENCES users(id)
        )
    `);

    // Sessions (for tracking active logins)
    db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            device_info TEXT,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Shift closures (for tracking waiter shifts and cash handling)
    db.exec(`
        CREATE TABLE IF NOT EXISTS shift_closures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            waiter_id INTEGER NOT NULL,
            shift_start DATETIME NOT NULL,
            shift_end DATETIME,
            initial_cash REAL DEFAULT 0,
            final_cash REAL,
            system_cash_sales REAL DEFAULT 0,
            system_card_sales REAL DEFAULT 0,
            reported_cash_sales REAL,
            reported_card_sales REAL,
            discrepancy REAL DEFAULT 0,
            notes TEXT,
            status TEXT DEFAULT 'open' CHECK(status IN ('open', 'closed')),
            closed_by INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (waiter_id) REFERENCES users(id),
            FOREIGN KEY (closed_by) REFERENCES users(id)
        )
    `);

    // Waste tracking (mermas)
    db.exec(`
        CREATE TABLE IF NOT EXISTS waste_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            menu_item_id INTEGER,
            item_name TEXT NOT NULL,
            quantity REAL NOT NULL,
            unit TEXT NOT NULL,
            cost REAL,
            reason TEXT NOT NULL CHECK(reason IN ('spoiled', 'preparation_error', 'dropped', 'overproduction', 'customer_complaint', 'expired', 'quality_control', 'other')),
            area TEXT NOT NULL CHECK(area IN ('kitchen', 'bar', 'storage')),
            notes TEXT,
            reported_by INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
            FOREIGN KEY (reported_by) REFERENCES users(id)
        )
    `);

    // CRM - Customers table
    db.exec(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            phone TEXT,
            first_name TEXT,
            last_name TEXT,
            birthday DATE,
            location_preference TEXT,
            dietary_restrictions TEXT,
            allergens TEXT,
            favorite_items TEXT,
            total_visits INTEGER DEFAULT 0,
            total_spent REAL DEFAULT 0,
            last_visit_date DATETIME,
            marketing_consent INTEGER DEFAULT 0,
            data_processing_consent INTEGER DEFAULT 1,
            consent_date DATETIME,
            gdpr_consent_ip TEXT,
            notes TEXT,
            status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'deleted')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Customer visit history
    db.exec(`
        CREATE TABLE IF NOT EXISTS customer_visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            visit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            table_id INTEGER,
            waiter_id INTEGER,
            party_size INTEGER,
            total_spent REAL,
            items_ordered TEXT,
            special_occasion TEXT,
            satisfaction_rating INTEGER,
            feedback TEXT,
            FOREIGN KEY (customer_id) REFERENCES customers(id),
            FOREIGN KEY (table_id) REFERENCES tables(id),
            FOREIGN KEY (waiter_id) REFERENCES users(id)
        )
    `);

    // Marketing campaigns
    db.exec(`
        CREATE TABLE IF NOT EXISTS marketing_campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('email', 'sms', 'push', 'birthday')),
            subject TEXT,
            message TEXT,
            discount_code TEXT,
            discount_amount REAL,
            start_date DATE,
            end_date DATE,
            target_segment TEXT,
            sent_count INTEGER DEFAULT 0,
            opened_count INTEGER DEFAULT 0,
            clicked_count INTEGER DEFAULT 0,
            redeemed_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'active', 'completed', 'cancelled')),
            created_by INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(id)
        )
    `);

    // Discount approvals (security)
    db.exec(`
        CREATE TABLE IF NOT EXISTS discount_approvals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            requested_by INTEGER NOT NULL,
            discount_amount REAL NOT NULL,
            reason TEXT,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
            approved_by INTEGER,
            approved_at DATETIME,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (requested_by) REFERENCES users(id),
            FOREIGN KEY (approved_by) REFERENCES users(id)
        )
    `);

    console.log('✅ Database schema initialized successfully!');
}

// Create indexes for performance
function createIndexes() {
    console.log('📊 Creating database indexes...');

    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        CREATE INDEX IF NOT EXISTS idx_orders_table_id ON orders(table_id);
        CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
        CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
        CREATE INDEX IF NOT EXISTS idx_order_items_status ON order_items(status);
        CREATE INDEX IF NOT EXISTS idx_sales_timestamp ON sales(timestamp);
        CREATE INDEX IF NOT EXISTS idx_sales_waiter_id ON sales(waiter_id);
        CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
        CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
        CREATE INDEX IF NOT EXISTS idx_waiter_calls_status ON waiter_calls(status);
        CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
        CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_shift_closures_waiter_id ON shift_closures(waiter_id);
        CREATE INDEX IF NOT EXISTS idx_shift_closures_status ON shift_closures(status);
        CREATE INDEX IF NOT EXISTS idx_waste_logs_created_at ON waste_logs(created_at);
        CREATE INDEX IF NOT EXISTS idx_waste_logs_area ON waste_logs(area);
        CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
        CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
        CREATE INDEX IF NOT EXISTS idx_customer_visits_customer_id ON customer_visits(customer_id);
        CREATE INDEX IF NOT EXISTS idx_discount_approvals_status ON discount_approvals(status);
        CREATE INDEX IF NOT EXISTS idx_discount_approvals_order_id ON discount_approvals(order_id);
    `);

    // Reservation holds table for Stripe pre-authorizations
    db.exec(`
        CREATE TABLE IF NOT EXISTS reservation_holds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reservation_id INTEGER,
            stripe_payment_intent_id TEXT UNIQUE NOT NULL,
            amount REAL NOT NULL,
            status TEXT DEFAULT 'authorized' CHECK(status IN ('authorized', 'captured', 'cancelled')),
            customer_email TEXT NOT NULL,
            customer_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            captured_at DATETIME,
            cancelled_at DATETIME,
            notes TEXT,
            FOREIGN KEY (reservation_id) REFERENCES web_reservations(id)
        )
    `);

    // Web reservations table (from website, not POS)
    db.exec(`
        CREATE TABLE IF NOT EXISTS web_reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_phone TEXT,
            party_size INTEGER NOT NULL,
            reservation_date TEXT NOT NULL,
            reservation_time TEXT NOT NULL,
            hotel_staying TEXT,
            special_requests TEXT,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'seated', 'completed', 'no-show', 'cancelled')),
            stripe_payment_intent_id TEXT,
            hold_amount REAL DEFAULT 50.00,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            confirmed_at DATETIME,
            seated_at DATETIME,
            completed_at DATETIME
        )
    `);

    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_reservation_holds_payment_intent 
        ON reservation_holds(stripe_payment_intent_id);
        
        CREATE INDEX IF NOT EXISTS idx_reservation_holds_reservation_id 
        ON reservation_holds(reservation_id);
        
        CREATE INDEX IF NOT EXISTS idx_reservation_holds_status 
        ON reservation_holds(status);

        CREATE INDEX IF NOT EXISTS idx_web_reservations_email 
        ON web_reservations(customer_email);
        
        CREATE INDEX IF NOT EXISTS idx_web_reservations_date 
        ON web_reservations(reservation_date);
        
        CREATE INDEX IF NOT EXISTS idx_web_reservations_status 
        ON web_reservations(status);
    `);

    console.log('✅ Indexes created successfully!');
}

// Helper function for transactions
function runInTransaction(callback) {
    const transaction = db.transaction(callback);
    return transaction();
}

// Helper function to get database instance
function getDb() {
    return db;
}

// Backup database
function backupDatabase() {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupPath = path.join(dbDir, `backup_${timestamp}.db`);
    db.backup(backupPath);
    console.log(`✅ Database backed up to: ${backupPath}`);
    return backupPath;
}

module.exports = {
    db,
    getDb,
    initializeDatabase,
    createIndexes,
    runInTransaction,
    backupDatabase
};
