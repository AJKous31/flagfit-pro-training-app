// Training Composable
import { ref, computed } from 'vue'
import { trainingService } from '@/services/index.js'

export function useTraining() {
  const loading = ref(false)
  const error = ref(null)
  const currentProgram = ref(null)
  const todaySession = ref(null)
  const exerciseLibrary = ref([])
  const activeSession = ref(null)
  const sessionTimer = ref(null)
  
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
  
  // Training Programs
  async function loadCurrentProgram(athleteId) {
    if (!athleteId) return
    
    loading.value = true
    error.value = null
    
    try {
      const program = await trainingService.getCurrentAthleteProgram(athleteId)
      currentProgram.value = program
      return program
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function getTrainingPrograms(options = {}) {
    loading.value = true
    error.value = null
    
    try {
      const programs = await trainingService.getTrainingPrograms(options)
      return programs
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function assignProgramToAthlete(programId, athleteId, assignedBy) {
    loading.value = true
    error.value = null
    
    try {
      const result = await trainingService.assignProgramToAthlete(programId, athleteId, assignedBy)
      
      // Refresh current program
      if (athleteId) {
        await loadCurrentProgram(athleteId)
      }
      
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Sessions
  async function loadTodaySession(athleteId) {
    if (!athleteId) return
    
    loading.value = true
    error.value = null
    
    try {
      const session = await trainingService.getTodaySession(athleteId)
      todaySession.value = session
      return session
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function getAthleteSessions(athleteId, startDate, endDate, options = {}) {
    loading.value = true
    error.value = null
    
    try {
      const sessions = await trainingService.getAthleteSessions(athleteId, startDate, endDate, options)
      return sessions
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function startSession(sessionData, athleteId) {
    if (!athleteId) return
    
    loading.value = true
    error.value = null
    
    try {
      // Create athlete session
      const athleteSession = await trainingService.createAthleteSession(athleteId, {
        sessionId: sessionData.id,
        scheduledDate: new Date().toISOString().split('T')[0]
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
      startSessionTimer()
      
      // Save to local storage for recovery
      localStorage.setItem('active_session', JSON.stringify(activeSession.value))
      
      return { success: true, session: athleteSession }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function completeSession() {
    if (!activeSession.value) return
    
    loading.value = true
    error.value = null
    
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
      await trainingService.completeAthleteSession(activeSession.value.id, sessionSummary)
      
      // Clear active session
      activeSession.value = null
      localStorage.removeItem('active_session')
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Exercise Logging
  async function logExercise(exerciseId, exerciseData) {
    if (!activeSession.value) return
    
    loading.value = true
    error.value = null
    
    try {
      // Log exercise to server
      const logEntry = await trainingService.logExercise(activeSession.value.id, {
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
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Exercise Library
  async function loadExerciseLibrary(filters = {}, options = {}) {
    loading.value = true
    error.value = null
    
    try {
      const exercises = await trainingService.getExercises(filters, options)
      exerciseLibrary.value = exercises
      return exercises
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function getExerciseById(exerciseId) {
    loading.value = true
    error.value = null
    
    try {
      const exercise = await trainingService.getExerciseById(exerciseId)
      return exercise
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Session Timer Management
  function startSessionTimer() {
    if (sessionTimer.value) {
      clearInterval(sessionTimer.value)
    }
    
    sessionTimer.value = setInterval(() => {
      if (activeSession.value) {
        activeSession.value.elapsed = Date.now() - activeSession.value.startTime
      }
    }, 1000)
  }
  
  function stopSessionTimer() {
    if (sessionTimer.value) {
      clearInterval(sessionTimer.value)
      sessionTimer.value = null
    }
  }
  
  function pauseSession() {
    stopSessionTimer()
  }
  
  function resumeSession() {
    if (activeSession.value && !sessionTimer.value) {
      startSessionTimer()
    }
  }
  
  // Session Recovery
  function recoverSession() {
    const savedSession = localStorage.getItem('active_session')
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        activeSession.value = session
        
        // Resume timer if session was active
        if (session.startTime) {
          startSessionTimer()
        }
        
        return session
      } catch (err) {
        console.error('Error recovering session:', err)
        localStorage.removeItem('active_session')
      }
    }
    return null
  }
  
  // Clear session
  function clearSession() {
    stopSessionTimer()
    activeSession.value = null
    localStorage.removeItem('active_session')
  }
  
  // Clear data
  function clearData() {
    currentProgram.value = null
    todaySession.value = null
    exerciseLibrary.value = []
    clearSession()
    error.value = null
  }
  
  // Clear error
  function clearError() {
    error.value = null
  }
  
  return {
    // State
    loading,
    error,
    currentProgram,
    todaySession,
    exerciseLibrary,
    activeSession,
    sessionTimer,
    
    // Computed
    hasActiveSession,
    sessionProgress,
    currentExercise,
    sessionDuration,
    
    // Methods
    loadCurrentProgram,
    getTrainingPrograms,
    assignProgramToAthlete,
    loadTodaySession,
    getAthleteSessions,
    startSession,
    completeSession,
    logExercise,
    loadExerciseLibrary,
    getExerciseById,
    startSessionTimer,
    stopSessionTimer,
    pauseSession,
    resumeSession,
    recoverSession,
    clearSession,
    clearData,
    clearError
  }
} 