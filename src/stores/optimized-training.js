import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import { useAuthStore } from './auth'
import optimizedApi from '@/services/optimized-api'

// Efficient data structures for O(1) lookups
class ExerciseMap {
  constructor() {
    this.exercises = new Map()
    this.categories = new Map()
  }

  setExercises(exercises) {
    this.exercises.clear()
    exercises.forEach(ex => {
      this.exercises.set(ex.id, ex)
      if (ex.category) {
        this.categories.set(ex.category.id, ex.category)
      }
    })
  }

  getExercise(id) {
    return this.exercises.get(id)
  }

  getCategory(id) {
    return this.categories.get(id)
  }

  getExercisesByCategory(categoryId) {
    return Array.from(this.exercises.values())
      .filter(ex => ex.category?.id === categoryId)
  }
}

// Memory-efficient session storage
class SessionStorage {
  static saveSession(session) {
    if (!session) return
    
    const essentialData = {
      id: session.id,
      startTime: session.startTime,
      currentExerciseIndex: session.currentExerciseIndex,
      completedExercises: session.exercises
        ?.filter(ex => ex.completed)
        .map(ex => ({ 
          id: ex.id, 
          sets_logged: ex.sets_logged,
          reps_logged: ex.reps_logged 
        })) || [],
      elapsed: session.elapsed || 0
    }
    
    try {
      localStorage.setItem('active_session', JSON.stringify(essentialData))
    } catch (error) {
      console.warn('Failed to save session to localStorage:', error)
    }
  }

  static loadSession() {
    try {
      const saved = localStorage.getItem('active_session')
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.warn('Failed to load session from localStorage:', error)
      localStorage.removeItem('active_session')
      return null
    }
  }

  static clearSession() {
    localStorage.removeItem('active_session')
  }
}

export const useOptimizedTrainingStore = defineStore('optimizedTraining', () => {
  // State
  const currentProgram = ref(null)
  const todaySession = ref(null)
  const upcomingWorkouts = ref([])
  const exerciseLibrary = ref([])
  const progressData = ref(null)
  const activeSession = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Efficient data structures
  const exerciseMap = new ExerciseMap()
  const sessionTimer = ref(null)
  const cleanupFunctions = []

  // Computed properties
  const hasActiveSession = computed(() => !!activeSession.value)
  
  const sessionProgress = computed(() => {
    if (!activeSession.value?.exercises?.length) return 0
    const completed = activeSession.value.exercises.filter(ex => ex.completed).length
    return Math.round((completed / activeSession.value.exercises.length) * 100)
  })
  
  const currentExercise = computed(() => {
    if (!activeSession.value?.exercises?.length) return null
    return activeSession.value.exercises[activeSession.value.currentExerciseIndex]
  })
  
  const sessionDuration = computed(() => {
    if (!activeSession.value?.startTime) return 0
    return Math.round((Date.now() - activeSession.value.startTime) / 1000)
  })

  // Timer management with proper cleanup
  function startSessionTimer() {
    stopSessionTimer() // Ensure no duplicate timers
    
    sessionTimer.value = setInterval(() => {
      if (activeSession.value) {
        activeSession.value.elapsed = Date.now() - activeSession.value.startTime
        // Auto-save session every 30 seconds
        if (activeSession.value.elapsed % 30000 < 1000) {
          SessionStorage.saveSession(activeSession.value)
        }
      }
    }, 1000)
  }

  function stopSessionTimer() {
    if (sessionTimer.value) {
      clearInterval(sessionTimer.value)
      sessionTimer.value = null
    }
  }

  // Cleanup function registration
  function registerCleanup(cleanupFn) {
    cleanupFunctions.push(cleanupFn)
  }

  // Main cleanup function
  function cleanup() {
    stopSessionTimer()
    cleanupFunctions.forEach(fn => {
      try {
        fn()
      } catch (error) {
        console.warn('Cleanup function error:', error)
      }
    })
    cleanupFunctions.length = 0
  }

  // Actions with proper error handling
  async function loadCurrentProgram() {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    error.value = null
    
    try {
      const { data, error: apiError } = await optimizedApi.getCurrentProgram(authStore.profile?.id)
      if (apiError) throw apiError
      
      currentProgram.value = data
    } catch (err) {
      console.error('Error loading current program:', err)
      error.value = 'Failed to load training program'
    } finally {
      loading.value = false
    }
  }

  async function getTodaySession() {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    error.value = null
    
    try {
      const data = await optimizedApi.getTodaySession(authStore.profile?.id)
      todaySession.value = data
    } catch (err) {
      console.error('Error loading today session:', err)
      error.value = 'Failed to load today\'s session'
    } finally {
      loading.value = false
    }
  }

  async function loadExerciseLibrary(filters = {}) {
    loading.value = true
    error.value = null
    
    try {
      const { data, count, hasMore } = await optimizedApi.getExercises(filters, 1, 100)
      exerciseLibrary.value = data
      exerciseMap.setExercises(data)
    } catch (err) {
      console.error('Error loading exercise library:', err)
      error.value = 'Failed to load exercise library'
    } finally {
      loading.value = false
    }
  }

  async function startSession(sessionData) {
    const authStore = useAuthStore()
    if (!authStore.user) return { success: false, error: 'Not authenticated' }

    try {
      // Create athlete session
      const athleteSession = await optimizedApi.createAthleteSession(authStore.profile?.id, {
        session_id: sessionData.id,
        scheduled_date: new Date().toISOString().split('T')[0]
      })

      // Initialize active session with minimal data
      activeSession.value = {
        id: athleteSession.id,
        sessionId: sessionData.id,
        startTime: Date.now(),
        exercises: sessionData.session_exercises?.map(ex => ({
          id: ex.id,
          exercise_id: ex.exercise_id,
          name: ex.exercise?.name,
          order_in_session: ex.order_in_session,
          completed: false,
          sets_logged: 0,
          current_set: 1,
          logs: []
        })) || [],
        currentExerciseIndex: 0,
        elapsed: 0
      }

      // Start session timer
      startSessionTimer()

      // Save to storage
      SessionStorage.saveSession(activeSession.value)

      return { success: true, session: athleteSession }
    } catch (err) {
      console.error('Error starting session:', err)
      return { success: false, error: err.message }
    }
  }

  async function logExercise(exerciseId, logData) {
    if (!activeSession.value) return { success: false, error: 'No active session' }

    try {
      // Log to server
      const log = await optimizedApi.logExercise(activeSession.value.id, {
        exercise_id: exerciseId,
        ...logData
      })

      // Update local state
      const exercise = activeSession.value.exercises.find(ex => ex.exercise_id === exerciseId)
      if (exercise) {
        exercise.logs.push(log)
        exercise.sets_logged++
        
        // Mark as completed if all sets done
        if (exercise.sets_logged >= (logData.target_sets || 3)) {
          exercise.completed = true
          // Move to next exercise
          if (activeSession.value.currentExerciseIndex < activeSession.value.exercises.length - 1) {
            activeSession.value.currentExerciseIndex++
          }
        }
      }

      // Save session state
      SessionStorage.saveSession(activeSession.value)

      return { success: true, log }
    } catch (err) {
      console.error('Error logging exercise:', err)
      return { success: false, error: err.message }
    }
  }

  async function completeSession() {
    if (!activeSession.value) return { success: false, error: 'No active session' }

    try {
      // Stop timer
      stopSessionTimer()

      const sessionSummary = {
        completion_percentage: sessionProgress.value,
        duration_minutes: Math.round((Date.now() - activeSession.value.startTime) / 60000),
        rpe_score: 8, // Default, should be collected from user
        satisfaction_rating: 4, // Default, should be collected from user
        notes: 'Session completed'
      }

      // Complete session on server
      await optimizedApi.completeAthleteSession(activeSession.value.id, sessionSummary)

      // Clear active session
      activeSession.value = null
      SessionStorage.clearSession()

      return { success: true }
    } catch (err) {
      console.error('Error completing session:', err)
      return { success: false, error: err.message }
    }
  }

  function pauseSession() {
    stopSessionTimer()
    SessionStorage.saveSession(activeSession.value)
  }

  function resumeSession() {
    if (activeSession.value && !sessionTimer.value) {
      startSessionTimer()
    }
  }

  function recoverSession() {
    const saved = SessionStorage.loadSession()
    if (saved) {
      try {
        // Reconstruct session from saved data
        activeSession.value = {
          ...saved,
          exercises: activeSession.value?.exercises || [], // Keep existing exercises if available
          elapsed: saved.elapsed || 0
        }
        resumeSession()
        return { success: true, recovered: true }
      } catch (err) {
        console.error('Error recovering session:', err)
        SessionStorage.clearSession()
        return { success: false, error: err.message }
      }
    }
    return { success: false, error: 'No saved session found' }
  }

  async function loadProgressData(timeRange = '30d') {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    error.value = null
    
    try {
      const { data, count } = await optimizedApi.getAthleteProgress(authStore.profile?.id, 1, 50)
      progressData.value = data
    } catch (err) {
      console.error('Error loading progress data:', err)
      error.value = 'Failed to load progress data'
    } finally {
      loading.value = false
    }
  }

  async function loadUpcomingWorkouts() {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    error.value = null
    
    try {
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7) // Next 7 days
      
      const { data, count, hasMore } = await optimizedApi.getAthleteSessions(
        authStore.profile?.id,
        new Date().toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        1,
        20
      )
      
      upcomingWorkouts.value = data
    } catch (err) {
      console.error('Error loading upcoming workouts:', err)
      error.value = 'Failed to load upcoming workouts'
    } finally {
      loading.value = false
    }
  }

  function clearSession() {
    stopSessionTimer()
    activeSession.value = null
    SessionStorage.clearSession()
  }

  // Parallel data loading for better performance
  async function loadDashboardData() {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    error.value = null
    
    try {
      const [program, session, library, progress, workouts] = await Promise.allSettled([
        loadCurrentProgram(),
        getTodaySession(),
        loadExerciseLibrary(),
        loadProgressData(),
        loadUpcomingWorkouts()
      ])
      
      // Handle individual results
      if (program.status === 'rejected') {
        console.error('Failed to load program:', program.reason)
      }
      if (session.status === 'rejected') {
        console.error('Failed to load session:', session.reason)
      }
      if (library.status === 'rejected') {
        console.error('Failed to load library:', library.reason)
      }
      if (progress.status === 'rejected') {
        console.error('Failed to load progress:', progress.reason)
      }
      if (workouts.status === 'rejected') {
        console.error('Failed to load workouts:', workouts.reason)
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      error.value = 'Failed to load dashboard data'
    } finally {
      loading.value = false
    }
  }

  // Register cleanup on store disposal
  registerCleanup(() => {
    stopSessionTimer()
    SessionStorage.clearSession()
  })

  return {
    // State
    currentProgram: computed(() => currentProgram.value),
    todaySession: computed(() => todaySession.value),
    upcomingWorkouts: computed(() => upcomingWorkouts.value),
    exerciseLibrary: computed(() => exerciseLibrary.value),
    progressData: computed(() => progressData.value),
    activeSession: computed(() => activeSession.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),

    // Getters
    hasActiveSession,
    sessionProgress,
    currentExercise,
    sessionDuration,

    // Utility methods
    getExercise: (id) => exerciseMap.getExercise(id),
    getCategory: (id) => exerciseMap.getCategory(id),
    getExercisesByCategory: (categoryId) => exerciseMap.getExercisesByCategory(categoryId),

    // Actions
    loadCurrentProgram,
    getTodaySession,
    loadExerciseLibrary,
    startSession,
    logExercise,
    completeSession,
    pauseSession,
    resumeSession,
    recoverSession,
    loadProgressData,
    loadUpcomingWorkouts,
    loadDashboardData,
    clearSession,
    cleanup
  }
}) 