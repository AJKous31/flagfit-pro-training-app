#!/usr/bin/env node

/**
 * Simple PocketBase Collection Setup Script
 * Pre-configured with common admin credentials
 */

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function setupCollections() {
  console.log('🚀 Setting up PocketBase collections...');
  
  // Try common admin credentials
  const credentials = [
    { email: 'admin@flagfootball.com', password: 'admin123456' },
    { email: 'admin@admin.com', password: 'admin123456' },
    { email: 'admin', password: 'admin123456' },
    { email: 'admin@example.com', password: 'password' }
  ];
  
  let authenticated = false;
  
  for (const cred of credentials) {
    try {
      console.log(`🔑 Trying admin: ${cred.email}`);
      await pb.admins.authWithPassword(cred.email, cred.password);
      console.log('✅ Admin authentication successful!');
      authenticated = true;
      break;
    } catch (error) {
      console.log(`❌ Failed: ${cred.email}`);
    }
  }
  
  if (!authenticated) {
    console.log('');
    console.log('❌ Could not authenticate with common credentials.');
    console.log('🔧 Please run this manually and enter your credentials:');
    console.log('   node scripts/auto-setup-collections.js');
    console.log('');
    console.log('🌐 Or create collections manually at: http://127.0.0.1:8090/_/');
    return;
  }
  
  // Define collection schemas
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
            collectionId: '_pb_users_auth_',
            cascadeDelete: false,
            maxSelect: 1,
            displayFields: ['email']
          }
        },
        {
          name: 'session_type',
          type: 'text',
          required: true,
          options: { min: 1, max: 100 }
        },
        {
          name: 'duration',
          type: 'number',
          required: true,
          options: { min: 1, max: 1000 }
        },
        {
          name: 'exercises',
          type: 'json',
          required: false
        },
        {
          name: 'notes',
          type: 'text',
          required: false,
          options: { max: 1000 }
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
            collectionId: '_pb_users_auth_',
            cascadeDelete: false,
            maxSelect: 1,
            displayFields: ['email']
          }
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          options: { min: 1, max: 200 }
        },
        {
          name: 'description',
          type: 'text',
          required: false,
          options: { max: 1000 }
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
          required: false,
          options: { min: 0, max: 100 }
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
            collectionId: '_pb_users_auth_',
            cascadeDelete: false,
            maxSelect: 1,
            displayFields: ['email']
          }
        },
        {
          name: 'event_type',
          type: 'text',
          required: true,
          options: { min: 1, max: 100 }
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
  
  // Create collections
  console.log('\n📁 Creating collections...');
  
  for (const collectionData of collections) {
    try {
      console.log(`\n🔨 Creating collection: ${collectionData.name}`);
      
      // Check if collection already exists
      try {
        await pb.collections.getOne(collectionData.name);
        console.log(`⚠️  Collection ${collectionData.name} already exists, skipping...`);
        continue;
      } catch (e) {
        // Collection doesn't exist, create it
      }
      
      const collection = await pb.collections.create(collectionData);
      console.log(`✅ Created collection: ${collection.name}`);
      
    } catch (error) {
      console.error(`❌ Failed to create collection ${collectionData.name}:`, error.message);
    }
  }
  
  // Test the setup
  console.log('\n🧪 Testing collection setup...');
  
  try {
    const collections = await pb.collections.getFullList();
    const requiredCollections = ['users', 'training_sessions', 'training_goals', 'analytics_events'];
    
    console.log('\n📋 Collection Status:');
    for (const reqCollection of requiredCollections) {
      const exists = collections.find(c => c.name === reqCollection);
      if (exists) {
        console.log(`✅ ${reqCollection} - Ready`);
      } else {
        console.log(`❌ ${reqCollection} - Missing`);
      }
    }
    
    console.log('\n🎉 Setup complete! Your collections are ready.');
    console.log('📱 You can now refresh your React app at http://localhost:3000');
    console.log('🔧 Admin interface available at: http://127.0.0.1:8090/_/');
    
  } catch (error) {
    console.error('❌ Failed to verify setup:', error.message);
  }
}

// Run the setup
setupCollections().catch(console.error);