<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-2xl font-bold text-blue-600 mb-4">Choose Your Measurement System</div>
    <div class="flex flex-col gap-4 w-full max-w-xs mb-8">
      <button
        :class="['py-4 rounded-lg border-2 font-semibold transition', system === 'metric' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200']"
        @click="select('metric')"
      >
        Metric (kg, meters, Celsius)
      </button>
      <button
        :class="['py-4 rounded-lg border-2 font-semibold transition', system === 'imperial' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200']"
        @click="select('imperial')"
      >
        Imperial (lbs, yards, Fahrenheit)
      </button>
    </div>
    <button
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow transition-colors text-lg disabled:opacity-50"
      :disabled="!system"
      @click="goToNext"
    >
      Continue
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const system = ref('')
function select(val) {
  system.value = val
}
function goToNext() {
  localStorage.setItem('measurementSystem', system.value)
  // Next step: user details
  router.push({ name: 'OnboardingUserDetails' })
}
</script>

<style scoped>
</style> 