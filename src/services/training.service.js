// Training Service
import { container } from './container.js'
import cacheService from './cache.service.js'

class TrainingService {
  constructor() {
    this.pocketbase = container.resolve('pocketbase')
    this.config = container.resolve('config')
  }

  /**
   * Get training sessions with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} - Array of training sessions
   */
  async getTrainingSessions(filters = {}) {
    const cacheKey = `training:sessions:${JSON.stringify(filters)}`
    const cached = cacheService.get(cacheKey)
    if (cached) return cached

    try {
      const options = {
        page: filters.page || 1,
        perPage: filters.perPage || 50,
        sort: filters.sort || '-created',
        filter: this.buildFilterString(filters)
      }

      const result = await this.pocketbase.getList('training_sessions', options)
      
      if (result.error) {
        throw new Error(result.error)
      }

      cacheService.set(cacheKey, result.data, 2 * 60 * 1000) // 2 minutes
      return result.data
    } catch (error) {
      console.error('Failed to fetch training sessions:', error)
      throw error
    }
  }

  /**
   * Create a new training session
   * @param {Object} sessionData - Training session data
   * @returns {Promise<Object>} - Created session
   */
  async createTrainingSession(sessionData) {
    try {
      const result = await this.pocketbase.create('training_sessions', {
        ...sessionData,
        user_id: this.pocketbase.authStore.model?.id,
        created: new Date().toISOString()
      })

      if (result.error) {
        throw new Error(result.error)
      }

      // Clear related cache
      cacheService.invalidatePattern('training:sessions')
      cacheService.invalidatePattern('training:stats')

      return result.data
    } catch (error) {
      console.error('Failed to create training session:', error)
      throw error
    }
  }

  /**
   * Update a training session
   * @param {string} sessionId - Session ID
   * @param {Object} sessionData - Updated session data
   * @returns {Promise<Object>} - Updated session
   */
  async updateTrainingSession(sessionId, sessionData) {
    try {
      const result = await this.pocketbase.update('training_sessions', sessionId, {
        ...sessionData,
        updated: new Date().toISOString()
      })

      if (result.error) {
        throw new Error(result.error)
      }

      // Clear related cache
      cacheService.invalidatePattern('training:sessions')
      cacheService.invalidatePattern('training:stats')

      return result.data
    } catch (error) {
      console.error('Failed to update training session:', error)
      throw error
    }
  }

  /**
   * Delete a training session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} - Deletion result
   */
  async deleteTrainingSession(sessionId) {
    try {
      const result = await this.pocketbase.delete('training_sessions', sessionId)

      if (result.error) {
        throw new Error(result.error)
      }

      // Clear related cache
      cacheService.invalidatePattern('training:sessions')
      cacheService.invalidatePattern('training:stats')

      return result.data
    } catch (error) {
      console.error('Failed to delete training session:', error)
      throw error
    }
  }

  /**
   * Get training statistics
   * @param {string} timeframe - Timeframe for stats
   * @returns {Promise<Object>} - Training statistics
   */
  async getTrainingStats(timeframe = '7d') {
    const cacheKey = `training:stats:${timeframe}`
    const cached = cacheService.get(cacheKey)
    if (cached) return cached

    try {
      const startDate = this.getStartDateForTimeframe(timeframe)
      const filter = startDate ? `created >= "${startDate.toISOString()}"` : ''
      
      const sessions = await this.getTrainingSessions({ filter })
      
      const stats = {
        totalSessions: sessions.length,
        totalDuration: sessions.reduce((sum, session) => sum + (session.duration || 0), 0),
        averageDuration: sessions.length > 0 ? Math.round(sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / sessions.length) : 0,
        streakDays: this.calculateStreakDays(sessions),
        formattedTotalDuration: this.formatDuration(sessions.reduce((sum, session) => sum + (session.duration || 0), 0)),
        formattedAverageDuration: this.formatDuration(sessions.length > 0 ? Math.round(sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / sessions.length) : 0)
      }

      cacheService.set(cacheKey, stats, 5 * 60 * 1000) // 5 minutes
      return stats
    } catch (error) {
      console.error('Failed to fetch training stats:', error)
      throw error
    }
  }

  /**
   * Get training goals
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} - Array of training goals
   */
  async getTrainingGoals(filters = {}) {
    const cacheKey = `training:goals:${JSON.stringify(filters)}`
    const cached = cacheService.get(cacheKey)
    if (cached) return cached

    try {
      const options = {
        page: filters.page || 1,
        perPage: filters.perPage || 50,
        sort: filters.sort || '-created',
        filter: this.buildFilterString(filters)
      }

      const result = await this.pocketbase.getList('training_goals', options)
      
      if (result.error) {
        throw new Error(result.error)
      }

      cacheService.set(cacheKey, result.data, 5 * 60 * 1000) // 5 minutes
      return result.data
    } catch (error) {
      console.error('Failed to fetch training goals:', error)
      throw error
    }
  }

  /**
   * Create a new training goal
   * @param {Object} goalData - Training goal data
   * @returns {Promise<Object>} - Created goal
   */
  async createTrainingGoal(goalData) {
    try {
      const result = await this.pocketbase.create('training_goals', {
        ...goalData,
        user_id: this.pocketbase.authStore.model?.id,
        created: new Date().toISOString()
      })

      if (result.error) {
        throw new Error(result.error)
      }

      // Clear related cache
      cacheService.invalidatePattern('training:goals')

      return result.data
    } catch (error) {
      console.error('Failed to create training goal:', error)
      throw error
    }
  }

  /**
   * Update a training goal
   * @param {string} goalId - Goal ID
   * @param {Object} goalData - Updated goal data
   * @returns {Promise<Object>} - Updated goal
   */
  async updateTrainingGoal(goalId, goalData) {
    try {
      const result = await this.pocketbase.update('training_goals', goalId, {
        ...goalData,
        updated: new Date().toISOString()
      })

      if (result.error) {
        throw new Error(result.error)
      }

      // Clear related cache
      cacheService.invalidatePattern('training:goals')

      return result.data
    } catch (error) {
      console.error('Failed to update training goal:', error)
      throw error
    }
  }

  /**
   * Delete a training goal
   * @param {string} goalId - Goal ID
   * @returns {Promise<Object>} - Deletion result
   */
  async deleteTrainingGoal(goalId) {
    try {
      const result = await this.pocketbase.delete('training_goals', goalId)

      if (result.error) {
        throw new Error(result.error)
      }

      // Clear related cache
      cacheService.invalidatePattern('training:goals')

      return result.data
    } catch (error) {
      console.error('Failed to delete training goal:', error)
      throw error
    }
  }

  /**
   * Build filter string for PocketBase queries
   * @param {Object} filters - Filter object
   * @returns {string} - Filter string
   */
  buildFilterString(filters) {
    const conditions = []

    if (filters.userId) {
      conditions.push(`user_id = "${filters.userId}"`)
    }

    if (filters.dateFrom) {
      conditions.push(`created >= "${filters.dateFrom}"`)
    }

    if (filters.dateTo) {
      conditions.push(`created <= "${filters.dateTo}"`)
    }

    if (filters.type) {
      conditions.push(`type = "${filters.type}"`)
    }

    if (filters.status) {
      conditions.push(`status = "${filters.status}"`)
    }

    if (filters.filter) {
      conditions.push(filters.filter)
    }

    return conditions.join(' && ')
  }

  /**
   * Subscribe to real-time training session updates
   * @param {Function} callback - Callback function for updates
   * @returns {Function} - Unsubscribe function
   */
  subscribeToTrainingSessions(callback) {
    return this.pocketbase.subscribe('training_sessions', callback)
  }

  /**
   * Subscribe to real-time training goal updates
   * @param {Function} callback - Callback function for updates
   * @returns {Function} - Unsubscribe function
   */
  subscribeToTrainingGoals(callback) {
    return this.pocketbase.subscribe('training_goals', callback)
  }

  /**
   * Calculate streak days from training sessions
   * @param {Array} sessions - Array of training sessions
   * @returns {number} - Number of consecutive days
   */
  calculateStreakDays(sessions) {
    if (!sessions || sessions.length === 0) return 0

    const sortedSessions = sessions
      .map(s => new Date(s.session_date))
      .sort((a, b) => b - a)

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i])
      sessionDate.setHours(0, 0, 0, 0)

      const diffTime = currentDate - sessionDate
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 1) {
        streak++
        currentDate = sessionDate
      } else {
        break
      }
    }

    return streak
  }

  /**
   * Format duration in minutes to human readable format
   * @param {number} minutes - Duration in minutes
   * @returns {string} - Formatted duration (e.g., "2h 30m")
   */
  formatDuration(minutes) {
    if (!minutes || minutes < 1) return '0m'
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours === 0) {
      return `${remainingMinutes}m`
    } else if (remainingMinutes === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${remainingMinutes}m`
    }
  }

  /**
   * Get start date for timeframe
   * @param {string} timeframe - Timeframe string
   * @returns {Date|null} - Start date or null
   */
  getStartDateForTimeframe(timeframe) {
    const now = new Date()
    
    switch (timeframe) {
      case '1d':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000)
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      case 'all':
        return null
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }
  }
}

// Export singleton instance
export const trainingService = new TrainingService() 