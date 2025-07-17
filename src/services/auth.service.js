// Auth Service
import { container } from './container.js'
import cacheService from './cache.service.js'

class AuthService {
  constructor() {
    this.pocketbase = container.resolve('pocketbase')
    this.config = container.resolve('config')
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Registration result
   */
  async register(userData) {
    const cacheKey = `auth:register:${userData.email}`
    const cached = cacheService.get(cacheKey)
    if (cached) return cached

    try {
      const result = await this.pocketbase.signUp(userData)
      cacheService.set(cacheKey, result, 5 * 60 * 1000) // 5 minutes
      return result
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`)
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} - Login result
   */
  async login(credentials) {
    const cacheKey = `auth:login:${credentials.email}`
    const cached = cacheService.get(cacheKey)
    if (cached) return cached

    try {
      const result = await this.pocketbase.signIn(credentials.email, credentials.password)
      cacheService.set(cacheKey, result, 5 * 60 * 1000) // 5 minutes
      return result
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`)
    }
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await this.pocketbase.signOut()
      // Clear auth-related cache
      cacheService.invalidatePattern('auth:')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  /**
   * Get current authenticated user
   * @returns {Promise<Object|null>} - Current user or null
   */
  async getCurrentUser() {
    const cacheKey = 'auth:currentUser'
    const cached = cacheService.get(cacheKey)
    if (cached) return cached

    try {
      const user = await this.pocketbase.getCurrentUser()
      if (user) {
        cacheService.set(cacheKey, user, 2 * 60 * 1000) // 2 minutes
      }
      return user
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Updated user
   */
  async updateProfile(profileData) {
    try {
      const result = await this.pocketbase.updateProfile(profileData)
      // Clear user cache
      cacheService.invalidatePattern('auth:currentUser')
      return result
    } catch (error) {
      throw new Error(`Profile update failed: ${error.message}`)
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @returns {Promise<Object>} - Password change result
   */
  async changePassword(passwordData) {
    try {
      const result = await this.pocketbase.updateProfile({
        password: passwordData.newPassword,
        passwordConfirm: passwordData.newPassword
      })
      return result
    } catch (error) {
      throw new Error(`Password change failed: ${error.message}`)
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} - Reset request result
   */
  async forgotPassword(email) {
    try {
      await this.pocketbase.pb.collection('users').requestPasswordReset(email)
      return { success: true }
    } catch (error) {
      throw new Error(`Password reset request failed: ${error.message}`)
    }
  }

  /**
   * Reset password with token
   * @param {Object} resetData - Reset data with token and new password
   * @returns {Promise<Object>} - Reset result
   */
  async resetPassword(resetData) {
    try {
      await this.pocketbase.pb.collection('users').confirmPasswordReset(
        resetData.token,
        resetData.newPassword,
        resetData.newPassword
      )
      return { success: true }
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`)
    }
  }

  /**
   * Verify email address
   * @param {string} token - Email verification token
   * @returns {Promise<Object>} - Verification result
   */
  async verifyEmail(token) {
    try {
      await this.pocketbase.pb.collection('users').confirmVerification(token)
      return { success: true }
    } catch (error) {
      throw new Error(`Email verification failed: ${error.message}`)
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    return this.pocketbase.isAuthenticated()
  }

  /**
   * Get authentication token
   * @returns {string|null} - Auth token
   */
  getToken() {
    return this.pocketbase.getToken()
  }

  /**
   * Set authentication token
   * @param {string} token - Auth token
   */
  setToken(token) {
    this.pocketbase.setToken(token)
  }

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} - Refresh result
   */
  async refreshToken() {
    try {
      const authData = await this.pocketbase.pb.collection('users').authRefresh()
      return {
        user: authData.record,
        token: authData.token
      }
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`)
    }
  }
}

// Export singleton instance
export const authService = new AuthService()

// Export class for testing
export default AuthService 