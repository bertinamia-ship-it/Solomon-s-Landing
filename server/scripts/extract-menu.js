#!/usr/bin/env node

// Script to extract menu from pos-app/index.html and import to database via API

const fs = require('fs');
const path = require('path');

console.log('🍽️  Extracting menu from POS app...\n');

// Read the HTML file
const htmlPath = path.join(__dirname, '../../pos-app/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Extract menuData array using regex
const menuDataMatch = html.match(/menuData\s*=\s*\[([\s\S]*?)\];/);

if (!menuDataMatch) {
    console.error('❌ Could not find menuData in HTML file');
    process.exit(1);
}

// Parse the menu data (eval is safe here since it's our own code)
let menuData;
try {
    // Wrap in function to avoid global scope issues
    menuData = eval(`(function() { return [${menuDataMatch[1]}]; })()`);
} catch (error) {
    console.error('❌ Error parsing menuData:', error.message);
    process.exit(1);
}

console.log(`✅ Extracted ${menuData.length} menu items\n`);

// Save to JSON file
const jsonPath = path.join(__dirname, '../database/menu-export.json');
fs.writeFileSync(jsonPath, JSON.stringify(menuData, null, 2));

console.log(`💾 Saved menu to: ${jsonPath}`);
console.log(`\n📊 Menu Summary:`);
console.log(`   Total Items: ${menuData.length}`);

// Count by category
const categories = {};
menuData.forEach(item => {
    const cat = item.category.en;
    categories[cat] = (categories[cat] || 0) + 1;
});

Object.keys(categories).forEach(cat => {
    console.log(`   ${cat}: ${categories[cat]} items`);
});

console.log(`\n✨ Menu extraction complete!`);
console.log(`\n🚀 To import to database, run:`);
console.log(`   curl -X POST http://localhost:3000/api/menu/import \\`);
console.log(`     -H "Authorization: Bearer YOUR_TOKEN" \\`);
console.log(`     -H "Content-Type: application/json" \\`);
console.log(`     -d @server/database/menu-export.json`);
