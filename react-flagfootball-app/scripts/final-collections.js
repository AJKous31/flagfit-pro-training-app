#!/usr/bin/env node

/**
 * Final Collection Creation Script
 * Fixed JSON field maxSize requirements
 */

import fetch from 'node-fetch';

const POCKETBASE_URL = 'http://127.0.0.1:8090';

async function createRemainingCollections() {
  console.log('🚀 Creating Remaining Collections');
  console.log('=================================');
  
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
    
    const authData = await authResponse.json();
    const token = authData.token;
    console.log('✅ Admin authentication successful!');
    
    // Get users collection ID
    const listResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const collectionsData = await listResponse.json();
    const usersCollection = collectionsData.items.find(c => c.name === 'users' || c.type === 'auth');
    
    // Define the remaining collections with proper JSON field options
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
            required: false,
            options: {
              maxSize: 50000
            }
          },
          {
            name: 'notes',
            type: 'text',
            required: false,
            options: {
              max: 1000
            }
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
            required: false,
            options: {
              maxSize: 10000
            }
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
    console.log('\n📁 Creating remaining collections...');
    
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
      
      const allCollectionsExist = ['users', 'training_sessions', 'training_goals', 'analytics_events']
        .every(name => collectionNames.includes(name));
      
      if (allCollectionsExist) {
        console.log('\n🎉 SUCCESS! All collections are now ready!');
        console.log('📱 Your React app should work without errors now');
        console.log('🔄 Refresh your React app at http://localhost:3000');
        console.log('🔧 Admin interface: http://127.0.0.1:8090/_/');
        console.log('');
        console.log('🧪 Test the connection with:');
        console.log('   node scripts/test-pocketbase.js');
      } else {
        console.log('\n⚠️  Some collections are still missing. You may need to create them manually.');
      }
      
    } else {
      console.error('❌ Failed to verify collections');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

createRemainingCollections();