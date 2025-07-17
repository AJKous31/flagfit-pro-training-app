// Test Features for FlagFit Pro
// This file contains test functions to verify various features

// Environment variables to check
const requiredEnvVars = [
  'VITE_POCKETBASE_URL'
]

// Check if environment variables are properly set
function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...')
  
  requiredEnvVars.forEach(varName => {
    const value = import.meta.env[varName]
    if (value && value !== 'http://127.0.0.1:8090') {
      console.log(`✅ ${varName}: ${value}`)
    } else {
      console.warn(`⚠️  ${varName}: Not set or using default value`)
    }
  })
}

// Test PocketBase connection
async function testPocketBaseConnection() {
  console.log('🔍 Testing PocketBase connection...')
  
  try {
    const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/api/health`)
    if (response.ok) {
      console.log('✅ PocketBase connection successful')
    } else {
      console.error('❌ PocketBase connection failed')
    }
  } catch (error) {
    console.error('❌ PocketBase connection error:', error.message)
  }
}

// Test authentication
async function testAuthentication() {
  console.log('🔍 Testing authentication...')
  
  try {
    // Test with PocketBase service
    const { pocketbaseService } = await import('./src/services/pocketbase.service.js')
    
    // Test signup
    console.log('1. Run: pocketbaseService.signUp({ email: "test@example.com", password: "password123", name: "Test User" })')
    
    // Test signin
    console.log('2. Run: pocketbaseService.signIn("test@example.com", "password123")')
    
    // Test get current user
    console.log('3. Run: pocketbaseService.getCurrentUser()')
    
    console.log('✅ Authentication tests ready')
  } catch (error) {
    console.error('❌ Authentication test setup failed:', error.message)
  }
}

// Test database operations
async function testDatabaseOperations() {
  console.log('🔍 Testing database operations...')
  
  try {
    const { pocketbaseService } = await import('./src/services/pocketbase.service.js')
    
    console.log('1. Run: pocketbaseService.create("training_sessions", { title: "Test Session", duration: 60 })')
    console.log('2. Run: pocketbaseService.getList("training_sessions")')
    console.log('3. Run: pocketbaseService.update("session_id", { title: "Updated Session" })')
    console.log('4. Run: pocketbaseService.delete("training_sessions", "session_id")')
    
    console.log('✅ Database operation tests ready')
  } catch (error) {
    console.error('❌ Database operation test setup failed:', error.message)
  }
}

// Test real-time features
async function testRealTimeFeatures() {
  console.log('🔍 Testing real-time features...')
  
  try {
    const { pocketbaseService } = await import('./src/services/pocketbase.service.js')
    
    console.log('1. Run: pocketbaseService.subscribe("training_sessions", (data) => console.log("Real-time update:", data))')
    console.log('2. Check database connection in PocketBase admin panel')
    
    console.log('✅ Real-time feature tests ready')
  } catch (error) {
    console.error('❌ Real-time feature test setup failed:', error.message)
  }
}

// Test file upload
async function testFileUpload() {
  console.log('🔍 Testing file upload...')
  
  try {
    const { pocketbaseService } = await import('./src/services/pocketbase.service.js')
    
    console.log('1. Create a test file: const file = new File(["test content"], "test.txt", { type: "text/plain" })')
    console.log('2. Run: pocketbaseService.uploadFile(file)')
    
    console.log('✅ File upload tests ready')
  } catch (error) {
    console.error('❌ File upload test setup failed:', error.message)
  }
}

// Test caching
async function testCaching() {
  console.log('�� Testing caching...')
  
  try {
    const cacheService = await import('./src/services/cache.service.js')
    
    console.log('1. Run: cacheService.set("test-key", "test-value", 60000)')
    console.log('2. Run: cacheService.get("test-key")')
    console.log('3. Run: cacheService.invalidate("test-key")')
    
    console.log('✅ Caching tests ready')
  } catch (error) {
    console.error('❌ Caching test setup failed:', error.message)
  }
}

// Test service container
async function testServiceContainer() {
  console.log('🔍 Testing service container...')
  
  try {
    const { container } = await import('./src/services/container.js')
    
    console.log('1. Run: container.resolve("pocketbase")')
    console.log('2. Run: container.resolve("config")')
    console.log('3. Run: container.getServiceNames()')
    
    console.log('✅ Service container tests ready')
  } catch (error) {
    console.error('❌ Service container test setup failed:', error.message)
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting FlagFit Pro feature tests...\n')
  
  checkEnvironmentVariables()
  console.log('')
  
  await testPocketBaseConnection()
  console.log('')
  
  testAuthentication()
  console.log('')
  
  testDatabaseOperations()
  console.log('')
  
  testRealTimeFeatures()
  console.log('')
  
  testFileUpload()
  console.log('')
  
  testCaching()
  console.log('')
  
  testServiceContainer()
  console.log('')
  
  console.log('🎉 All tests are ready to run!')
  console.log('💡 Use the console commands above to test each feature.')
}

// Export test functions
export {
  checkEnvironmentVariables,
  testPocketBaseConnection,
  testAuthentication,
  testDatabaseOperations,
  testRealTimeFeatures,
  testFileUpload,
  testCaching,
  testServiceContainer,
  runAllTests
}

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined') {
  window.runAllTests = runAllTests
  console.log('🧪 Test functions loaded. Run window.runAllTests() to start testing.')
} 