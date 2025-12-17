const bcrypt = require('bcrypt');
const { db } = require('../config/database');

async function seedDatabase() {
    console.log('🌱 Seeding database...');

    try {
        // 1. Create default admin user
        const adminPassword = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'SolomonsAdmin2025!', 10);
        const managerPassword = await bcrypt.hash('Manager123!', 10);
        const waiterPassword = await bcrypt.hash('Waiter123!', 10);

        const insertUser = db.prepare(`
            INSERT OR IGNORE INTO users (username, password, full_name, role, pin, email, active)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `);

        insertUser.run('admin', adminPassword, 'Administrator', 'admin', '9999', 'admin@solomonslanding.com');
        insertUser.run('manager1', managerPassword, 'Manager Principal', 'manager', '1234', 'manager@solomonslanding.com');
        insertUser.run('mesero1', waiterPassword, 'Juan García', 'waiter', '1111', null);
        insertUser.run('mesero2', waiterPassword, 'María López', 'waiter', '2222', null);
        insertUser.run('cocina', waiterPassword, 'Cocina Principal', 'kitchen', '3333', null);
        insertUser.run('bar', waiterPassword, 'Bar Principal', 'bar', '4444', null);

        console.log('✅ Default users created');

        // 2. Create 20 restaurant tables
        const insertTable = db.prepare(`
            INSERT OR IGNORE INTO tables (table_number, capacity, status, location)
            VALUES (?, ?, 'available', ?)
        `);

        for (let i = 1; i <= 20; i++) {
            const capacity = i <= 10 ? 4 : 6; // Tables 1-10: 4 people, 11-20: 6 people
            const location = i <= 10 ? 'Inside' : 'Patio';
            insertTable.run(i, capacity, location);
        }

        console.log('✅ 20 tables created');

        // 3. Menu will be imported later via API endpoint or separate script
        console.log('ℹ️  Menu data will be imported separately');
        
        console.log('\n✅ Database seeded successfully!');
        console.log('\n📋 Default Credentials:');
        console.log('   Admin: admin / SolomonsAdmin2025!');
        console.log('   Manager: manager1 / Manager123!');
        console.log('   Waiter: mesero1 / Waiter123!');
        console.log('   Kitchen: cocina / Waiter123!');
        console.log('   Bar: bar / Waiter123!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

module.exports = { seedDatabase };
