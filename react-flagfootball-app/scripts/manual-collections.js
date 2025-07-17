#!/usr/bin/env node

/**
 * Manual Collection Creation via HTTP requests
 * Since admin auth might be having issues, let's try direct HTTP calls
 */

import fetch from 'node-fetch';

const POCKETBASE_URL = 'http://127.0.0.1:8090';

async function createCollections() {
  console.log('🚀 Manual PocketBase Collection Setup');
  console.log('=====================================');
  
  // First, let's try to get an admin token
  console.log('🔑 Getting admin authentication token...');
  
  try {
    const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identity: 'aljosa@ljubljanafrogs.si',
        password: 'Futsal12!!!'
      })
    });
    
    if (!authResponse.ok) {
      throw new Error(`Auth failed: ${authResponse.status} ${authResponse.statusText}`);
    }
    
    const authData = await authResponse.json();
    const token = authData.token;
    
    console.log('✅ Admin authentication successful!');
    
    // Define collections
    const collections = [
      {
        name: 'training_sessions',
        type: 'base',
        schema: [
          {
            name: 'user_id',
            type: 'relation',
            required: true,
            options: {
              collectionId: 'users',
              cascadeDelete: false,
              maxSelect: 1,
              displayFields: ['email']
            }
          },
          {
            name: 'session_type',
            type: 'text',
            required: true
          },
          {
            name: 'duration',
            type: 'number',
            required: true
          },
          {
            name: 'exercises',
            type: 'json',
            required: false
          },
          {
            name: 'notes',
            type: 'text',
            required: false
          }
        ]
      },
      {
        name: 'training_goals',
        type: 'base',
        schema: [
          {
            name: 'user_id',
            type: 'relation',
            required: true,
            options: {
              collectionId: 'users',
              cascadeDelete: false,
              maxSelect: 1,
              displayFields: ['email']
            }
          },
          {
            name: 'title',
            type: 'text',
            required: true
          },
          {
            name: 'description',
            type: 'text',
            required: false
          },
          {
            name: 'target_date',
            type: 'date',
            required: false
          },
          {
            name: 'completed',
            type: 'bool',
            required: true
          },
          {
            name: 'progress',
            type: 'number',
            required: false
          }
        ]
      },
      {
        name: 'analytics_events',
        type: 'base',
        schema: [
          {
            name: 'user_id',
            type: 'relation',
            required: true,
            options: {
              collectionId: 'users',
              cascadeDelete: false,
              maxSelect: 1,
              displayFields: ['email']
            }
          },
          {
            name: 'event_type',
            type: 'text',
            required: true
          },
          {
            name: 'event_data',
            type: 'json',
            required: false
          },
          {
            name: 'timestamp',
            type: 'date',
            required: true
          }
        ]
      }
    ];
    
    // Create each collection
    console.log('\n📁 Creating collections...');
    
    for (const collection of collections) {
      try {
        console.log(`\n🔨 Creating collection: ${collection.name}`);
        
        const createResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(collection)
        });
        
        if (createResponse.ok) {
          console.log(`✅ Created collection: ${collection.name}`);
        } else {
          const errorText = await createResponse.text();
          if (errorText.includes('already exists')) {
            console.log(`⚠️  Collection ${collection.name} already exists, skipping...`);
          } else {
            console.error(`❌ Failed to create ${collection.name}: ${errorText}`);
          }
        }
        
      } catch (error) {
        console.error(`❌ Error creating ${collection.name}:`, error.message);
      }
    }
    
    // Verify collections
    console.log('\n🧪 Verifying collections...');
    
    const listResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (listResponse.ok) {
      const collectionsData = await listResponse.json();
      const collectionNames = collectionsData.items.map(c => c.name);
      
      console.log('\n📋 Available Collections:');
      ['users', 'training_sessions', 'training_goals', 'analytics_events'].forEach(name => {
        if (collectionNames.includes(name)) {
          console.log(`✅ ${name} - Ready`);
        } else {
          console.log(`❌ ${name} - Missing`);
        }
      });
      
      console.log('\n🎉 Setup complete!');
      console.log('📱 You can now refresh your React app at http://localhost:3000');
      console.log('🔧 Admin interface: http://127.0.0.1:8090/_/');
      
    } else {
      console.error('❌ Failed to verify collections');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Alternative: Create collections manually');
    console.log('1. Go to http://127.0.0.1:8090/_/');
    console.log('2. Login with your admin credentials');
    console.log('3. Click Collections → New Collection');
    console.log('4. Create: training_sessions, training_goals, analytics_events');
  }
}

createCollections();