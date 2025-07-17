#!/usr/bin/env node

/**
 * Configure PocketBase API Rules
 * Sets up proper permissions for all collections
 */

import fetch from 'node-fetch';

const POCKETBASE_URL = 'http://127.0.0.1:8090';

async function configureAPIRules() {
  console.log('🔧 Configuring PocketBase API Rules...');
  console.log('=======================================');
  
  try {
    // Get admin token
    console.log('🔑 Authenticating as admin...');
    
    const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identity: 'aljosa@ljubljanafrogs.si',
        password: 'Futsal12!!!'
      })
    });
    
    if (!authResponse.ok) {
      throw new Error(`Auth failed: ${authResponse.status}`);
    }
    
    const authData = await authResponse.json();
    const token = authData.token;
    console.log('✅ Admin authentication successful!');
    
    // Get all collections
    console.log('\n📋 Getting collections...');
    const collectionsResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const collectionsData = await collectionsResponse.json();
    
    // Define API rules for each collection type
    const apiRules = {
      // Users collection (auth type) - more restrictive
      users: {
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != "" && (id = @request.auth.id || @request.auth.role = "admin")',
        createRule: '', // Allow public registration
        updateRule: '@request.auth.id != "" && (id = @request.auth.id || @request.auth.role = "admin")',
        deleteRule: '@request.auth.id != "" && @request.auth.role = "admin"'
      },
      
      // Data collections - allow authenticated users
      default: {
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != "" && (user_id = @request.auth.id || @request.auth.role = "admin")',
        deleteRule: '@request.auth.id != "" && (user_id = @request.auth.id || @request.auth.role = "admin")'
      }
    };
    
    // Update each collection
    console.log('\n🔧 Updating API rules for collections...');
    
    for (const collection of collectionsData.items) {
      try {
        console.log(`\n📝 Updating ${collection.name}...`);
        
        // Determine which rules to use
        const rules = collection.type === 'auth' ? apiRules.users : apiRules.default;
        
        // Update the collection with API rules
        const updateResponse = await fetch(`${POCKETBASE_URL}/api/collections/${collection.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            listRule: rules.listRule,
            viewRule: rules.viewRule,
            createRule: rules.createRule,
            updateRule: rules.updateRule,
            deleteRule: rules.deleteRule
          })
        });
        
        if (updateResponse.ok) {
          console.log(`  ✅ ${collection.name} API rules updated`);
        } else {
          const errorText = await updateResponse.text();
          console.log(`  ❌ Failed to update ${collection.name}: ${errorText}`);
        }
        
      } catch (error) {
        console.error(`  ❌ Error updating ${collection.name}:`, error.message);
      }
    }
    
    // Test the API rules
    console.log('\n🧪 Testing API access...');
    
    // Test public access to users collection (should work for registration)
    const testResponse = await fetch(`${POCKETBASE_URL}/api/collections/users/records?page=1&perPage=1`);
    
    if (testResponse.ok) {
      console.log('✅ Public API access working');
    } else {
      console.log('⚠️  Public API access restricted (this is normal)');
    }
    
    console.log('\n🎉 API Rules Configuration Complete!');
    console.log('📱 Your React app should now be able to access the backend');
    console.log('🔄 Try refreshing your app and testing registration/login');
    
  } catch (error) {
    console.error('❌ Configuration failed:', error.message);
    console.log('\n🔧 Manual Setup Required:');
    console.log('1. Go to http://127.0.0.1:8090/_/');
    console.log('2. Login with your admin credentials');
    console.log('3. For each collection (training_sessions, training_goals, analytics_events):');
    console.log('   - Click on the collection');
    console.log('   - Go to "API Rules" tab');
    console.log('   - Set List rule: @request.auth.id != ""');
    console.log('   - Set View rule: @request.auth.id != ""');
    console.log('   - Set Create rule: @request.auth.id != ""');
    console.log('   - Set Update rule: @request.auth.id != "" && (user_id = @request.auth.id || @request.auth.role = "admin")');
    console.log('   - Set Delete rule: @request.auth.id != "" && (user_id = @request.auth.id || @request.auth.role = "admin")');
  }
}

configureAPIRules();