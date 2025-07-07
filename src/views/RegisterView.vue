<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl font-bold">🏈</span>
        </div>
        <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">FlagFit Pro</h1>
        <p class="text-gray-600">Join the Elite Training Platform</p>
      </div>

      <!-- Registration Form -->
      <div class="card p-8 shadow-xl">
        <h2 class="text-2xl font-heading font-bold text-center mb-6">Create Account</h2>
        
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Role Selection -->
          <div>
            <label class="form-label">I am a:</label>
            <div class="grid grid-cols-3 gap-3">
              <label
                v-for="role in roles"
                :key="role.value"
                class="relative cursor-pointer"
              >
                <input
                  v-model="form.role"
                  type="radio"
                  :value="role.value"
                  class="sr-only"
                />
                <div
                  class="border-2 rounded-lg p-4 text-center transition-colors"
                  :class="form.role === role.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <div class="text-2xl mb-2">{{ role.icon }}</div>
                  <div class="text-sm font-medium">{{ role.label }}</div>
                </div>
              </label>
            </div>
            <p v-if="errors.role" class="text-red-500 text-sm mt-1">{{ errors.role }}</p>
          </div>

          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="form-label">First Name</label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.firstName }"
                placeholder="First name"
              />
              <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
            </div>
            <div>
              <label for="lastName" class="form-label">Last Name</label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.lastName }"
                placeholder="Last name"
              />
              <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
            </div>
          </div>

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

          <!-- Password Fields -->
          <div>
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
              :class="{ 'border-red-500': errors.password }"
              placeholder="Create a password"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <div>
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="form-input"
              :class="{ 'border-red-500': errors.confirmPassword }"
              placeholder="Confirm your password"
            />
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label class="ml-2 text-sm text-gray-600">
              I agree to the
              <a href="#" class="text-blue-600 hover:text-blue-500">Terms of Service</a>
              and
              <a href="#" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="registerError" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-600 text-sm">{{ registerError }}</p>
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
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="px-3 text-sm text-gray-500">or</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-gray-600">
            Already have an account?
            <router-link to="/login" class="text-blue-600 hover:text-blue-500 font-medium">
              Sign in here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import * as tf from '@tensorflow/tfjs'
import { predictIntensity } from '@/services/ai'
import { useAthleteStore } from '@/stores/athlete'

const router = useRouter()
const authStore = useAuthStore()
const athleteStore = useAthleteStore()

// Available roles
const roles = [
  { value: 'athlete', label: 'Athlete', icon: '🏃‍♂️' },
  { value: 'coach', label: 'Coach', icon: '👨‍💼' },
  { value: 'admin', label: 'Admin', icon: '⚙️' }
]

// Form state
const form = reactive({
  role: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

// UI state
const loading = ref(false)
const registerError = ref('')
const errors = reactive({
  role: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const intensity = ref(null)
const recommendations = ref([])

// Validation
function validateForm() {
  errors.role = ''
  errors.firstName = ''
  errors.lastName = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  
  if (!form.role) {
    errors.role = 'Please select a role'
  }
  
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
  }
  
  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
  }
  
  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email'
  }
  
  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
  
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }
  
  if (!form.acceptTerms) {
    registerError.value = 'Please accept the terms and conditions'
    return false
  }
  
  return !Object.values(errors).some(error => error) && !registerError.value
}

// Register handler
async function handleRegister() {
  if (!validateForm()) return
  
  loading.value = true
  registerError.value = ''
  
  try {
    const result = await authStore.register({
      role: form.role,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password
    })
    
    if (result.success) {
      // Redirect based on user role
      router.push(`/${form.role}`)
    } else {
      registerError.value = result.error || 'Registration failed. Please try again.'
    }
  } catch (error) {
    console.error('Registration error:', error)
    registerError.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

// Example: TensorFlow.js model for intensity
const model = await tf.loadLayersModel('/models/intensity-model/model.json')

function adjustWorkout(intensity, fatigue, equipmentAvailable) {
  if (intensity < 4) return { substitute: 'Mobility/Recovery', protocol: 'Active Recovery' }
  if (!equipmentAvailable) return { substitute: 'Bodyweight Circuit', protocol: 'No Equipment' }
  // ...more rules
}

function getCoachingCues(position, metrics) {
  const cues = {
    QB: ['Focus on release speed', 'Work on footwork'],
    WR: ['Emphasize route sharpness', 'Acceleration drills'],
    // ...
  }
  return cues[position]
}

onMounted(async () => {
  await athleteStore.fetchLatestData()
  const data = athleteStore.latestData
  // Example input: [sleep, hrv, rpe, load, weather_code, equipment]
  const input = [
    data.sleep_hours, data.hrv, data.rpe_score, data.training_load, data.weather_code, data.equipment_available ? 1 : 0
  ]
  intensity.value = await predictIntensity(input)
  recommendations.value = generateRecommendations(intensity.value, data)
})

function generateRecommendations(intensity, data) {
  // Real-time adjustment
  let recs = []
  if (intensity < 4) recs.push('Active Recovery or Rest Day recommended')
  if (!data.equipment_available) recs.push('Try bodyweight or mobility exercises')
  // Position-specific
  if (data.position === 'QB') recs.push('Focus on footwork and release drills')
  // ...more
  return recs
}

async function logEngagement(accepted) {
  await fetch('http://localhost:3001/api/athlete/recommendation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      athlete_id: 'YOUR_ATHLETE_ID', // Replace with real ID
      log_date: new Date().toISOString().slice(0,10),
      recommendation_type: 'intensity',
      recommendation_value: intensity.value,
      accepted,
      engagement_score: accepted ? 1 : 0
    })
  })
  alert('Engagement logged!')
}
</script> 