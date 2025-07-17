<template>
  <div id="app">
    <!-- Loading Screen -->
    <div v-if="loading" class="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div class="text-center">
        <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl font-bold">🏈</span>
        </div>
        <h1 class="text-2xl font-display font-bold text-gray-900 mb-2">FlagFit Pro</h1>
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>

    <!-- Error Screen -->
    <div v-else-if="error" class="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div class="text-center max-w-md mx-auto p-6">
        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">⚠️</span>
        </div>
        <h1 class="text-2xl font-display font-bold text-gray-900 mb-2">Initialization Error</h1>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="retryInitialization"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Main App -->
    <div v-else>
      <!-- Navigation Header (for authenticated users) -->
      <header v-if="authStore.isAuthenticated" class="bg-white border-b border-gray-200 px-4 py-3">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">🏈</span>
            </div>
            <h1 class="text-xl font-display font-bold text-gray-900">FlagFit Pro</h1>
          </div>
          
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">
              Welcome, {{ authStore.user?.first_name || 'User' }}
            </span>
            <button
              @click="handleLogout"
              class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <!-- Router View -->
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/index.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(true)
const error = ref(null)

// Handle logout using auth service
async function handleLogout() {
  try {
    await authService.logout()
    authStore.clearUser()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Retry initialization
async function retryInitialization() {
  error.value = null
  loading.value = true
  await initializeApp()
}

// Initialize app with service-based authentication
async function initializeApp() {
  try {
    // Check authentication status using auth service
    const user = await authService.getCurrentUser()
    if (user) {
      authStore.setUser(user)
    }
  } catch (error) {
    console.error('Auth initialization error:', error)
    // Don't show error for auth failures, just continue without user
  } finally {
    loading.value = false
    
    // Failsafe onboarding redirect
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true'
    const onboardingRoutes = [
      'OnboardingWelcome',
      'OnboardingMetric',
      'OnboardingUserDetails',
      'OnboardingGoals',
      'OnboardingSummary'
    ]
    
    if (!onboardingComplete && !onboardingRoutes.includes(route.name)) {
      router.replace({ name: 'OnboardingWelcome' })
    }
  }
}

// Initialize app
onMounted(initializeApp)
</script> 