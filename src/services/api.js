import { createClient } from '@supabase/supabase-js'
import fetch from 'cross-fetch'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

supabase.setFetch(fetch)

// API Service Class
class ApiService {
  constructor() {
    this.supabase = supabase
  }

  // Authentication Endpoints
  async register(userData) {
    const { data, error } = await this.supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          team_id: userData.teamId
        }
      }
    })
    
    if (error) throw error
    return data
  }

  async login(email, password) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // User Profile Management
  async getAthleteProfile(athleteId) {
    const { data, error } = await this.supabase
      .from('athlete_profiles')
      .select(`
        *,
        users!inner(*)
      `)
      .eq('user_id', athleteId)
      .single()
    
    if (error) throw error
    return data
  }

  async updateAthleteProfile(athleteId, profileData) {
    const { data, error } = await this.supabase
      .from('athlete_profiles')
      .update(profileData)
      .eq('user_id', athleteId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getAthleteProgress(athleteId) {
    const { data, error } = await this.supabase
      .from('training_logs')
      .select(`
        *,
        exercise:exercises(
          *,
          category:exercise_categories(*)
        ),
        training_sessions(*)
      `)
      .eq('athlete_id', athleteId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async submitAssessment(athleteId, assessmentData) {
    const { data, error } = await this.supabase
      .from('athlete_assessments')
      .insert({
        athlete_id: athleteId,
        ...assessmentData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Training Programs
  async getTrainingPrograms() {
    const { data, error } = await this.supabase
      .from('training_programs')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  async getTrainingProgram(programId) {
    const { data, error } = await this.supabase
      .from('training_programs')
      .select(`
        *,
        weekly_templates(*)
      `)
      .eq('id', programId)
      .single()
    
    if (error) throw error
    return data
  }

  async assignProgramToAthlete(programId, athleteId) {
    const { data, error } = await this.supabase
      .from('athlete_programs')
      .insert({
        program_id: programId,
        athlete_id: athleteId,
        start_date: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getCurrentAthleteProgram(athleteId) {
    const { data, error } = await this.supabase
      .from('athlete_programs')
      .select(`
        *,
        training_programs(*)
      `)
      .eq('athlete_id', athleteId)
      .eq('status', 'active')
      .single()
    
    if (error) throw error
    return data
  }

  // Daily Sessions
  async getTodaySession(athleteId) {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await this.supabase
      .from('training_sessions')
      .select(`
        *,
        daily_session:daily_sessions(
          *,
          session_exercises(
            *,
            exercise:exercises(
              *,
              category:exercise_categories(*)
            )
          )
        )
      `)
      .eq('athlete_id', athleteId)
      .gte('scheduled_date', today)
      .lte('scheduled_date', today)
      .single()
    
    if (error) throw error
    return data
  }

  async getDailySessionTemplate(weeklyTemplateId, dayOfWeek) {
    const { data, error } = await this.supabase
      .from('daily_sessions')
      .select(`
        *,
        session_exercises(
          *,
          exercise:exercises(
            *,
            category:exercise_categories(*)
          )
        )
      `)
      .eq('weekly_template_id', weeklyTemplateId)
      .eq('day_of_week', dayOfWeek)
      .single()
    
    if (error) throw error
    return data
  }

  async getWeeklySessionTemplates(weeklyTemplateId) {
    const { data, error } = await this.supabase
      .from('daily_sessions')
      .select(`
        *,
        session_exercises(
          *,
          exercises(*)
        )
      `)
      .eq('weekly_template_id', weeklyTemplateId)
      .order('day_of_week')
    
    if (error) throw error
    return data
  }

  async createAthleteSession(athleteId, dailySessionId, scheduledDate) {
    const { data, error } = await this.supabase
      .from('training_sessions')
      .insert({
        athlete_id: athleteId,
        daily_session_id: dailySessionId,
        scheduled_date: scheduledDate,
        status: 'scheduled'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getAthleteWeeklySchedule(athleteId, startDate) {
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 7)
    
    const { data, error } = await this.supabase
      .from('training_sessions')
      .select(`
        *,
        daily_sessions(
          *,
          session_exercises(
            *,
            exercises(*)
          )
        )
      `)
      .eq('athlete_id', athleteId)
      .gte('scheduled_date', startDate)
      .lt('scheduled_date', endDate.toISOString().split('T')[0])
      .order('scheduled_date')
    
    if (error) throw error
    return data
  }

  async getSession(sessionId) {
    const { data, error } = await this.supabase
      .from('training_sessions')
      .select(`
        *,
        exercises(*)
      `)
      .eq('id', sessionId)
      .single()
    
    if (error) throw error
    return data
  }

  async completeSession(sessionId, completionData) {
    const { data, error } = await this.supabase
      .from('training_sessions')
      .update({
        completed: true,
        completion_time: new Date().toISOString(),
        ...completionData
      })
      .eq('id', sessionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async logSessionExercise(sessionId, exerciseData) {
    const { data, error } = await this.supabase
      .from('training_logs')
      .insert({
        session_id: sessionId,
        ...exerciseData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Exercises and Drills
  async getExercises(filters = {}) {
    let query = this.supabase
      .from('exercises')
      .select(`
        *,
        category:exercise_categories(*)
      `)
      .eq('is_active', true)
    
    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }
    
    if (filters.position) {
      query = query.contains('position_specific', [filters.position])
    }
    
    if (filters.difficulty) {
      query = query.eq('difficulty_level', filters.difficulty)
    }
    
    if (filters.equipment) {
      query = query.contains('equipment_needed', [filters.equipment])
    }
    
    const { data, error } = await query.order('name')
    
    if (error) throw error
    return data
  }

  async getExerciseCategories() {
    const { data, error } = await this.supabase
      .from('exercise_categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  async getExerciseById(exerciseId) {
    const { data, error } = await this.supabase
      .from('exercises')
      .select(`
        *,
        category:exercise_categories(*)
      `)
      .eq('id', exerciseId)
      .single()
    
    if (error) throw error
    return data
  }

  // Session Exercises
  async getSessionExercises(sessionId) {
    const { data, error } = await this.supabase
      .from('session_exercises')
      .select(`
        *,
        exercise:exercises(
          *,
          category:exercise_categories(*)
        )
      `)
      .eq('session_id', sessionId)
      .order('order_in_session')
    
    if (error) throw error
    return data
  }

  // Daily Sessions
  async getDailySessions(weeklyTemplateId) {
    const { data, error } = await this.supabase
      .from('daily_sessions')
      .select(`
        *,
        session_exercises(
          *,
          exercise:exercises(
            *,
            category:exercise_categories(*)
          )
        )
      `)
      .eq('weekly_template_id', weeklyTemplateId)
      .order('day_of_week')
    
    if (error) throw error
    return data
  }

  async getDailySession(sessionId) {
    const { data, error } = await this.supabase
      .from('daily_sessions')
      .select(`
        *,
        session_exercises(
          *,
          exercise:exercises(
            *,
            category:exercise_categories(*)
          )
        )
      `)
      .eq('id', sessionId)
      .single()
    
    if (error) throw error
    return data
  }

  // Athlete Programs
  async getAthletePrograms(athleteId) {
    const { data, error } = await this.supabase
      .from('athlete_programs')
      .select(`
        *,
        training_programs(*)
      `)
      .eq('athlete_id', athleteId)
      .order('assigned_date', { ascending: false })
    
    if (error) throw error
    return data
  }

  async assignProgramToAthlete(athleteId, programId, assignedBy) {
    const { data, error } = await this.supabase
      .from('athlete_programs')
      .insert({
        athlete_id: athleteId,
        program_id: programId,
        assigned_by: assignedBy,
        start_date: new Date().toISOString().split('T')[0],
        status: 'active'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateProgramStatus(programId, status) {
    const { data, error } = await this.supabase
      .from('athlete_programs')
      .update({ status })
      .eq('id', programId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Athlete Sessions
  async getAthleteSessions(athleteId, startDate, endDate) {
    let query = this.supabase
      .from('athlete_sessions')
      .select(`
        *,
        session:daily_sessions(
          *,
          session_exercises(
            *,
            exercise:exercises(
              *,
              category:exercise_categories(*)
            )
          )
        )
      `)
      .eq('athlete_id', athleteId)
    
    if (startDate) {
      query = query.gte('scheduled_date', startDate)
    }
    if (endDate) {
      query = query.lte('scheduled_date', endDate)
    }
    
    const { data, error } = await query.order('scheduled_date', { ascending: false })
    
    if (error) throw error
    return data
  }

  async createAthleteSession(athleteId, sessionData) {
    const { data, error } = await this.supabase
      .from('athlete_sessions')
      .insert({
        athlete_id: athleteId,
        ...sessionData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async completeAthleteSession(sessionId, completionData) {
    const { data, error } = await this.supabase
      .from('athlete_sessions')
      .update({
        completed_date: new Date().toISOString(),
        ...completionData
      })
      .eq('id', sessionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Exercise Logs
  async getExerciseLogs(sessionId) {
    const { data, error } = await this.supabase
      .from('exercise_logs')
      .select(`
        *,
        exercise:exercises(
          *,
          category:exercise_categories(*)
        )
      `)
      .eq('athlete_session_id', sessionId)
      .order('created_at')
    
    if (error) throw error
    return data
  }

  async logExercise(sessionId, exerciseData) {
    const { data, error } = await this.supabase
      .from('exercise_logs')
      .insert({
        athlete_session_id: sessionId,
        ...exerciseData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateExerciseLog(logId, updateData) {
    const { data, error } = await this.supabase
      .from('exercise_logs')
      .update(updateData)
      .eq('id', logId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Performance Metrics
  async getPerformanceMetrics(athleteId, metricType = null, timeRange = '30d') {
    let query = this.supabase
      .from('performance_metrics')
      .select('*')
      .eq('athlete_id', athleteId)
      .gte('test_date', this.getDateRange(timeRange))
    
    if (metricType) {
      query = query.eq('metric_type', metricType)
    }
    
    const { data, error } = await query.order('test_date', { ascending: false })
    
    if (error) throw error
    return data
  }

  async submitPerformanceMetric(athleteId, metricData) {
    const { data, error } = await this.supabase
      .from('performance_metrics')
      .insert({
        athlete_id: athleteId,
        ...metricData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Wellness Logs
  async getWellnessLogs(athleteId, startDate, endDate) {
    let query = this.supabase
      .from('wellness_logs')
      .select('*')
      .eq('athlete_id', athleteId)
    
    if (startDate) {
      query = query.gte('log_date', startDate)
    }
    if (endDate) {
      query = query.lte('log_date', endDate)
    }
    
    const { data, error } = await query.order('log_date', { ascending: false })
    
    if (error) throw error
    return data
  }

  async submitWellnessLog(athleteId, wellnessData) {
    const { data, error } = await this.supabase
      .from('wellness_logs')
      .insert({
        athlete_id: athleteId,
        log_date: new Date().toISOString().split('T')[0],
        ...wellnessData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Recovery Routines
  async getRecoveryRoutines(category = null) {
    let query = this.supabase
      .from('recovery_routines')
      .select(`
        *,
        recovery_exercises(*)
      `)
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query.order('name')
    
    if (error) throw error
    return data
  }

  async getRecoveryRoutine(routineId) {
    const { data, error } = await this.supabase
      .from('recovery_routines')
      .select(`
        *,
        recovery_exercises(*)
      `)
      .eq('id', routineId)
      .single()
    
    if (error) throw error
    return data
  }

  // Program Generation and Analysis
  async generateTrainingProgram(athleteId, questionnaireResponses) {
    // This would integrate with the TrainingProgramGenerator class
    // For now, return a basic program assignment
    const baseProgram = await this.getTrainingPrograms()
    const selectedProgram = baseProgram.find(p => p.target_level === 'beginner')
    
    if (!selectedProgram) {
      throw new Error('No suitable program found')
    }
    
    return await this.assignProgramToAthlete(athleteId, selectedProgram.id, null)
  }

  async analyzeProgress(athleteId, timeframe = '4weeks') {
    // This would integrate with the ProgressAnalyzer class
    const metrics = await this.getPerformanceMetrics(athleteId, null, timeframe)
    const sessions = await this.getAthleteSessions(athleteId)
    
    // Basic analysis
    const analysis = {
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.completed_date).length,
      adherence: sessions.filter(s => s.completed_date).length / Math.max(sessions.length, 1),
      recentMetrics: metrics.slice(0, 5),
      recommendations: []
    }
    
    // Generate basic recommendations
    if (analysis.adherence < 0.8) {
      analysis.recommendations.push({
        type: 'adherence',
        message: 'Consider reducing training volume or adjusting schedule',
        priority: 'high'
      })
    }
    
    return analysis
  }

  async suggestProgression(athleteId, exerciseId) {
    const recentLogs = await this.supabase
      .from('exercise_logs')
      .select('*')
      .eq('exercise_id', exerciseId)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (recentLogs.error) throw recentLogs.error
    
    const logs = recentLogs.data
    if (logs.length === 0) {
      return { action: 'maintain', reason: 'No previous data' }
    }
    
    const successRate = logs.filter(log => log.completed).length / logs.length
    const averageRating = logs.reduce((sum, log) => sum + (log.difficulty_rating || 3), 0) / logs.length
    
    if (successRate >= 0.9 && averageRating < 3) {
      return { action: 'progress', reason: 'High success rate, low difficulty' }
    } else if (successRate < 0.7) {
      return { action: 'regress', reason: 'Low success rate' }
    }
    
    return { action: 'maintain', reason: 'Appropriate challenge level' }
  }

  // Recovery Routines
  async getRecoveryRoutines() {
    const { data, error } = await this.supabase
      .from('recovery_routines')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  async getRecoveryRoutine(routineId) {
    const { data, error } = await this.supabase
      .from('recovery_routines')
      .select(`
        *,
        recovery_exercises(*)
      `)
      .eq('id', routineId)
      .single()
    
    if (error) throw error
    return data
  }

  async logRecoverySession(athleteId, recoveryData) {
    const { data, error } = await this.supabase
      .from('recovery_logs')
      .insert({
        athlete_id: athleteId,
        ...recoveryData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Progress Tracking
  async getAthleteMetrics(athleteId, timeRange = '30d') {
    const { data, error } = await this.supabase
      .from('training_logs')
      .select(`
        *,
        exercise:exercises(
          *,
          category:exercise_categories(*)
        )
      `)
      .eq('athlete_id', athleteId)
      .gte('created_at', this.getDateRange(timeRange))
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async submitMetrics(athleteId, metricsData) {
    const { data, error } = await this.supabase
      .from('athlete_metrics')
      .insert({
        athlete_id: athleteId,
        ...metricsData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getTeamAnalytics(teamId) {
    const { data, error } = await this.supabase
      .from('athlete_profiles')
      .select(`
        *,
        users!inner(*),
        training_logs(*)
      `)
      .eq('team_id', teamId)
    
    if (error) throw error
    return data
  }

  // Questionnaire and Program Generation
  async submitQuestionnaire(athleteId, questionnaireData) {
    const { data, error } = await this.supabase
      .from('athlete_questionnaires')
      .insert({
        athlete_id: athleteId,
        ...questionnaireData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getGeneratedProgram(athleteId) {
    const { data, error } = await this.supabase
      .from('athlete_programs')
      .select(`
        *,
        training_programs(*)
      `)
      .eq('athlete_id', athleteId)
      .eq('is_generated', true)
      .single()
    
    if (error) throw error
    return data
  }

  async customizeProgram(programId, customizations) {
    const { data, error } = await this.supabase
      .from('training_programs')
      .update(customizations)
      .eq('id', programId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Utility Methods
  getDateRange(timeRange) {
    const now = new Date()
    switch (timeRange) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Export individual methods for convenience
export const {
  register,
  login,
  logout,
  getCurrentUser,
  getAthleteProfile,
  updateAthleteProfile,
  getAthleteProgress,
  submitAssessment,
  getTrainingPrograms,
  getTrainingProgram,
  assignProgramToAthlete,
  getCurrentAthleteProgram,
  getTodaySession,
  getDailySessionTemplate,
  getWeeklySessionTemplates,
  createAthleteSession,
  getAthleteWeeklySchedule,
  getSession,
  completeSession,
  logSessionExercise,
  getExercises,
  getExerciseCategories,
  getExerciseById,
  getWellnessLogs,
  submitWellnessLog,
  getRecoveryRoutines,
  getRecoveryRoutine,
  logRecoverySession,
  getAthleteMetrics,
  submitMetrics,
  getTeamAnalytics,
  submitQuestionnaire,
  getGeneratedProgram,
  customizeProgram
} = apiService 