import { reactive, computed } from 'vue'
import { pocketbaseService } from '../services/pocketbase.service.js'

// Auth Store
export const useAuthStore = () => {
  const state = reactive({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
  })

  // Computed properties
  const user = computed(() => state.user)
  const loading = computed(() => state.loading)
  const error = computed(() => state.error)
  const isAuthenticated = computed(() => state.isAuthenticated)

  // Actions
  const setLoading = (loading) => {
    state.loading = loading
  }

  const setError = (error) => {
    state.error = error
    setTimeout(() => {
      state.error = null
    }, 5000)
  }

  const setUser = (user) => {
    state.user = user
    state.isAuthenticated = !!user
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await pocketbaseService.signUp(userData)
      setUser(result.user)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await pocketbaseService.signIn(credentials.email, credentials.password)
      setUser(result.user)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    
    try {
      await pocketbaseService.signOut()
      setUser(null)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentUser = async () => {
    setLoading(true)
    
    try {
      const user = await pocketbaseService.getCurrentUser()
      setUser(user)
      return user
    } catch (error) {
      setError(error.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await pocketbaseService.updateProfile(profileData)
      setUser(result.user)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (passwordData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await pocketbaseService.updateProfile({
        password: passwordData.newPassword,
        passwordConfirm: passwordData.newPassword
      })
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email) => {
    setLoading(true)
    setError(null)
    
    try {
      await pocketbaseService.pb.collection('_pb_users_auth_').requestPasswordReset(email)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (resetData) => {
    setLoading(true)
    setError(null)
    
    try {
      await pocketbaseService.pb.collection('_pb_users_auth_').confirmPasswordReset(
        resetData.token,
        resetData.newPassword,
        resetData.newPassword
      )
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const verifyEmail = async (token) => {
    setLoading(true)
    setError(null)
    
    try {
      await pocketbaseService.pb.collection('_pb_users_auth_').confirmVerification(token)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      const authData = await pocketbaseService.pb.collection('_pb_users_auth_').authRefresh()
      setUser(authData.record)
      return authData
    } catch (error) {
      setUser(null)
      throw error
    }
  }

  // Initialize auth state
  const init = async () => {
    try {
      const user = await pocketbaseService.getCurrentUser()
      setUser(user)
    } catch (error) {
      console.error('Auth initialization error:', error)
      setUser(null)
    }
  }

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refreshSession,
    init,
    
    // Utilities
    setLoading,
    setError,
    setUser
  }
} 