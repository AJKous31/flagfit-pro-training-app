<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-3xl font-bold text-blue-600 mb-2">FlagFitPro</div>
    <div class="text-lg text-gray-700 dark:text-gray-200 mb-8 text-center max-w-xs">
      Elite Flag Football Training starts here. Personalize your experience and reach your goals!
    </div>
    <button
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow transition-colors text-lg"
      @click="goToNext"
    >
      Get Started
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goToNext() {
  router.push({ name: 'OnboardingMetric' })
}
</script>

<style scoped>
</style> 