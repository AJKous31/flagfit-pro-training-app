<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-2xl font-bold text-blue-600 mb-4">Review Your Profile</div>
    <div class="w-full max-w-xs space-y-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="font-semibold mb-1">Measurement System</div>
        <div class="flex justify-between items-center">
          <span>{{ systemLabel }}</span>
          <button class="text-blue-600 text-sm" @click="edit('OnboardingMetric')">Edit</button>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="font-semibold mb-1">Personal Details</div>
        <div class="text-sm text-gray-700 dark:text-gray-200">
          <div>Name: {{ userDetails.name }}</div>
          <div>Age: {{ userDetails.age }}</div>
          <div>Gender: {{ userDetails.gender }}</div>
          <div>Position: {{ userDetails.position }}</div>
          <div>Height: {{ userDetails.height }} {{ heightUnit }}</div>
          <div>Weight: {{ userDetails.weight }} {{ weightUnit }}</div>
        </div>
        <button class="text-blue-600 text-sm mt-1" @click="edit('OnboardingUserDetails')">Edit</button>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="font-semibold mb-1">Goals</div>
        <div class="text-sm text-gray-700 dark:text-gray-200">
          <div>Goals: {{ userGoals.goals.join(', ') }}</div>
          <div>Sessions per week: {{ userGoals.sessions }}</div>
          <div>Best 40-{{ distanceUnit }} dash: {{ userGoals.dash }} s</div>
        </div>
        <button class="text-blue-600 text-sm mt-1" @click="edit('OnboardingGoals')">Edit</button>
      </div>
    </div>
    <button
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow transition-colors text-lg"
      @click="finish"
    >
      Finish & Go to Dashboard
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const system = localStorage.getItem('measurementSystem') || 'metric'
const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}')
const userGoals = JSON.parse(localStorage.getItem('userGoals') || '{}')
const systemLabel = system === 'imperial' ? 'Imperial (lbs, yards, Fahrenheit)' : 'Metric (kg, meters, Celsius)'
const heightUnit = system === 'imperial' ? 'in' : 'cm'
const weightUnit = system === 'imperial' ? 'lbs' : 'kg'
const distanceUnit = system === 'imperial' ? 'yard' : 'meter'
function edit(routeName) {
  router.push({ name: routeName })
}
function finish() {
  localStorage.setItem('onboardingComplete', 'true')
  router.push('/')
}
</script>

<style scoped>
</style> 