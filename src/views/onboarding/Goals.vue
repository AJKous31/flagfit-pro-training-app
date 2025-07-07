<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-2xl font-bold text-blue-600 mb-4">Set Your Training Goals</div>
    <form class="w-full max-w-xs space-y-4" @submit.prevent="goToNext">
      <div>
        <div class="mb-2 text-gray-700 dark:text-gray-200 font-medium">What are your goals?</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="goal in allGoals"
            :key="goal"
            type="button"
            :class="['px-4 py-2 rounded-lg border-2 font-semibold transition', goals.includes(goal) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200']"
            @click="toggleGoal(goal)"
          >
            {{ goal }}
          </button>
        </div>
      </div>
      <input v-model.number="sessions" type="number" min="1" max="14" placeholder="Sessions per week" class="input" required />
      <input v-model="dash" :placeholder="`Best 40-${distanceUnit} dash (${timeUnit})`" class="input" required />
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow transition-colors text-lg w-full disabled:opacity-50"
        :disabled="!isValid"
        type="submit"
      >
        Continue
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const allGoals = ['Speed', 'Endurance', 'Agility', 'Wellness']
const goals = ref([])
const sessions = ref('')
const dash = ref('')
const system = localStorage.getItem('measurementSystem') || 'metric'
const distanceUnit = system === 'imperial' ? 'yard' : 'meter'
const timeUnit = 's'
function toggleGoal(goal) {
  if (goals.value.includes(goal)) {
    goals.value = goals.value.filter(g => g !== goal)
  } else {
    goals.value.push(goal)
  }
}
const isValid = computed(() => goals.value.length && sessions.value && dash.value)
function goToNext() {
  const goalsData = { goals: goals.value, sessions: sessions.value, dash: dash.value, system }
  localStorage.setItem('userGoals', JSON.stringify(goalsData))
  router.push({ name: 'OnboardingSummary' })
}
</script>

<style scoped>
.input {
  @apply bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style> 