import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/api.js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const profile = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const refreshToken = ref(localStorage.getItem('refresh_token'))
  const isAuthenticated = ref(false)
  const permissions = ref([])
  const loading = ref(false)

  // Getters
  const isCoach = computed(() => user.value?.role === 'coach')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isAthlete = computed(() => user.value?.role === 'athlete')
  const hasPermission = computed(() => (permission) => permissions.value.includes(permission))

  // Actions
  async function login(credentials) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) throw error

      await setAuth(data)
      await fetchProfile()
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
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

      await setAuth(data)
      await fetchProfile()
      
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  async function setAuth(authData) {
    user.value = authData.user
    token.value = authData.session?.access_token
    refreshToken.value = authData.session?.refresh_token
    isAuthenticated.value = !!authData.user

    if (token.value) {
      localStorage.setItem('auth_token', token.value)
    }
    if (refreshToken.value) {
      localStorage.setItem('refresh_token', refreshToken.value)
    }

    // Set permissions based on role
    if (user.value?.role === 'admin') {
      permissions.value = ['read:all', 'write:all', 'delete:all']
    } else if (user.value?.role === 'coach') {
      permissions.value = ['read:team', 'write:team', 'read:programs']
    } else if (user.value?.role === 'athlete') {
      permissions.value = ['read:own', 'write:own', 'read:programs']
    }
  }

  async function fetchProfile() {
    if (!user.value) return

    try {
      const { data, error } = await supabase
        .from('athlete_profiles')
        .select('*')
        .eq('user_id', user.value.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      profile.value = data
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  async function updateProfile(profileData) {
    if (!user.value) return

    try {
      const { data, error } = await supabase
        .from('athlete_profiles')
        .upsert({
          user_id: user.value.id,
          ...profileData
        })
        .select()
        .single()

      if (error) throw error
      
      profile.value = data
      return { success: true, data }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { success: false, error: error.message }
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
    }
  }

  function clearAuth() {
    user.value = null
    profile.value = null
    token.value = null
    refreshToken.value = null
    isAuthenticated.value = false
    permissions.value = []

    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  async function refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      
      await setAuth(data)
      return { success: true }
    } catch (error) {
      console.error('Session refresh error:', error)
      clearAuth()
      return { success: false, error: error.message }
    }
  }

  async function checkAuth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      if (session) {
        await setAuth({ user: session.user, session })
        await fetchProfile()
      }
    } catch (error) {
      console.error('Auth check error:', error)
      clearAuth()
    }
  }

  // Initialize auth state
  checkAuth()

  return {
    // State
    user: computed(() => user.value),
    profile: computed(() => profile.value),
    token: computed(() => token.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    permissions: computed(() => permissions.value),
    loading: computed(() => loading.value),

    // Getters
    isCoach,
    isAdmin,
    isAthlete,
    hasPermission,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    refreshSession,
    checkAuth
  }
}) 