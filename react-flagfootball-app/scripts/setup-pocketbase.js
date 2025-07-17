#!/usr/bin/env node

/**
 * PocketBase Setup Script
 * This script helps set up the required collections for the Flag Football app
 */

console.log('🚀 PocketBase Setup Guide');
console.log('========================');
console.log('');
console.log('1. Open your browser and go to: http://127.0.0.1:8090/_/');
console.log('');
console.log('2. If this is your first time, create an admin account:');
console.log('   - Email: admin@flagfootball.com');
console.log('   - Password: admin123456');
console.log('');
console.log('3. Create the following collections:');
console.log('');

// Users collection (auth type)
console.log('📄 Collection: users (Auth type)');
console.log('   - This will be created automatically as an auth collection');
console.log('   - Add these additional fields:');
console.log('     • name (Text, required)');
console.log('     • role (Select, required, options: player, coach, admin)');
console.log('     • firstName (Text, optional)');
console.log('     • lastName (Text, optional)');
console.log('');

// Training sessions collection
console.log('📄 Collection: training_sessions');
console.log('   - Type: Base');
console.log('   - Fields:');
console.log('     • user_id (Relation to users, required)');
console.log('     • session_type (Text, required)');
console.log('     • duration (Number, required)');
console.log('     • exercises (JSON, optional)');
console.log('     • notes (Text, optional)');
console.log('');

// Training goals collection
console.log('📄 Collection: training_goals');
console.log('   - Type: Base');
console.log('   - Fields:');
console.log('     • user_id (Relation to users, required)');
console.log('     • title (Text, required)');
console.log('     • description (Text, optional)');
console.log('     • target_date (Date, optional)');
console.log('     • completed (Bool, required, default: false)');
console.log('     • progress (Number, optional, default: 0)');
console.log('');

// Analytics events collection
console.log('📄 Collection: analytics_events');
console.log('   - Type: Base');
console.log('   - Fields:');
console.log('     • user_id (Relation to users, required)');
console.log('     • event_type (Text, required)');
console.log('     • event_data (JSON, optional)');
console.log('     • timestamp (Date, required)');
console.log('');

console.log('4. After creating collections, the app will automatically connect!');
console.log('');
console.log('💡 Note: The app has fallback mock data, so it will work even without');
console.log('   collections. Setting up collections enables full functionality.');
console.log('');
console.log('🔧 Quick Setup via Admin UI:');
console.log('   1. Go to http://127.0.0.1:8090/_/');
console.log('   2. Click "Collections" in the sidebar');
console.log('   3. Click "New collection" for each collection above');
console.log('   4. Configure fields as specified');
console.log('   5. Save each collection');
console.log('');
console.log('✅ Your app will be ready to use with full database functionality!');