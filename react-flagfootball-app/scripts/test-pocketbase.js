import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function testConnection() {
  console.log('🔍 Testing PocketBase connection...');
  
  try {
    // Test basic connection
    const health = await pb.health.check();
    console.log('✅ PocketBase server is healthy:', health);
    
    // List existing collections
    console.log('\n📊 Listing existing collections...');
    try {
      const collections = await pb.collections.getFullList();
      console.log('Existing collections:', collections.map(c => c.name));
    } catch (error) {
      console.log('❌ Cannot list collections (need admin auth):', error.message);
    }
    
    // Test the users collection that should exist
    console.log('\n👥 Testing users collection...');
    try {
      const users = await pb.collection('users').getList(1, 10);
      console.log('✅ Users collection exists, found', users.totalItems, 'users');
    } catch (error) {
      console.log('❌ Users collection test failed:', error.message);
    }
    
    // Test training_sessions collection
    console.log('\n🏃 Testing training_sessions collection...');
    try {
      const sessions = await pb.collection('training_sessions').getList(1, 10);
      console.log('✅ Training sessions collection exists, found', sessions.totalItems, 'sessions');
    } catch (error) {
      console.log('❌ Training sessions collection missing:', error.message);
      console.log('   → Create this collection in admin interface');
    }
    
    // Test training_goals collection
    console.log('\n🎯 Testing training_goals collection...');
    try {
      const goals = await pb.collection('training_goals').getList(1, 10);
      console.log('✅ Training goals collection exists, found', goals.totalItems, 'goals');
    } catch (error) {
      console.log('❌ Training goals collection missing:', error.message);
      console.log('   → Create this collection in admin interface');
    }
    
    // Test analytics_events collection
    console.log('\n📈 Testing analytics_events collection...');
    try {
      const events = await pb.collection('analytics_events').getList(1, 10);
      console.log('✅ Analytics events collection exists, found', events.totalItems, 'events');
    } catch (error) {
      console.log('❌ Analytics events collection missing:', error.message);
      console.log('   → Create this collection in admin interface');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📝 NEXT STEPS:');
    console.log('1. Go to http://127.0.0.1:8090/_/');
    console.log('2. Click "Collections" in the sidebar');
    console.log('3. Create any missing collections shown above');
    console.log('4. Use the field specifications from the setup guide');
    console.log('5. Refresh your React app to see the changes!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Make sure PocketBase server is running');
    console.log('- Check if the server is accessible at http://127.0.0.1:8090');
    console.log('- Verify the admin interface works at http://127.0.0.1:8090/_/');
  }
}

testConnection();