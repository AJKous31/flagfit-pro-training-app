<template>
  <div class="daily-session-view">
    <!-- Session Header -->
    <div class="session-header bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">{{ session?.session_name }}</h2>
          <p class="text-blue-100 mt-1">{{ getDayOfWeek(session?.day_of_week) }}</p>
        </div>
        <div class="text-right">
          <div class="flex items-center space-x-4">
            <div class="text-center">
              <div class="text-3xl font-bold">{{ session?.total_duration_minutes }}</div>
              <div class="text-sm text-blue-100">Minutes</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">{{ getIntensityBadge(session?.intensity_level) }}</div>
              <div class="text-sm text-blue-100">Intensity</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Session Type Badge -->
      <div class="mt-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
          {{ getSessionTypeLabel(session?.session_type) }}
        </span>
      </div>
      
      <!-- Notes -->
      <div v-if="session?.notes" class="mt-4 p-3 bg-blue-500 bg-opacity-20 rounded-lg">
        <p class="text-blue-100 text-sm">{{ session.notes }}</p>
      </div>
    </div>

    <!-- Exercises List -->
    <div class="exercises-list bg-white rounded-b-xl shadow-lg">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Exercises</h3>
        
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        
        <div v-else-if="error" class="text-center py-8 text-red-500">
          <div class="text-4xl mb-2">⚠️</div>
          <p>{{ error }}</p>
          <button 
            @click="loadSession"
            class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
        
        <div v-else-if="session?.session_exercises?.length" class="space-y-4">
          <div 
            v-for="(exercise, index) in session.session_exercises" 
            :key="exercise.id"
            class="exercise-item border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {{ exercise.order_in_session }}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">{{ exercise.exercise?.name }}</h4>
                    <p class="text-sm text-gray-600 mt-1">{{ exercise.exercise?.description }}</p>
                  </div>
                </div>
                
                <!-- Exercise Details -->
                <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="detail-item">
                    <div class="text-xs text-gray-500 uppercase tracking-wide">Sets</div>
                    <div class="text-sm font-medium text-gray-800">{{ exercise.sets || 'N/A' }}</div>
                  </div>
                  
                  <div class="detail-item">
                    <div class="text-xs text-gray-500 uppercase tracking-wide">Reps/Duration</div>
                    <div class="text-sm font-medium text-gray-800">{{ exercise.reps || 'N/A' }}</div>
                  </div>
                  
                  <div class="detail-item">
                    <div class="text-xs text-gray-500 uppercase tracking-wide">Rest</div>
                    <div class="text-sm font-medium text-gray-800">
                      {{ exercise.rest_seconds ? `${exercise.rest_seconds}s` : 'N/A' }}
                    </div>
                  </div>
                  
                  <div class="detail-item">
                    <div class="text-xs text-gray-500 uppercase tracking-wide">Intensity</div>
                    <div class="text-sm font-medium">
                      <span 
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="getIntensityColor(exercise.intensity_percentage)"
                      >
                        {{ exercise.intensity_percentage }}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Notes -->
                <div v-if="exercise.notes" class="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                  {{ exercise.notes }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">🏋️</div>
          <p>No exercises assigned to this session</p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex space-x-4">
      <button 
        @click="handleStartSession"
        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        :disabled="!session?.session_exercises?.length || startingSession"
      >
        <span class="flex items-center justify-center">
          <svg v-if="!startingSession" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          {{ startingSession ? 'Starting...' : 'Start Session' }}
        </span>
      </button>
      
      <button 
        @click="$emit('edit-session')"
        class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTraining } from '@/composables/useTraining.js'
import { useAuthStore } from '@/stores/auth.js'

const props = defineProps({
  weeklyTemplateId: {
    type: Number,
    required: true
  },
  dayOfWeek: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['start-session', 'edit-session'])

const session = ref(null)
const startingSession = ref(false)

// Use training composable
const { loading, error, startSession } = useTraining()
const authStore = useAuthStore()

const loadSession = async () => {
  if (!props.weeklyTemplateId || !props.dayOfWeek) return
  
  try {
    // This would need to be implemented in the training service
    // For now, using a placeholder approach
    const sessionData = {
      id: props.weeklyTemplateId,
      session_name: `${getDayOfWeek(props.dayOfWeek)} Session`,
      day_of_week: props.dayOfWeek,
      total_duration_minutes: 60,
      intensity_level: 'moderate',
      session_type: 'strength_power',
      session_exercises: []
    }
    
    session.value = sessionData
  } catch (error) {
    console.error('Error loading daily session:', error)
  }
}

const handleStartSession = async () => {
  if (!session.value || !authStore.user?.id) return
  
  startingSession.value = true
  try {
    const result = await startSession(session.value, authStore.user.id)
    if (result.success) {
      emit('start-session', result.session)
    }
  } catch (error) {
    console.error('Error starting session:', error)
  } finally {
    startingSession.value = false
  }
}

const getDayOfWeek = (day) => {
  const days = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  }
  return days[day] || day
}

const getSessionTypeLabel = (type) => {
  const types = {
    warmup: 'Warm-up',
    strength_power: 'Strength & Power',
    speed_agility: 'Speed & Agility',
    skills_technical: 'Skills & Technical',
    conditioning: 'Conditioning',
    recovery: 'Recovery',
    prevention: 'Injury Prevention'
  }
  return types[type] || type
}

const getIntensityBadge = (intensity) => {
  const badges = {
    low: '🟢',
    moderate: '🟡',
    high: '🔴'
  }
  return badges[intensity] || '⚪'
}

const getIntensityColor = (percentage) => {
  if (percentage >= 80) return 'bg-red-100 text-red-800'
  if (percentage >= 60) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

// Load session when props change
watch(() => [props.weeklyTemplateId, props.dayOfWeek], loadSession, { immediate: true })

onMounted(loadSession)
</script>

<style scoped>
.daily-session-view {
  max-width: 800px;
  margin: 0 auto;
}

.exercise-item {
  transition: all 0.2s ease-in-out;
}

.exercise-item:hover {
  transform: translateY(-1px);
}

.detail-item {
  @apply flex flex-col;
}

/* Custom scrollbar for long exercise lists */
.exercises-list {
  max-height: 600px;
  overflow-y: auto;
}

.exercises-list::-webkit-scrollbar {
  width: 6px;
}

.exercises-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.exercises-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.exercises-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style> 