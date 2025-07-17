// Service Index - Centralized service management
import { container, initializeServices } from './container.js'
import AuthService from './auth.service.js'
import TrainingService from './training.service.js'
import AnalyticsService from './analytics.service.js'
import cacheService from './cache.service.js'

// Initialize core services
initializeServices()

// Register domain services
container.registerServices({
  authService: {
    factory: () => new AuthService(),
    singleton: true
  },
  trainingService: {
    factory: () => new TrainingService(),
    singleton: true
  },
  analyticsService: {
    factory: () => new AnalyticsService(),
    singleton: true
  },
  cacheService: {
    factory: () => cacheService,
    singleton: true
  }
})

// Export service instances
export const authService = container.resolve('authService')
export const trainingService = container.resolve('trainingService')
export const analyticsService = container.resolve('analyticsService')

// Export container for advanced usage
export { container }

// Legacy API compatibility (for gradual migration)
export const api = {
  // Auth methods
  register: (userData) => authService.register(userData),
  login: (email, password) => authService.login(email, password),
  logout: () => authService.logout(),
  getCurrentUser: () => authService.getCurrentUser(),
  
  // Training methods
  getTrainingPrograms: (options) => trainingService.getTrainingPrograms(options),
  getTrainingProgram: (programId) => trainingService.getTrainingProgram(programId),
  assignProgramToAthlete: (programId, athleteId, assignedBy) => 
    trainingService.assignProgramToAthlete(programId, athleteId, assignedBy),
  getCurrentAthleteProgram: (athleteId) => trainingService.getCurrentAthleteProgram(athleteId),
  getTodaySession: (athleteId) => trainingService.getTodaySession(athleteId),
  getAthleteSessions: (athleteId, startDate, endDate, options) => 
    trainingService.getAthleteSessions(athleteId, startDate, endDate, options),
  createAthleteSession: (athleteId, sessionData) => 
    trainingService.createAthleteSession(athleteId, sessionData),
  completeAthleteSession: (sessionId, completionData) => 
    trainingService.completeAthleteSession(sessionId, completionData),
  logExercise: (sessionId, exerciseData) => trainingService.logExercise(sessionId, exerciseData),
  getExerciseLogs: (sessionId) => trainingService.getExerciseLogs(sessionId),
  getExercises: (filters, options) => trainingService.getExercises(filters, options),
  getExerciseById: (exerciseId) => trainingService.getExerciseById(exerciseId),
  
  // Analytics methods
  getTeamAnalytics: (teamId, options) => analyticsService.getTeamAnalytics(teamId, options),
  analyzeProgress: (athleteId, timeframe) => analyticsService.analyzeProgress(athleteId, timeframe),
  getPerformanceMetrics: (athleteId, metricType, timeRange) => 
    analyticsService.getPerformanceMetrics(athleteId, metricType, timeRange),
  submitPerformanceMetric: (athleteId, metricData) => 
    analyticsService.submitPerformanceMetric(athleteId, metricData),
  getWellnessAnalytics: (athleteId, timeRange) => 
    analyticsService.getWellnessAnalytics(athleteId, timeRange),
  getTrainingVolume: (athleteId, timeRange) => 
    analyticsService.getTrainingVolume(athleteId, timeRange),
  getAdherenceAnalysis: (athleteId, timeRange) => 
    analyticsService.getAdherenceAnalysis(athleteId, timeRange)
}

// Export individual methods for backward compatibility
export const {
  register,
  login,
  logout,
  getCurrentUser,
  getTrainingPrograms,
  getTrainingProgram,
  assignProgramToAthlete,
  getCurrentAthleteProgram,
  getTodaySession,
  getAthleteSessions,
  createAthleteSession,
  completeAthleteSession,
  logExercise,
  getExerciseLogs,
  getExercises,
  getExerciseById,
  getTeamAnalytics,
  analyzeProgress,
  getPerformanceMetrics,
  submitPerformanceMetric,
  getWellnessAnalytics,
  getTrainingVolume,
  getAdherenceAnalysis
} = api

export default api 