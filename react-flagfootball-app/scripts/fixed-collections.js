#!/usr/bin/env node

/**
 * Fixed Collection Creation Script
 * First find the correct users collection ID, then create collections
 */

import fetch from 'node-fetch';

const POCKETBASE_URL = 'http://127.0.0.1:8090';

async function createCollections() {
  console.log('🚀 Fixed PocketBase Collection Setup');
  console.log('====================================');
  
  try {
    // Get admin token
    console.log('🔑 Getting admin authentication token...');
    
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
      throw new Error(`Auth failed: ${authResponse.status}`);
    }
    
    const authData = await authResponse.json();
    const token = authData.token;
    console.log('✅ Admin authentication successful!');
    
    // Find the users collection ID
    console.log('\n🔍 Finding users collection...');
    const listResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const collectionsData = await listResponse.json();
    const usersCollection = collectionsData.items.find(c => c.name === 'users' || c.type === 'auth');
    
    if (!usersCollection) {
      throw new Error('Users collection not found');
    }
    
    console.log(`✅ Found users collection: ${usersCollection.id} (${usersCollection.name})`);
    
    // Define collections with correct users collection ID
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
              collectionId: usersCollection.id,
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
              collectionId: usersCollection.id,
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
              collectionId: usersCollection.id,
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
          const result = await createResponse.json();
          console.log(`✅ Created collection: ${result.name} (ID: ${result.id})`);
        } else {
          const errorText = await createResponse.text();
          if (errorText.includes('already exists') || errorText.includes('name must be unique')) {
            console.log(`⚠️  Collection ${collection.name} already exists, skipping...`);
          } else {
            console.error(`❌ Failed to create ${collection.name}:`, errorText);
          }
        }
        
      } catch (error) {
        console.error(`❌ Error creating ${collection.name}:`, error.message);
      }
    }
    
    // Final verification
    console.log('\n🧪 Final verification...');
    
    const finalListResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (finalListResponse.ok) {
      const finalCollectionsData = await finalListResponse.json();
      const collectionNames = finalCollectionsData.items.map(c => c.name);
      
      console.log('\n📋 Final Collection Status:');
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
      console.log('');
      console.log('🧪 Test your collections with:');
      console.log('   node scripts/test-pocketbase.js');
      
    } else {
      console.error('❌ Failed to verify collections');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

createCollections();