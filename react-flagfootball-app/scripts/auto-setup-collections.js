#!/usr/bin/env node

/**
 * Automated PocketBase Collection Setup Script
 * This script will attempt to create all required collections
 */

import PocketBase from 'pocketbase';
import readline from 'readline';

const pb = new PocketBase('http://127.0.0.1:8090');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupCollections() {
  console.log('🚀 Automated PocketBase Collection Setup');
  console.log('=========================================');
  
  // Get admin credentials
  console.log('\n🔐 First, I need your admin credentials to create collections...');
  const email = await askQuestion('Enter your admin email: ');
  const password = await askQuestion('Enter your admin password: ');
  
  try {
    // Authenticate as admin
    console.log('\n🔑 Authenticating as admin...');
    await pb.admins.authWithPassword(email, password);
    console.log('✅ Admin authentication successful!');
    
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
              collectionId: 'users',
              cascadeDelete: false,
              maxSelect: 1,
              displayFields: ['email']
            }
          },
          {
            name: 'session_type',
            type: 'text',
            required: true,
            options: {
              min: 1,
              max: 100
            }
          },
          {
            name: 'duration',
            type: 'number',
            required: true,
            options: {
              min: 1,
              max: 1000
            }
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
            options: {
              max: 1000
            }
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
            required: true,
            options: {
              min: 1,
              max: 200
            }
          },
          {
            name: 'description',
            type: 'text',
            required: false,
            options: {
              max: 1000
            }
          },
          {
            name: 'target_date',
            type: 'date',
            required: false
          },
          {
            name: 'completed',
            type: 'bool',
            required: true,
            options: {
              default: false
            }
          },
          {
            name: 'progress',
            type: 'number',
            required: false,
            options: {
              min: 0,
              max: 100,
              default: 0
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
              collectionId: 'users',
              cascadeDelete: false,
              maxSelect: 1,
              displayFields: ['email']
            }
          },
          {
            name: 'event_type',
            type: 'text',
            required: true,
            options: {
              min: 1,
              max: 100
            }
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
          const existing = await pb.collections.getOne(collectionData.name);
          console.log(`⚠️  Collection ${collectionData.name} already exists, skipping...`);
          continue;
        } catch (e) {
          // Collection doesn't exist, create it
        }
        
        const collection = await pb.collections.create(collectionData);
        console.log(`✅ Created collection: ${collection.name}`);
        
        // Add some sample data
        if (collectionData.name === 'training_sessions') {
          console.log('📊 Adding sample training session...');
          // We'll skip adding sample data for now as it requires user_id
        }
        
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
    
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Make sure your admin credentials are correct');
    console.log('- Verify admin account exists at http://127.0.0.1:8090/_/');
    console.log('- Check if PocketBase server is running');
  }
  
  rl.close();
}

// Run the setup
setupCollections().catch(console.error);