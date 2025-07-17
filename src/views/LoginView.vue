<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl font-bold">🏈</span>
        </div>
        <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">FlagFit Pro</h1>
        <p class="text-gray-600">Elite Flag Football Training Platform</p>
      </div>

      <!-- Login Form -->
      <div class="card p-8 shadow-xl">
        <h2 class="text-2xl font-heading font-bold text-center mb-6">Welcome Back</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              :class="{ 'border-red-500': errors.email }"
              placeholder="Enter your email"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
              :class="{ 'border-red-500': errors.password }"
              placeholder="Enter your password"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
          </div>

          <!-- Error Message -->
          <div v-if="loginError" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-600 text-sm">{{ loginError }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="px-3 text-sm text-gray-500">or</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <p class="text-gray-600">
            Don't have an account?
            <router-link to="/register" class="text-blue-600 hover:text-blue-500 font-medium">
              Sign up here
            </router-link>
          </p>
        </div>
      </div>

      <!-- Demo Mode -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500 mb-2">Demo Mode</p>
        <div class="flex gap-2 justify-center">
          <button
            @click="demoLogin('athlete')"
            class="btn-secondary text-sm px-4 py-2"
          >
            Athlete Demo
          </button>
          <button
            @click="demoLogin('coach')"
            class="btn-secondary text-sm px-4 py-2"
          >
            Coach Demo
          </button>
          <button
            @click="demoLogin('admin')"
            class="btn-secondary text-sm px-4 py-2"
          >
            Admin Demo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// UI state
const loading = ref(false)
const loginError = ref('')
const errors = reactive({
  email: '',
  password: ''
})

// Validation
function validateForm() {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email'
  }
  
  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = 'Password must contain at least one uppercase letter'
  } else if (!/[a-z]/.test(form.password)) {
    errors.password = 'Password must contain at least one lowercase letter'
  } else if (!/\d/.test(form.password)) {
    errors.password = 'Password must contain at least one number'
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
    errors.password = 'Password must contain at least one special character'
  }
  
  return !errors.email && !errors.password
}

// Login handler
async function handleLogin() {
  if (!validateForm()) return
  
  loading.value = true
  loginError.value = ''
  
  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password
    })
    
    if (result.success) {
      // Redirect based on user role
      const role = authStore.user?.role || 'athlete'
      router.push(`/${role}`)
    } else {
      loginError.value = result.error || 'Login failed. Please try again.'
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

// Demo login
function demoLogin(role) {
  localStorage.setItem('userRole', role)
  router.push(`/${role}`)
}
</script> 