<template>
  <div class="weekly-schedule-view">
    <!-- Week Navigation -->
    <div class="week-navigation bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex items-center justify-between">
        <button 
          @click="previousWeek"
          class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <div class="text-center">
          <h2 class="text-xl font-semibold text-gray-800">Week of {{ formatWeekRange() }}</h2>
          <p class="text-sm text-gray-600">Week {{ currentWeekNumber }} of {{ totalWeeks }}</p>
        </div>
        
        <button 
          @click="nextWeek"
          class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Weekly Schedule Grid -->
    <div class="schedule-grid">
      <div 
        v-for="day in weekDays" 
        :key="day.date"
        class="day-card bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <!-- Day Header -->
        <div class="day-header p-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-800">{{ day.name }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(day.date) }}</p>
            </div>
            <div class="text-right">
              <div 
                v-if="day.session"
                class="text-xs px-2 py-1 rounded-full font-medium"
                :class="getSessionTypeColor(day.session.session_type)"
              >
                {{ getSessionTypeLabel(day.session.session_type) }}
              </div>
              <div v-else class="text-xs text-gray-400">Rest Day</div>
            </div>
          </div>
        </div>

        <!-- Session Content -->
        <div class="day-content p-4">
          <div v-if="loading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
          
          <div v-else-if="day.session" class="space-y-3">
            <!-- Session Info -->
            <div class="session-info">
              <h4 class="font-medium text-gray-800 mb-1">{{ day.session.session_name }}</h4>
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ day.session.total_duration_minutes }}min
                </span>
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getIntensityColor(day.session.intensity_level)"
                >
                  {{ getIntensityLabel(day.session.intensity_level) }}
                </span>
              </div>
            </div>

            <!-- Exercise Count -->
            <div class="exercise-count text-sm text-gray-600">
              {{ day.session.session_exercises?.length || 0 }} exercises
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <button 
                @click="viewSession(day.session)"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
              >
                View
              </button>
              <button 
                @click="startSession(day.session)"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
              >
                Start
              </button>
            </div>
          </div>
          
          <div v-else class="text-center py-6 text-gray-500">
            <div class="text-2xl mb-2">😴</div>
            <p class="text-sm">Rest Day</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Summary -->
    <div class="weekly-summary bg-white rounded-lg shadow-sm p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Weekly Summary</h3>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="summary-item text-center">
          <div class="text-2xl font-bold text-blue-600">{{ totalSessions }}</div>
          <div class="text-sm text-gray-600">Training Days</div>
        </div>
        
        <div class="summary-item text-center">
          <div class="text-2xl font-bold text-green-600">{{ totalDuration }}h</div>
          <div class="text-sm text-gray-600">Total Time</div>
        </div>
        
        <div class="summary-item text-center">
          <div class="text-2xl font-bold text-orange-600">{{ totalExercises }}</div>
          <div class="text-sm text-gray-600">Exercises</div>
        </div>
        
        <div class="summary-item text-center">
          <div class="text-2xl font-bold text-purple-600">{{ completedSessions }}</div>
          <div class="text-sm text-gray-600">Completed</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns'

const props = defineProps({
  weeklyTemplateId: {
    type: Number,
    required: true
  },
  startDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  totalWeeks: {
    type: Number,
    default: 16
  }
})

const emit = defineEmits(['view-session', 'start-session'])

const currentWeekStart = ref(new Date(props.startDate))
const loading = ref(false)
const weeklySessions = ref([])

// Import API methods
import { getWeeklySessionTemplates, getAthleteWeeklySchedule } from '@/services/api.js'

const weekDays = computed(() => {
  const days = []
  const weekStart = startOfWeek(currentWeekStart.value, { weekStartsOn: 1 }) // Monday start
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i)
    const dayName = format(date, 'EEEE').toLowerCase()
    const session = weeklySessions.value.find(s => s.day_of_week === dayName)
    
    days.push({
      name: format(date, 'EEEE'),
      date: format(date, 'yyyy-MM-dd'),
      session
    })
  }
  
  return days
})

const currentWeekNumber = computed(() => {
  const start = new Date(props.startDate)
  const diffTime = Math.abs(currentWeekStart.value - start)
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
  return diffWeeks + 1
})

const totalSessions = computed(() => {
  return weeklySessions.value.length
})

const totalDuration = computed(() => {
  return Math.round(weeklySessions.value.reduce((total, session) => {
    return total + (session.total_duration_minutes || 0)
  }, 0) / 60)
})

const totalExercises = computed(() => {
  return weeklySessions.value.reduce((total, session) => {
    return total + (session.session_exercises?.length || 0)
  }, 0)
})

const completedSessions = computed(() => {
  // This would be calculated from actual completion data
  return 0
})

const loadWeeklySessions = async () => {
  if (!props.weeklyTemplateId) return
  
  loading.value = true
  try {
    weeklySessions.value = await getWeeklySessionTemplates(props.weeklyTemplateId)
  } catch (error) {
    console.error('Error loading weekly sessions:', error)
  } finally {
    loading.value = false
  }
}

const previousWeek = () => {
  currentWeekStart.value = subWeeks(currentWeekStart.value, 1)
}

const nextWeek = () => {
  currentWeekStart.value = addWeeks(currentWeekStart.value, 1)
}

const formatWeekRange = () => {
  const start = format(startOfWeek(currentWeekStart.value, { weekStartsOn: 1 }), 'MMM d')
  const end = format(addDays(startOfWeek(currentWeekStart.value, { weekStartsOn: 1 }), 6), 'MMM d, yyyy')
  return `${start} - ${end}`
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM d')
}

const getSessionTypeLabel = (type) => {
  const types = {
    warmup: 'Warm-up',
    strength_power: 'Strength',
    speed_agility: 'Speed',
    skills_technical: 'Skills',
    conditioning: 'Cardio',
    recovery: 'Recovery',
    prevention: 'Prevention'
  }
  return types[type] || type
}

const getSessionTypeColor = (type) => {
  const colors = {
    warmup: 'bg-blue-100 text-blue-800',
    strength_power: 'bg-red-100 text-red-800',
    speed_agility: 'bg-green-100 text-green-800',
    skills_technical: 'bg-purple-100 text-purple-800',
    conditioning: 'bg-orange-100 text-orange-800',
    recovery: 'bg-gray-100 text-gray-800',
    prevention: 'bg-yellow-100 text-yellow-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

const getIntensityLabel = (level) => {
  const labels = {
    low: 'Low',
    moderate: 'Mod',
    high: 'High',
    very_high: 'Max'
  }
  return labels[level] || level
}

const getIntensityColor = (level) => {
  const colors = {
    low: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    very_high: 'bg-red-100 text-red-800'
  }
  return colors[level] || 'bg-gray-100 text-gray-800'
}

const viewSession = (session) => {
  emit('view-session', session)
}

const startSession = (session) => {
  emit('start-session', session)
}

onMounted(() => {
  loadWeeklySessions()
})

watch(() => props.weeklyTemplateId, () => {
  loadWeeklySessions()
})
</script>

<style scoped>
.weekly-schedule-view {
  max-width: 1200px;
  margin: 0 auto;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.day-card {
  min-height: 200px;
}

.day-content {
  min-height: 120px;
}

.summary-item {
  @apply p-4 bg-gray-50 rounded-lg;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .schedule-grid {
    grid-template-columns: 1fr;
  }
  
  .weekly-summary .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 