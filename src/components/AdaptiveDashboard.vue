<template>
  <div class="adaptive-dashboard">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <div class="text-center max-w-md mx-auto p-6">
        <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">⚠️</span>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="loadDashboard"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="dashboard-content">
      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">{{ welcomeMessage }}</h1>
            <p class="text-blue-100 mt-1">{{ currentDate }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-blue-100">Role</div>
            <div class="text-lg font-semibold">{{ userRole }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div 
          v-for="stat in quickStats" 
          :key="stat.label"
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-xl">{{ stat.icon }}</span>
            </div>
          </div>
          <div v-if="stat.trend" class="mt-2">
            <span 
              class="text-sm font-medium"
              :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
            <span class="text-sm text-gray-500 ml-1">vs last week</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Today's Session -->
          <div v-if="todaySession" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Today's Session</h2>
              <span class="text-sm text-gray-500">{{ todaySession.session_type }}</span>
            </div>
            
            <div class="flex items-center space-x-4 mb-4">
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">{{ todaySession.name }}</h3>
                <p class="text-sm text-gray-600">{{ todaySession.description }}</p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-blue-600">{{ todaySession.duration }}min</div>
                <div class="text-sm text-gray-500">Duration</div>
              </div>
            </div>
            
            <div class="flex space-x-3">
              <button 
                @click="startTodaySession"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                :disabled="startingSession"
              >
                {{ startingSession ? 'Starting...' : 'Start Session' }}
              </button>
              <button 
                @click="viewSessionDetails"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div v-if="recentActivity.length" class="space-y-4">
              <div 
                v-for="activity in recentActivity" 
                :key="activity.id"
                class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <span class="text-lg">{{ activity.icon }}</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-sm text-gray-600">{{ activity.description }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">{{ activity.time }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <div class="text-4xl mb-2">📊</div>
              <p>No recent activity</p>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div class="space-y-3">
              <button 
                v-for="action in quickActions" 
                :key="action.label"
                @click="action.handler"
                class="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <span class="text-sm">{{ action.icon }}</span>
                </div>
                <span class="font-medium text-gray-900">{{ action.label }}</span>
              </button>
            </div>
          </div>

          <!-- Progress Summary -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Progress Summary</h2>
            <div v-if="progressSummary" class="space-y-4">
              <div 
                v-for="metric in progressSummary" 
                :key="metric.label"
                class="flex items-center justify-between"
              >
                <span class="text-sm text-gray-600">{{ metric.label }}</span>
                <div class="flex items-center space-x-2">
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${metric.value}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ metric.value }}%</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              <p>No progress data available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useTraining } from '@/composables/useTraining.js'
import { useAnalytics } from '@/composables/useAnalytics.js'
import DashboardStrategyFactory from '@/strategies/dashboard.strategy.js'

const router = useRouter()
const authStore = useAuthStore()
const { startSession } = useTraining()
const { loadProgressAnalysis } = useAnalytics()

// Reactive state
const loading = ref(true)
const error = ref(null)
const dashboardData = ref(null)
const startingSession = ref(false)

// Computed properties
const userRole = computed(() => authStore.user?.role || 'athlete')
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const welcomeMessage = computed(() => {
  const name = authStore.user?.first_name || 'User'
  const role = userRole.value
  return `Welcome back, ${name}!`
})

const todaySession = computed(() => dashboardData.value?.todaySession)
const recentActivity = computed(() => dashboardData.value?.recentActivity || [])
const quickStats = computed(() => dashboardData.value?.quickStats || [])
const progressSummary = computed(() => dashboardData.value?.progressSummary || [])
const quickActions = computed(() => dashboardData.value?.quickActions || [])

// Methods
const loadDashboard = async () => {
  if (!authStore.user?.id) return
  
  loading.value = true
  error.value = null
  
  try {
    // Use strategy pattern to load dashboard data
    const strategy = DashboardStrategyFactory.getStrategy(userRole.value)
    const data = await strategy.loadData(authStore.user.id)
    
    dashboardData.value = data
  } catch (err) {
    console.error('Error loading dashboard:', err)
    error.value = 'Failed to load dashboard data. Please try again.'
  } finally {
    loading.value = false
  }
}

const startTodaySession = async () => {
  if (!todaySession.value || !authStore.user?.id) return
  
  startingSession.value = true
  try {
    const result = await startSession(todaySession.value, authStore.user.id)
    if (result.success) {
      router.push('/training/session')
    }
  } catch (err) {
    console.error('Error starting session:', err)
  } finally {
    startingSession.value = false
  }
}

const viewSessionDetails = () => {
  if (todaySession.value) {
    router.push(`/training/session/${todaySession.value.id}`)
  }
}

// Initialize dashboard
onMounted(loadDashboard)
</script>

<style scoped>
.adaptive-dashboard {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 1.5rem;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .adaptive-dashboard {
    padding: 1rem;
  }
}
</style> 