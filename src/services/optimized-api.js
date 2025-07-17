import { pocketbaseService } from './pocketbase.service.js'

/**
 * Optimized API Service with advanced caching and performance features
 */
class OptimizedApiService {
  constructor() {
    this.pocketbase = pocketbaseService
    this.config = {
      pocketbaseUrl: import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090',
      apiTimeout: 30000,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      maxRetries: 3
    }
  }

  /**
   * Get exercises with advanced filtering and pagination
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} - Exercises with metadata
   */
  async getExercises(filters = {}) {
    const cacheKey = `exercises:${JSON.stringify(filters)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const options = {
        page: filters.page || 1,
        perPage: filters.perPage || 50,
        sort: filters.sort || '-created',
        filter: this.buildExerciseFilter(filters)
      }

      const result = await this.pocketbase.getList('exercises', options)
      
      if (result.error) {
        throw new Error(result.error)
      }

      const response = {
        data: result.data,
        count: result.count,
        page: filters.page || 1,
        perPage: filters.perPage || 50,
        totalPages: Math.ceil(result.count / (filters.perPage || 50))
      }

      this.setCache(cacheKey, response, this.config.cacheTTL)
      return response
    } catch (error) {
      console.error('Failed to fetch exercises:', error)
      throw error
    }
  }

  /**
   * Get training logs with performance optimizations
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} - Training logs with metadata
   */
  async getTrainingLogs(filters = {}) {
    const cacheKey = `training_logs:${JSON.stringify(filters)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const options = {
        page: filters.page || 1,
        perPage: filters.perPage || 50,
        sort: filters.sort || '-created',
        filter: this.buildTrainingLogFilter(filters)
      }

      const result = await this.pocketbase.getList('training_logs', options)
      
      if (result.error) {
        throw new Error(result.error)
      }

      const response = {
        data: result.data,
        count: result.count,
        page: filters.page || 1,
        perPage: filters.perPage || 50,
        totalPages: Math.ceil(result.count / (filters.perPage || 50))
      }

      this.setCache(cacheKey, response, this.config.cacheTTL)
      return response
    } catch (error) {
      console.error('Failed to fetch training logs:', error)
      throw error
    }
  }

  /**
   * Get athlete profiles with caching
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} - Athlete profiles
   */
  async getAthleteProfiles(filters = {}) {
    const cacheKey = `athlete_profiles:${JSON.stringify(filters)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const options = {
        page: filters.page || 1,
        perPage: filters.perPage || 50,
        sort: filters.sort || '-created',
        filter: this.buildProfileFilter(filters)
      }

      const result = await this.pocketbase.getList('athlete_profiles', options)
      
      if (result.error) {
        throw new Error(result.error)
      }

      this.setCache(cacheKey, result.data, this.config.cacheTTL)
      return result.data
    } catch (error) {
      console.error('Failed to fetch athlete profiles:', error)
      throw error
    }
  }

  /**
   * Get training sessions with advanced querying
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} - Training sessions
   */
  async getTrainingSessions(filters = {}) {
    const cacheKey = `training_sessions:${JSON.stringify(filters)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const options = {
        page: filters.page || 1,
        perPage: filters.perPage || 50,
        sort: filters.sort || '-created',
        filter: this.buildSessionFilter(filters)
      }

      const result = await this.pocketbase.getList('training_sessions', options)
      
      if (result.error) {
        throw new Error(result.error)
      }

      this.setCache(cacheKey, result.data, this.config.cacheTTL)
      return result.data
    } catch (error) {
      console.error('Failed to fetch training sessions:', error)
      throw error
    }
  }

  /**
   * Build exercise filter string
   * @param {Object} filters - Filter object
   * @returns {string} - Filter string
   */
  buildExerciseFilter(filters) {
    const conditions = []

    if (filters.category) {
      conditions.push(`category = "${filters.category}"`)
    }

    if (filters.difficulty) {
      conditions.push(`difficulty = "${filters.difficulty}"`)
    }

    if (filters.equipment) {
      conditions.push(`equipment = "${filters.equipment}"`)
    }

    if (filters.search) {
      conditions.push(`name ~ "${filters.search}"`)
    }

    return conditions.join(' && ')
  }

  /**
   * Build training log filter string
   * @param {Object} filters - Filter object
   * @returns {string} - Filter string
   */
  buildTrainingLogFilter(filters) {
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

    if (filters.exerciseId) {
      conditions.push(`exercise_id = "${filters.exerciseId}"`)
    }

    return conditions.join(' && ')
  }

  /**
   * Build profile filter string
   * @param {Object} filters - Filter object
   * @returns {string} - Filter string
   */
  buildProfileFilter(filters) {
    const conditions = []

    if (filters.userId) {
      conditions.push(`user_id = "${filters.userId}"`)
    }

    if (filters.teamId) {
      conditions.push(`team_id = "${filters.teamId}"`)
    }

    if (filters.position) {
      conditions.push(`position = "${filters.position}"`)
    }

    return conditions.join(' && ')
  }

  /**
   * Build session filter string
   * @param {Object} filters - Filter object
   * @returns {string} - Filter string
   */
  buildSessionFilter(filters) {
    const conditions = []

    if (filters.userId) {
      conditions.push(`user_id = "${filters.userId}"`)
    }

    if (filters.dateFrom) {
      conditions.push(`session_date >= "${filters.dateFrom}"`)
    }

    if (filters.dateTo) {
      conditions.push(`session_date <= "${filters.dateTo}"`)
    }

    if (filters.type) {
      conditions.push(`type = "${filters.type}"`)
    }

    if (filters.status) {
      conditions.push(`status = "${filters.status}"`)
    }

    return conditions.join(' && ')
  }

  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @returns {any} - Cached data or null
   */
  getFromCache(key) {
    try {
      const cached = localStorage.getItem(key)
      if (cached) {
        const { data, expiry } = JSON.parse(cached)
        if (expiry > Date.now()) {
          return data
        }
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.error('Cache read error:', error)
    }
    return null
  }

  /**
   * Set data in cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  setCache(key, data, ttl) {
    try {
      const cacheData = {
        data,
        expiry: Date.now() + ttl
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Cache write error:', error)
    }
  }

  /**
   * Clear cache by pattern
   * @param {string} pattern - Pattern to match keys
   */
  clearCache(pattern) {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.includes(pattern)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }

  /**
   * Invalidate cache for specific resource
   * @param {string} resource - Resource name
   */
  invalidateCache(resource) {
    this.clearCache(resource)
  }
}

// Export singleton instance
export const optimizedApiService = new OptimizedApiService() 