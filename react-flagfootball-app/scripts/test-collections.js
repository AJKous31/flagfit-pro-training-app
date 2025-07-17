#!/usr/bin/env node

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function testCollections() {
  console.log('🔍 Testing PocketBase collections...\n');

  const requiredCollections = ['training_sessions', 'training_goals', 'analytics_events'];

  for (const collectionName of requiredCollections) {
    try {
      const result = await pb.collection(collectionName).getList(1, 1);
      console.log(`✅ ${collectionName} - EXISTS (${result.totalItems} items)`);
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log(`❌ ${collectionName} - DOES NOT EXIST`);
      } else if (error.message.includes('Forbidden')) {
        console.log(`⚠️  ${collectionName} - EXISTS but no permissions`);
      } else {
        console.log(`❓ ${collectionName} - Error: ${error.message}`);
      }
    }
  }

  console.log('\n📋 If any collection shows "DOES NOT EXIST", create it at:');
  console.log('👉 http://127.0.0.1:8090/_/');
}

testCollections();