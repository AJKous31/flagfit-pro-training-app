<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-2xl font-bold text-blue-600 mb-4">Tell us about yourself</div>
    <form class="w-full max-w-xs space-y-4" @submit.prevent="goToNext">
      <input v-model="name" type="text" placeholder="Name" class="input" required />
      <input v-model.number="age" type="number" min="5" max="100" placeholder="Age" class="input" required />
      <select v-model="gender" class="input" required>
        <option value="" disabled selected>Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <select v-model="position" class="input" required>
        <option value="" disabled selected>Position</option>
        <option>Quarterback</option>
        <option>Receiver</option>
        <option>Running Back</option>
        <option>Defender</option>
        <option>Other</option>
      </select>
      <div class="flex gap-2">
        <input v-model.number="height" type="number" min="50" max="250" :placeholder="`Height (${heightUnit})`" class="input flex-1" required />
        <input v-model.number="weight" type="number" min="20" max="200" :placeholder="`Weight (${weightUnit})`" class="input flex-1" required />
      </div>
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
const name = ref('')
const age = ref('')
const gender = ref('')
const position = ref('')
const height = ref('')
const weight = ref('')
const system = localStorage.getItem('measurementSystem') || 'metric'
const heightUnit = system === 'imperial' ? 'in' : 'cm'
const weightUnit = system === 'imperial' ? 'lbs' : 'kg'
const isValid = computed(() => name.value && age.value && gender.value && position.value && height.value && weight.value)
function goToNext() {
  const userDetails = { name: name.value, age: age.value, gender: gender.value, position: position.value, height: height.value, weight: weight.value, system }
  localStorage.setItem('userDetails', JSON.stringify(userDetails))
  router.push({ name: 'OnboardingGoals' })
}
</script>

<style scoped>
.input {
  @apply bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style> 