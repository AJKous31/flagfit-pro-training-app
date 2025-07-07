<template>
  <div class="wellness-tracker">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-xl">
      <h2 class="text-2xl font-bold">Daily Wellness Tracker</h2>
      <p class="text-green-100 mt-1">Track your daily wellness metrics to optimize performance</p>
    </div>

    <!-- Today's Log Form -->
    <div class="bg-white p-6 border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Today's Wellness Log</h3>
        <span class="text-sm text-gray-600">{{ formatDate(new Date()) }}</span>
      </div>

      <form @submit.prevent="submitWellnessLog" class="space-y-6">
        <!-- Sleep Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Sleep Hours</label>
            <input
              v-model="wellnessData.sleep_hours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="7.5"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Sleep Quality (1-10)</label>
            <div class="flex space-x-2">
              <button
                v-for="rating in 10"
                :key="rating"
                type="button"
                @click="wellnessData.sleep_quality = rating"
                class="w-8 h-8 rounded-full text-sm font-medium transition-colors"
                :class="wellnessData.sleep_quality === rating 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              >
                {{ rating }}
              </button>
            </div>
          </div>
        </div>

        <!-- Energy and Motivation -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Energy Level (1-10)</label>
            <div class="flex space-x-2">
              <button
                v-for="rating in 10"
                :key="rating"
                type="button"
                @click="wellnessData.energy_level = rating"
                class="w-8 h-8 rounded-full text-sm font-medium transition-colors"
                :class="wellnessData.energy_level === rating 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              >
                {{ rating }}
              </button>
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Motivation (1-10)</label>
            <div class="flex space-x-2">
              <button
                v-for="rating in 10"
                :key="rating"
                type="button"
                @click="wellnessData.motivation = rating"
                class="w-8 h-8 rounded-full text-sm font-medium transition-colors"
                :class="wellnessData.motivation === rating 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              >
                {{ rating }}
              </button>
            </div>
          </div>
        </div>

        <!-- Soreness and Stress -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Muscle Soreness (1-10)</label>
            <div class="flex space-x-2">
              <button
                v-for="rating in 10"
                :key="rating"
                type="button"
                @click="wellnessData.muscle_soreness = rating"
                class="w-8 h-8 rounded-full text-sm font-medium transition-colors"
                :class="wellnessData.muscle_soreness === rating 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              >
                {{ rating }}
              </button>
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Stress Level (1-10)</label>
            <div class="flex space-x-2">
              <button
                v-for="rating in 10"
                :key="rating"
                type="button"
                @click="wellnessData.stress_level = rating"
                class="w-8 h-8 rounded-full text-sm font-medium transition-colors"
                :class="wellnessData.stress_level === rating 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              >
                {{ rating }}
              </button>
            </div>
          </div>
        </div>

        <!-- Hydration and Nutrition -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Hydration (Liters)</label>
            <input
              v-model="wellnessData.hydration_liters"
              type="number"
              step="0.1"
              min="0"
              max="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2.5"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Nutrition Quality (1-10)</label>
            <div class="flex space-x-2">
              <button
                v-for="rating in 10"
                :key="rating"
                type="button"
                @click="wellnessData.nutrition_quality = rating"
                class="w-8 h-8 rounded-full text-sm font-medium transition-colors"
                :class="wellnessData.nutrition_quality === rating 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              >
                {{ rating }}
              </button>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            v-model="wellnessData.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="How are you feeling today? Any specific notes..."
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Wellness Log</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Recent Wellness History -->
    <div class="bg-white p-6 rounded-b-xl">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Wellness History</h3>
      
      <div v-if="loadingHistory" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
      
      <div v-else-if="wellnessHistory.length" class="space-y-4">
        <div 
          v-for="log in wellnessHistory.slice(0, 7)" 
          :key="log.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700">{{ formatDate(log.log_date) }}</span>
            <div class="flex space-x-2">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ log.sleep_hours }}h sleep
              </span>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {{ log.energy_level }}/10 energy
              </span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Sleep Quality:</span>
              <span class="ml-1 font-medium">{{ log.sleep_quality }}/10</span>
            </div>
            <div>
              <span class="text-gray-500">Motivation:</span>
              <span class="ml-1 font-medium">{{ log.motivation }}/10</span>
            </div>
            <div>
              <span class="text-gray-500">Soreness:</span>
              <span class="ml-1 font-medium">{{ log.muscle_soreness }}/10</span>
            </div>
            <div>
              <span class="text-gray-500">Hydration:</span>
              <span class="ml-1 font-medium">{{ log.hydration_liters }}L</span>
            </div>
          </div>
          
          <div v-if="log.notes" class="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
            {{ log.notes }}
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8 text-gray-500">
        <div class="text-4xl mb-2">📊</div>
        <p>No wellness logs yet. Start tracking your daily wellness!</p>
      </div>
    </div>

    <!-- Wellness Insights -->
    <div v-if="wellnessHistory.length" class="mt-6 bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Wellness Insights</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ averageSleepHours }}</div>
          <div class="text-sm text-gray-600">Avg Sleep Hours</div>
        </div>
        
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ averageEnergy }}</div>
          <div class="text-sm text-gray-600">Avg Energy Level</div>
        </div>
        
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ averageMotivation }}</div>
          <div class="text-sm text-gray-600">Avg Motivation</div>
        </div>
      </div>
      
      <div class="mt-6">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Trends</h4>
        <div class="space-y-2 text-sm">
          <div v-if="sleepTrend > 0" class="text-green-600">
            📈 Sleep quality improving over the last 7 days
          </div>
          <div v-if="energyTrend < 0" class="text-orange-600">
            ⚠️ Energy levels declining - consider more recovery
          </div>
          <div v-if="motivationTrend > 0" class="text-green-600">
            🎯 Motivation trending upward - great work!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'

const props = defineProps({
  athleteId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['wellness-updated'])

const loading = ref(false)
const loadingHistory = ref(false)
const wellnessHistory = ref([])

// Wellness data for today's log
const wellnessData = ref({
  sleep_hours: null,
  sleep_quality: null,
  energy_level: null,
  muscle_soreness: null,
  stress_level: null,
  motivation: null,
  hydration_liters: null,
  nutrition_quality: null,
  notes: ''
})

// Import API methods
import { submitWellnessLog, getWellnessLogs } from '@/services/api.js'

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

const loadWellnessHistory = async () => {
  loadingHistory.value = true
  try {
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    wellnessHistory.value = await getWellnessLogs(props.athleteId, startDate, endDate)
  } catch (error) {
    console.error('Error loading wellness history:', error)
  } finally {
    loadingHistory.value = false
  }
}

onMounted(() => {
  loadWellnessHistory()
})

// Computed properties for insights
const averageSleepHours = computed(() => {
  if (!wellnessHistory.value.length) return 'N/A'
  const avg = wellnessHistory.value.reduce((sum, log) => sum + (log.sleep_hours || 0), 0) / wellnessHistory.value.length
  return avg.toFixed(1)
})

const averageEnergy = computed(() => {
  if (!wellnessHistory.value.length) return 'N/A'
  const avg = wellnessHistory.value.reduce((sum, log) => sum + (log.energy_level || 0), 0) / wellnessHistory.value.length
  return avg.toFixed(1)
})

const averageMotivation = computed(() => {
  if (!wellnessHistory.value.length) return 'N/A'
  const avg = wellnessHistory.value.reduce((sum, log) => sum + (log.motivation || 0), 0) / wellnessHistory.value.length
  return avg.toFixed(1)
})

const sleepTrend = computed(() => {
  if (wellnessHistory.value.length < 2) return 0
  const recent = wellnessHistory.value.slice(0, 3)
  const older = wellnessHistory.value.slice(3, 6)
  if (older.length === 0) return 0
  
  const recentAvg = recent.reduce((sum, log) => sum + (log.sleep_quality || 0), 0) / recent.length
  const olderAvg = older.reduce((sum, log) => sum + (log.sleep_quality || 0), 0) / older.length
  
  return recentAvg - olderAvg
})

const energyTrend = computed(() => {
  if (wellnessHistory.value.length < 2) return 0
  const recent = wellnessHistory.value.slice(0, 3)
  const older = wellnessHistory.value.slice(3, 6)
  if (older.length === 0) return 0
  
  const recentAvg = recent.reduce((sum, log) => sum + (log.energy_level || 0), 0) / recent.length
  const olderAvg = older.reduce((sum, log) => sum + (log.energy_level || 0), 0) / older.length
  
  return recentAvg - olderAvg
})

const motivationTrend = computed(() => {
  if (wellnessHistory.value.length < 2) return 0
  const recent = wellnessHistory.value.slice(0, 3)
  const older = wellnessHistory.value.slice(3, 6)
  if (older.length === 0) return 0
  
  const recentAvg = recent.reduce((sum, log) => sum + (log.motivation || 0), 0) / recent.length
  const olderAvg = older.reduce((sum, log) => sum + (log.motivation || 0), 0) / older.length
  
  return recentAvg - olderAvg
})
</script> 