#!/usr/bin/env node

// Auto-create PocketBase collections script
// This script will create the required collections for the FlagFit Pro app

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function createCollections() {
  try {
    console.log('🚀 Creating PocketBase collections for FlagFit Pro...\n');

    // Note: You need to create these manually in the admin interface at http://127.0.0.1:8090/_/
    // This script shows what needs to be created

    const collections = [
      {
        name: 'training_sessions',
        type: 'base',
        schema: [
          { name: 'user_id', type: 'relation', required: true, options: { collectionId: '_pb_users_auth_' }},
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'text', required: false },
          { name: 'session_type', type: 'select', required: true, options: { values: ['strength', 'agility', 'endurance', 'skills'] }},
          { name: 'duration', type: 'number', required: false },
          { name: 'date', type: 'date', required: true },
          { name: 'exercises', type: 'json', required: false },
          { name: 'completed', type: 'bool', required: false, options: { default: false }}
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != "" && @request.data.user_id = @request.auth.id',
        updateRule: '@request.auth.id != "" && user_id = @request.auth.id',
        deleteRule: '@request.auth.id != "" && user_id = @request.auth.id'
      },
      {
        name: 'training_goals',
        type: 'base',
        schema: [
          { name: 'user_id', type: 'relation', required: true, options: { collectionId: '_pb_users_auth_' }},
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'text', required: false },
          { name: 'target_date', type: 'date', required: false },
          { name: 'completed', type: 'bool', required: true, options: { default: false }},
          { name: 'progress', type: 'number', required: false }
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""', 
        createRule: '@request.auth.id != "" && @request.data.user_id = @request.auth.id',
        updateRule: '@request.auth.id != "" && user_id = @request.auth.id',
        deleteRule: '@request.auth.id != "" && user_id = @request.auth.id'
      },
      {
        name: 'analytics_events',
        type: 'base',
        schema: [
          { name: 'user_id', type: 'relation', required: true, options: { collectionId: '_pb_users_auth_' }},
          { name: 'event_type', type: 'text', required: true },
          { name: 'event_data', type: 'json', required: false },
          { name: 'timestamp', type: 'date', required: true },
          { name: 'session_id', type: 'text', required: false }
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != "" && @request.data.user_id = @request.auth.id',
        updateRule: '@request.auth.id != "" && user_id = @request.auth.id',
        deleteRule: '@request.auth.id != "" && user_id = @request.auth.id'
      }
    ];

    console.log('📋 Collections to create:');
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name} (${collection.schema.length} fields)`);
    });

    console.log('\n🔧 Manual Creation Required:');
    console.log('Unfortunately, PocketBase collections must be created through the admin interface.');
    console.log('Please visit: http://127.0.0.1:8090/_/');
    console.log('\n📝 Steps:');
    console.log('1. Click "New collection" or "Collections" > "New"');
    console.log('2. Create each collection above with the specified fields');
    console.log('3. Set the API rules for proper permissions');
    console.log('\n✅ Once created, your app will use real data instead of empty arrays!');

    // Test if collections already exist
    console.log('\n🔍 Testing existing collections...');
    for (const collection of collections) {
      try {
        await pb.collection(collection.name).getList(1, 1);
        console.log(`✅ ${collection.name} - EXISTS and accessible`);
      } catch (error) {
        if (error.message.includes('The requested resource wasn\'t found')) {
          console.log(`❌ ${collection.name} - NOT FOUND (needs to be created)`);
        } else if (error.message.includes('Forbidden')) {
          console.log(`⚠️  ${collection.name} - EXISTS but no permissions set`);
        } else {
          console.log(`❓ ${collection.name} - ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createCollections();