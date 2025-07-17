// Session Factory Pattern Implementation
export class SessionFactory {
  // Create an active session from athlete session data
  static createActiveSession(athleteSession, sessionData) {
    return {
      id: athleteSession.id,
      sessionId: sessionData.id,
      startTime: Date.now(),
      exercises: this.createExercises(sessionData.session_exercises),
      currentExerciseIndex: 0,
      logs: [],
      status: 'in_progress',
      metadata: {
        createdFrom: 'athlete_session',
        originalSessionData: sessionData
      }
    }
  }
  
  // Create exercises array from session exercise data
  static createExercises(sessionExercises = []) {
    return sessionExercises.map(exercise => ({
      ...exercise,
      completed: false,
      sets_logged: 0,
      current_set: 1,
      logs: [],
      startTime: null,
      endTime: null,
      totalDuration: 0,
      rpe: null,
      notes: ''
    }))
  }
  
  // Create a new exercise log entry
  static createExerciseLog(exerciseId, exerciseData) {
    return {
      exercise_id: exerciseId,
      sets: exerciseData.sets || 0,
      reps: exerciseData.reps || 0,
      weight: exerciseData.weight || null,
      duration: exerciseData.duration || null,
      rpe: exerciseData.rpe || null,
      notes: exerciseData.notes || '',
      completed_at: new Date().toISOString(),
      metadata: {
        createdBy: 'session_factory',
        version: '1.0'
      }
    }
  }
  
  // Create a session summary for completion
  static createSessionSummary(session, completionData = {}) {
    const duration = session.startTime ? 
      Math.round((Date.now() - session.startTime) / 60000) : 0
    
    const completedExercises = session.exercises?.filter(ex => ex.completed).length || 0
    const totalExercises = session.exercises?.length || 0
    const completionPercentage = totalExercises > 0 ? 
      Math.round((completedExercises / totalExercises) * 100) : 0
    
    return {
      completion_percentage: completionData.completion_percentage || completionPercentage,
      duration_minutes: completionData.duration_minutes || duration,
      rpe_score: completionData.rpe_score || 8,
      satisfaction_rating: completionData.satisfaction_rating || 4,
      notes: completionData.notes || 'Session completed',
      completed_exercises: completedExercises,
      total_exercises: totalExercises,
      completed_at: new Date().toISOString(),
      metadata: {
        createdBy: 'session_factory',
        sessionType: 'training',
        version: '1.0'
      }
    }
  }
  
  // Create a recovery session
  static createRecoverySession(athleteId, recoveryData) {
    return {
      athlete_id: athleteId,
      session_type: 'recovery',
      startTime: Date.now(),
      exercises: this.createRecoveryExercises(recoveryData.exercises),
      currentExerciseIndex: 0,
      logs: [],
      status: 'in_progress',
      recovery_focus: recoveryData.focus || 'general',
      intensity_level: recoveryData.intensity || 'light',
      metadata: {
        createdBy: 'session_factory',
        sessionType: 'recovery',
        version: '1.0'
      }
    }
  }
  
  // Create recovery exercises
  static createRecoveryExercises(recoveryExercises = []) {
    return recoveryExercises.map(exercise => ({
      ...exercise,
      completed: false,
      duration_logged: 0,
      current_duration: 0,
      logs: [],
      startTime: null,
      endTime: null,
      intensity: 'light',
      notes: ''
    }))
  }
  
  // Create a wellness session
  static createWellnessSession(athleteId, wellnessData) {
    return {
      athlete_id: athleteId,
      session_type: 'wellness',
      startTime: Date.now(),
      exercises: this.createWellnessExercises(wellnessData.exercises),
      currentExerciseIndex: 0,
      logs: [],
      status: 'in_progress',
      wellness_focus: wellnessData.focus || 'general',
      stress_level: wellnessData.stressLevel || 5,
      energy_level: wellnessData.energyLevel || 5,
      metadata: {
        createdBy: 'session_factory',
        sessionType: 'wellness',
        version: '1.0'
      }
    }
  }
  
  // Create wellness exercises
  static createWellnessExercises(wellnessExercises = []) {
    return wellnessExercises.map(exercise => ({
      ...exercise,
      completed: false,
      duration_logged: 0,
      current_duration: 0,
      logs: [],
      startTime: null,
      endTime: null,
      intensity: 'light',
      notes: ''
    }))
  }
  
  // Create a session from template
  static createSessionFromTemplate(template, athleteId, customizations = {}) {
    const session = {
      athlete_id: athleteId,
      session_type: template.type || 'training',
      startTime: Date.now(),
      exercises: this.createExercisesFromTemplate(template.exercises, customizations),
      currentExerciseIndex: 0,
      logs: [],
      status: 'in_progress',
      template_id: template.id,
      customizations: customizations,
      metadata: {
        createdBy: 'session_factory',
        templateBased: true,
        templateId: template.id,
        version: '1.0'
      }
    }
    
    // Apply customizations
    if (customizations.intensity) {
      session.intensity_level = customizations.intensity
    }
    
    if (customizations.focus) {
      session.focus_area = customizations.focus
    }
    
    return session
  }
  
  // Create exercises from template
  static createExercisesFromTemplate(templateExercises = [], customizations = {}) {
    return templateExercises.map(exercise => {
      const customizedExercise = { ...exercise }
      
      // Apply customizations
      if (customizations.sets && exercise.sets) {
        customizedExercise.sets = customizations.sets
      }
      
      if (customizations.reps && exercise.reps) {
        customizedExercise.reps = customizations.reps
      }
      
      if (customizations.duration && exercise.duration) {
        customizedExercise.duration = customizations.duration
      }
      
      return {
        ...customizedExercise,
        completed: false,
        sets_logged: 0,
        current_set: 1,
        logs: [],
        startTime: null,
        endTime: null,
        totalDuration: 0,
        rpe: null,
        notes: ''
      }
    })
  }
  
  // Create a session from saved data (for recovery)
  static createSessionFromSaved(savedData) {
    if (!savedData) return null
    
    try {
      const session = {
        ...savedData,
        // Ensure required fields are present
        startTime: savedData.startTime || Date.now(),
        exercises: savedData.exercises || [],
        currentExerciseIndex: savedData.currentExerciseIndex || 0,
        logs: savedData.logs || [],
        status: savedData.status || 'in_progress'
      }
      
      // Validate session structure
      if (!session.id || !session.sessionId) {
        throw new Error('Invalid session data: missing required fields')
      }
      
      return session
    } catch (error) {
      console.error('Error creating session from saved data:', error)
      return null
    }
  }
  
  // Create a session preview (for planning)
  static createSessionPreview(template, athleteId, customizations = {}) {
    return {
      preview: true,
      athlete_id: athleteId,
      session_type: template.type || 'training',
      exercises: this.createExercisesFromTemplate(template.exercises, customizations),
      estimated_duration: this.calculateEstimatedDuration(template.exercises, customizations),
      estimated_calories: this.calculateEstimatedCalories(template.exercises, customizations),
      difficulty_level: this.calculateDifficultyLevel(template.exercises, customizations),
      template_id: template.id,
      customizations: customizations,
      metadata: {
        createdBy: 'session_factory',
        preview: true,
        version: '1.0'
      }
    }
  }
  
  // Calculate estimated duration
  static calculateEstimatedDuration(exercises, customizations) {
    const baseDuration = exercises.reduce((total, exercise) => {
      return total + (exercise.duration || 0)
    }, 0)
    
    // Apply customizations
    if (customizations.intensity === 'high') {
      return Math.round(baseDuration * 0.8) // Faster for high intensity
    } else if (customizations.intensity === 'low') {
      return Math.round(baseDuration * 1.2) // Slower for low intensity
    }
    
    return baseDuration
  }
  
  // Calculate estimated calories
  static calculateEstimatedCalories(exercises, customizations) {
    const baseCalories = exercises.reduce((total, exercise) => {
      return total + (exercise.estimated_calories || 0)
    }, 0)
    
    // Apply customizations
    if (customizations.intensity === 'high') {
      return Math.round(baseCalories * 1.2)
    } else if (customizations.intensity === 'low') {
      return Math.round(baseCalories * 0.8)
    }
    
    return baseCalories
  }
  
  // Calculate difficulty level
  static calculateDifficultyLevel(exercises, customizations) {
    const difficultyScores = {
      beginner: 1,
      intermediate: 2,
      advanced: 3
    }
    
    const averageDifficulty = exercises.reduce((total, exercise) => {
      return total + (difficultyScores[exercise.difficulty_level] || 1)
    }, 0) / exercises.length
    
    // Apply customizations
    if (customizations.intensity === 'high') {
      return averageDifficulty > 2 ? 'advanced' : 'intermediate'
    } else if (customizations.intensity === 'low') {
      return averageDifficulty < 2 ? 'beginner' : 'intermediate'
    }
    
    if (averageDifficulty < 1.5) return 'beginner'
    if (averageDifficulty < 2.5) return 'intermediate'
    return 'advanced'
  }
  
  // Validate session data
  static validateSession(session) {
    const errors = []
    
    if (!session.id) {
      errors.push('Session ID is required')
    }
    
    if (!session.sessionId) {
      errors.push('Session template ID is required')
    }
    
    if (!session.athlete_id) {
      errors.push('Athlete ID is required')
    }
    
    if (!session.exercises || !Array.isArray(session.exercises)) {
      errors.push('Exercises array is required')
    }
    
    if (session.currentExerciseIndex < 0 || session.currentExerciseIndex >= session.exercises.length) {
      errors.push('Invalid current exercise index')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default SessionFactory 