const bcrypt = require('bcrypt');
const { db, initializeDatabase, createIndexes } = require('../config/database');
const { seedDatabase } = require('./seed-data');

async function init() {
    try {
        console.log('🚀 Initializing Solomon\'s Landing Database...\n');
        
        // Create schema
        initializeDatabase();
        
        // Create indexes
        createIndexes();
        
        // Seed initial data
        await seedDatabase();
        
        console.log('\n✨ Database initialization complete!');
        console.log('🎯 You can now start the server with: npm start\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        process.exit(1);
    }
}

init();
