import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth.js'
import { api } from '@/services/api.js'

export const useTrainingStore = defineStore('training', () => {
  const authStore = useAuthStore()

  // State
  const currentProgram = ref(null)
  const todaySession = ref(null)
  const upcomingWorkouts = ref([])
  const exerciseLibrary = ref([])
  const progressData = ref({})
  const activeSession = ref(null)
  const sessionTimer = ref(null)
  const loading = ref(false)

  // Getters
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

  // Actions
  async function loadCurrentProgram() {
    if (!authStore.user) return

    loading.value = true
    try {
      const programs = await api.getAthletePrograms(authStore.profile?.id)
      currentProgram.value = programs.find(p => p.status === 'active') || null
    } catch (error) {
      console.error('Error loading current program:', error)
    } finally {
      loading.value = false
    }
  }

  async function getTodaySession() {
    if (!authStore.user) return

    loading.value = true
    try {
      const today = new Date().toISOString().split('T')[0]
      const sessions = await api.getAthleteSessions(authStore.profile?.id, today, today)
      todaySession.value = sessions[0] || null
    } catch (error) {
      console.error('Error loading today session:', error)
    } finally {
      loading.value = false
    }
  }

  async function loadExerciseLibrary() {
    loading.value = true
    try {
      exerciseLibrary.value = await api.getExercises()
    } catch (error) {
      console.error('Error loading exercise library:', error)
    } finally {
      loading.value = false
    }
  }

  async function startSession(sessionData) {
    if (!authStore.user) return

    try {
      // Create athlete session
      const athleteSession = await api.createAthleteSession(authStore.profile?.id, {
        session_id: sessionData.id,
        scheduled_date: new Date().toISOString().split('T')[0]
      })

      // Initialize active session
      activeSession.value = {
        id: athleteSession.id,
        sessionId: sessionData.id,
        startTime: Date.now(),
        exercises: sessionData.session_exercises?.map(ex => ({
          ...ex,
          completed: false,
          sets_logged: 0,
          current_set: 1,
          logs: []
        })) || [],
        currentExerciseIndex: 0,
        logs: []
      }

      // Start session timer
      sessionTimer.value = setInterval(() => {
        if (activeSession.value) {
          activeSession.value.elapsed = Date.now() - activeSession.value.startTime
        }
      }, 1000)

      // Save to local storage for recovery
      localStorage.setItem('active_session', JSON.stringify(activeSession.value))

      return { success: true, session: athleteSession }
    } catch (error) {
      console.error('Error starting session:', error)
      return { success: false, error: error.message }
    }
  }

  async function logExercise(exerciseId, exerciseData) {
    if (!activeSession.value) return

    try {
      // Log exercise to server
      const logEntry = await api.logExercise(activeSession.value.id, {
        exercise_id: exerciseId,
        ...exerciseData
      })

      // Update local state
      const exercise = activeSession.value.exercises.find(ex => ex.exercise?.id === exerciseId)
      if (exercise) {
        exercise.logs.push(logEntry)
        exercise.sets_logged++
        exercise.current_set++

        // Check if exercise is completed
        if (exercise.sets_logged >= (exercise.sets || 3)) {
          exercise.completed = true
          
          // Auto-advance to next exercise
          if (activeSession.value.currentExerciseIndex < activeSession.value.exercises.length - 1) {
            activeSession.value.currentExerciseIndex++
          }
        }
      }

      // Update local storage
      localStorage.setItem('active_session', JSON.stringify(activeSession.value))

      return { success: true, log: logEntry }
    } catch (error) {
      console.error('Error logging exercise:', error)
      return { success: false, error: error.message }
    }
  }

  async function completeSession() {
    if (!activeSession.value) return

    try {
      // Stop timer
      if (sessionTimer.value) {
        clearInterval(sessionTimer.value)
        sessionTimer.value = null
      }

      const sessionSummary = {
        completion_percentage: sessionProgress.value,
        duration_minutes: Math.round((Date.now() - activeSession.value.startTime) / 60000),
        rpe_score: 8, // Default, should be collected from user
        satisfaction_rating: 4, // Default, should be collected from user
        notes: 'Session completed'
      }

      // Complete session on server
      await api.completeAthleteSession(activeSession.value.id, sessionSummary)

      // Clear active session
      activeSession.value = null
      localStorage.removeItem('active_session')

      return { success: true }
    } catch (error) {
      console.error('Error completing session:', error)
      return { success: false, error: error.message }
    }
  }

  function pauseSession() {
    if (sessionTimer.value) {
      clearInterval(sessionTimer.value)
      sessionTimer.value = null
    }
  }

  function resumeSession() {
    if (activeSession.value && !sessionTimer.value) {
      sessionTimer.value = setInterval(() => {
        if (activeSession.value) {
          activeSession.value.elapsed = Date.now() - activeSession.value.startTime
        }
      }, 1000)
    }
  }

  function recoverSession() {
    const saved = localStorage.getItem('active_session')
    if (saved) {
      try {
        const sessionData = JSON.parse(saved)
        activeSession.value = sessionData
        resumeSession()
        return { success: true, recovered: true }
      } catch (error) {
        console.error('Error recovering session:', error)
        localStorage.removeItem('active_session')
        return { success: false, error: error.message }
      }
    }
    return { success: false, error: 'No saved session found' }
  }

  async function loadProgressData(timeRange = '30d') {
    if (!authStore.user) return

    loading.value = true
    try {
      const analysis = await api.analyzeProgress(authStore.profile?.id, timeRange)
      progressData.value = analysis
    } catch (error) {
      console.error('Error loading progress data:', error)
    } finally {
      loading.value = false
    }
  }

  async function loadUpcomingWorkouts() {
    if (!authStore.user) return

    loading.value = true
    try {
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7) // Next 7 days
      
      const sessions = await api.getAthleteSessions(
        authStore.profile?.id,
        new Date().toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      )
      
      upcomingWorkouts.value = sessions
    } catch (error) {
      console.error('Error loading upcoming workouts:', error)
    } finally {
      loading.value = false
    }
  }

  function clearSession() {
    if (sessionTimer.value) {
      clearInterval(sessionTimer.value)
      sessionTimer.value = null
    }
    activeSession.value = null
    localStorage.removeItem('active_session')
  }

  return {
    // State
    currentProgram: computed(() => currentProgram.value),
    todaySession: computed(() => todaySession.value),
    upcomingWorkouts: computed(() => upcomingWorkouts.value),
    exerciseLibrary: computed(() => exerciseLibrary.value),
    progressData: computed(() => progressData.value),
    activeSession: computed(() => activeSession.value),
    loading: computed(() => loading.value),

    // Getters
    hasActiveSession,
    sessionProgress,
    currentExercise,
    sessionDuration,

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
    clearSession
  }
}) 