import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function setupCollections() {
  try {
    // Create users collection
    const usersCollection = {
      name: 'users',
      type: 'auth',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          options: {
            values: ['player', 'coach', 'admin']
          }
        },
        {
          name: 'firstName',
          type: 'text',
          required: false
        },
        {
          name: 'lastName',
          type: 'text',
          required: false
        }
      ]
    };

    // Create training_sessions collection
    const trainingSessionsCollection = {
      name: 'training_sessions',
      type: 'base',
      schema: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          options: {
            collectionId: 'users'
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
    };

    // Create training_goals collection
    const trainingGoalsCollection = {
      name: 'training_goals',
      type: 'base',
      schema: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          options: {
            collectionId: 'users'
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
    };

    // Create analytics_events collection
    const analyticsEventsCollection = {
      name: 'analytics_events',
      type: 'base',
      schema: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          options: {
            collectionId: 'users'
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
    };

    console.log('Setting up PocketBase collections...');
    
    // Note: These would normally be created through the admin interface
    // For now, we'll just log what needs to be created
    console.log('Required collections:');
    console.log('1. users (auth type)');
    console.log('2. training_sessions');
    console.log('3. training_goals');
    console.log('4. analytics_events');
    
    console.log('\nPlease visit http://127.0.0.1:8090/_/ to create these collections manually.');
    
  } catch (error) {
    console.error('Error setting up collections:', error);
  }
}

setupCollections();