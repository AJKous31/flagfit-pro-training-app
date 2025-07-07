<template>
  <div class="max-w-[1200px] mx-auto px-4 py-6">
    <div class="flex justify-end p-4">
      <button @click="restartOnboarding" class="text-sm text-blue-600 border border-blue-600 rounded px-3 py-1 hover:bg-blue-50">Restart Onboarding</button>
    </div>
    <!-- Breadcrumbs (desktop only) -->
    <Breadcrumbs :crumbs="[
      { label: 'Home', href: '/' },
      { label: 'Dashboard' }
    ]" />
    <!-- Clickable FlagFitPro logo -->
    <div class="flex items-center gap-3 mb-4">
      <router-link :to="homeRoute" class="text-2xl font-bold text-blue-600 dark:text-blue-400" style="cursor:pointer">FlagFitPro</router-link>
    </div>

    <!-- Pull to Refresh (mobile only) -->
    <PullToRefresh @refresh="refreshData">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <img :src="playerImg" alt="Player avatar" class="w-12 h-12 rounded-full border-2 border-green-600" />
          <div>
            <span class="label block">FlagFit Pro</span>
            <h1 class="text-2xl font-display font-bold">Good morning, Alex! 🏃‍♂️</h1>
          </div>
        </div>
        <ContextMenu :items="quickActions" @select="handleAction" />
      </div>

      <!-- Today's Focus Card -->
      <div class="card bg-primary text-surface mb-6 flex flex-col items-start shadow-xl rounded-xl p-8">
        <div class="text-lg font-heading mb-2">TODAY'S FOCUS</div>
        <div class="text-2xl font-display font-bold mb-1 flex items-center gap-2">
          ⚡ High Intensity Training
        </div>
        <div class="flex items-center gap-4 mb-4 text-lg font-body">
          <span>📊 3 exercises</span>
          <span>• 45 min</span>
          <span>• 🔥 Advanced</span>
        </div>
        <button class="btn-primary text-lg font-label px-8 py-4 mt-2 shadow-xl rounded-xl hover:bg-accent/90 transition">
          START WORKOUT
        </button>
      </div>

      <!-- Quick Stats Bento Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="card flex flex-col items-center bg-surface2 shadow-card rounded-card">
          <span class="text-3xl mb-1">🏃‍♂️</span>
          <span class="font-heading text-lg text-primary">Speed</span>
          <ProgressRing :progress="82" :size="64" />
          <span class="caption text-success flex items-center gap-1">+0.3 <span aria-label="up">↗️</span></span>
        </div>
        <div class="card flex flex-col items-center bg-surface2 shadow-card rounded-card">
          <span class="text-3xl mb-1">⚡</span>
          <span class="font-heading text-lg text-primary">Agility</span>
          <ProgressRing :progress="94" :size="64" color="#F59E0B" />
          <span class="caption text-success flex items-center gap-1">+2% <span aria-label="up">↗️</span></span>
        </div>
        <div class="card flex flex-col items-center bg-surface2 shadow-card rounded-card">
          <span class="text-3xl mb-1">💪</span>
          <span class="font-heading text-lg text-primary">Strength</span>
          <ProgressRing :progress="70" :size="64" color="#EF4444" />
          <span class="caption text-success flex items-center gap-1">+1 <span aria-label="up">↗️</span></span>
        </div>
      </div>

      <!-- Wellness Tracker Section -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-heading text-xl text-text-primary">WELLNESS TRACKER</h2>
          <button 
            @click="showWellnessTracker = !showWellnessTracker"
            class="btn-secondary text-sm px-4 py-2 rounded-btn"
          >
            {{ showWellnessTracker ? 'Hide' : 'Show' }} Wellness
          </button>
        </div>
        
        <div v-if="showWellnessTracker" class="card bg-surface shadow-card rounded-card overflow-hidden">
          <WellnessTracker />
        </div>
      </div>

      <!-- Drill Library -->
      <div class="mb-20">
        <div class="flex items-center mb-2">
          <span class="font-heading text-lg text-text-primary mr-2">DRILL LIBRARY</span>
          <input
            type="text"
            placeholder="🔍 Search drills..."
            class="ml-auto px-4 py-2 rounded-btn border border-muted bg-surface2 text-text-primary font-body focus:outline-primary"
          />
        </div>
        <div class="flex gap-4 overflow-x-auto pb-2">
          <div v-for="n in 3" :key="n" class="min-w-[240px] card bg-surface shadow-card rounded-card flex-shrink-0">
            <img :src="`/drill${n}.jpg`" alt="Drill video thumbnail" class="w-full h-32 object-cover rounded-card mb-2" />
            <div class="font-heading text-primary mb-1">Drill Title {{ n }}</div>
            <div class="caption">Short drill description goes here.</div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button -->
      <button
        class="fixed bottom-24 right-6 z-50 bg-primary text-surface shadow-xl rounded-full w-16 h-16 flex items-center justify-center text-3xl hover:bg-primary/90 transition"
        aria-label="Quick Record"
      >
        <span class="material-icons">add_circle</span>
      </button>
    </PullToRefresh>
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumbs from './components/Breadcrumbs.vue'
import ProgressRing from './components/ProgressRing.vue'
import PullToRefresh from './components/PullToRefresh.vue'
import ContextMenu from './components/ContextMenu.vue'
import WellnessTracker from './components/WellnessTracker.vue'
import BottomNav from './components/BottomNav.vue'
import playerImg from '@/assets/avatars/player.png'

const showWellnessTracker = ref(false)
const route = useRoute()
const homeRoute = computed(() => {
  return localStorage.getItem('onboardingComplete') === 'true'
    ? { name: 'AthleteDashboard' }
    : { name: 'OnboardingWelcome' }
})

const quickActions = [
  { label: 'Start Workout', icon: 'play_arrow' },
  { label: 'Log Activity', icon: 'edit' },
  { label: 'Settings', icon: 'settings' },
]
function handleAction(action) {
  // Handle quick action selection
  alert(`Selected: ${action.label}`)
}
function refreshData() {
  // Simulate data refresh
  setTimeout(() => alert('Data refreshed!'), 1000)
}
function restartOnboarding() {
  localStorage.removeItem('onboardingComplete')
  localStorage.removeItem('userDetails')
  localStorage.removeItem('userGoals')
  localStorage.removeItem('measurementSystem')
  location.reload()
}
</script> 