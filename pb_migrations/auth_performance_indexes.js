// Migration: Add composite indexes for auth performance optimization
// Based on the performance analysis recommendations

migrate((db) => {
  // Add composite index on (email, verified) for faster auth queries
  // PocketBase queries by email and verified=1 during authentication
  try {
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email_verified 
      ON _pb_users_auth_ (email, verified);
    `);
    
    console.log('✅ Created composite index on (email, verified)');
  } catch (error) {
    console.warn('⚠️ Could not create email+verified index:', error.message);
  }

  // Add index on email alone for faster lookups
  try {
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email 
      ON _pb_users_auth_ (email);
    `);
    
    console.log('✅ Created index on email');
  } catch (error) {
    console.warn('⚠️ Could not create email index:', error.message);
  }

  // Add index on verified status for admin queries
  try {
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_verified 
      ON _pb_users_auth_ (verified);
    `);
    
    console.log('✅ Created index on verified');
  } catch (error) {
    console.warn('⚠️ Could not create verified index:', error.message);
  }

  // Add index on created date for user analytics
  try {
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_created 
      ON _pb_users_auth_ (created);
    `);
    
    console.log('✅ Created index on created');
  } catch (error) {
    console.warn('⚠️ Could not create created index:', error.message);
  }

  // Add composite index on (verified, created) for admin dashboards
  try {
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_verified_created 
      ON _pb_users_auth_ (verified, created);
    `);
    
    console.log('✅ Created composite index on (verified, created)');
  } catch (error) {
    console.warn('⚠️ Could not create verified+created index:', error.message);
  }

  // Optimize training_sessions table if it exists
  try {
    // Check if training_sessions table exists
    const result = db.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='training_sessions';
    `);
    
    if (result.length > 0) {
      // Add index on user_id for faster user-specific queries
      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_training_sessions_user 
        ON training_sessions (user_id);
      `);
      
      // Add composite index on (user_id, created) for chronological queries
      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_training_sessions_user_created 
        ON training_sessions (user_id, created);
      `);
      
      console.log('✅ Created training_sessions performance indexes');
    }
  } catch (error) {
    console.warn('⚠️ Could not create training_sessions indexes:', error.message);
  }

  // Optimize training_goals table if it exists
  try {
    const result = db.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='training_goals';
    `);
    
    if (result.length > 0) {
      // Add index on user_id
      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_training_goals_user 
        ON training_goals (user_id);
      `);
      
      // Add composite index on (user_id, status) for filtering
      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_training_goals_user_status 
        ON training_goals (user_id, status);
      `);
      
      console.log('✅ Created training_goals performance indexes');
    }
  } catch (error) {
    console.warn('⚠️ Could not create training_goals indexes:', error.message);
  }

  // Optimize analytics_events table if it exists
  try {
    const result = db.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='analytics_events';
    `);
    
    if (result.length > 0) {
      // Add index on user_id for user-specific analytics
      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_analytics_events_user 
        ON analytics_events (user_id);
      `);
      
      // Add index on event_type for filtering by event type
      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_analytics_events_type 
        ON analytics_events (event_type);
      `);
      
      // Add composite index on (user_id, created) for time-series queries
      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created 
        ON analytics_events (user_id, created);
      `);
      
      console.log('✅ Created analytics_events performance indexes');
    }
  } catch (error) {
    console.warn('⚠️ Could not create analytics_events indexes:', error.message);
  }

  console.log('🎉 Auth performance optimization migration completed');

}, (db) => {
  // Rollback: Drop the created indexes
  const indexesToDrop = [
    'idx_users_email_verified',
    'idx_users_email', 
    'idx_users_verified',
    'idx_users_created',
    'idx_users_verified_created',
    'idx_training_sessions_user',
    'idx_training_sessions_user_created',
    'idx_training_goals_user',
    'idx_training_goals_user_status',
    'idx_analytics_events_user',
    'idx_analytics_events_type',
    'idx_analytics_events_user_created'
  ];

  indexesToDrop.forEach(indexName => {
    try {
      db.exec(`DROP INDEX IF EXISTS ${indexName};`);
      console.log(`✅ Dropped index: ${indexName}`);
    } catch (error) {
      console.warn(`⚠️ Could not drop index ${indexName}:`, error.message);
    }
  });

  console.log('🔄 Auth performance indexes rollback completed');
});