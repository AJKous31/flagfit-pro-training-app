<template>
  <div class="max-w-[1200px] mx-auto px-4 py-6">
    <!-- Breadcrumbs (desktop only) -->
    <Breadcrumbs :crumbs="[
      { label: 'Home', href: '/' },
      { label: 'Coach Portal' }
    ]" />

    <!-- Pull to Refresh (mobile only) -->
    <PullToRefresh @refresh="refreshData">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <img :src="coachImg" alt="Coach avatar" class="w-12 h-12 rounded-full border-2 border-blue-600" />
          <div>
            <span class="label block">Coach Portal</span>
            <h1 class="text-2xl font-display font-bold">Your team is crushing it! 💪</h1>
          </div>
        </div>
        <ContextMenu :items="quickActions" @select="handleAction" />
      </div>

      <!-- Team Overview Card -->
      <div class="card bg-primary text-surface mb-6 shadow-xl rounded-xl p-8">
        <div class="text-lg font-heading mb-2 flex items-center gap-2">
          <span class="material-icons">insights</span>
          TEAM PERFORMANCE
        </div>
        <ul class="font-body text-lg space-y-2">
          <li><span class="text-success text-xl mr-2">🟢</span>Active Athletes: <b>24/28</b></li>
          <li><span class="text-accent text-xl mr-2">📈</span>Avg Performance: <b>+12%</b> this week</li>
          <li><span class="text-warning text-xl mr-2">🎯</span>Next Session: <b>Tomorrow 3:00 PM</b></li>
        </ul>
      </div>

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="card flex flex-col items-center bg-surface2 shadow-card rounded-card cursor-pointer hover:bg-surface transition">
          <span class="text-3xl mb-1">📋</span>
          <span class="font-heading text-primary mb-1">Create Program</span>
          <button class="btn-primary mt-2 w-full"><span class="material-icons">add</span> New Workout</button>
        </div>
        <div class="card flex flex-col items-center bg-surface2 shadow-card rounded-card cursor-pointer hover:bg-surface transition">
          <span class="text-3xl mb-1">🎥</span>
          <span class="font-heading text-primary mb-1">Share Drill</span>
          <button class="btn-primary mt-2 w-full bg-accent"><span class="material-icons">upload</span> Upload Video</button>
        </div>
        <div class="card flex flex-col items-center bg-surface2 shadow-card rounded-card cursor-pointer hover:bg-surface transition">
          <span class="text-3xl mb-1">📊</span>
          <span class="font-heading text-primary mb-1">View Analytics</span>
          <button class="btn-primary mt-2 w-full bg-success"><span class="material-icons">bar_chart</span> Performance</button>
        </div>
        <div class="card flex flex-col items-center bg-surface2 shadow-card rounded-card cursor-pointer hover:bg-surface transition">
          <span class="text-3xl mb-1">👥</span>
          <span class="font-heading text-primary mb-1">Manage Team</span>
          <button class="btn-primary mt-2 w-full bg-navy"><span class="material-icons">settings</span> Settings</button>
        </div>
      </div>

      <!-- Recent Activity List -->
      <div class="card bg-surface2 shadow-card rounded-card">
        <div class="font-heading text-lg text-text-primary mb-2 flex items-center gap-2">
          <span class="material-icons">notifications</span>
          RECENT ACTIVITY
        </div>
        <ul class="divide-y divide-muted">
          <li class="py-3 flex items-center gap-2">
            <span class="text-success text-xl">🔔</span>
            <span class="font-body">Sarah completed Speed Drill A</span>
          </li>
          <li class="py-3 flex items-center gap-2">
            <span class="text-success text-xl">🔔</span>
            <span class="font-body">Mike logged new personal record</span>
          </li>
          <li class="py-3 flex items-center gap-2">
            <span class="text-success text-xl">🔔</span>
            <span class="font-body">Team average improved by 8%</span>
          </li>
        </ul>
      </div>
    </PullToRefresh>
  </div>
</template>

<script setup>
import Breadcrumbs from './components/Breadcrumbs.vue'
import PullToRefresh from './components/PullToRefresh.vue'
import ContextMenu from './components/ContextMenu.vue'
import coachImg from '@/assets/avatars/coach.png'

const quickActions = [
  { label: 'Create Program', icon: 'add' },
  { label: 'Share Drill', icon: 'upload' },
  { label: 'View Analytics', icon: 'bar_chart' },
  { label: 'Manage Team', icon: 'settings' },
]
function handleAction(action) {
  alert(`Selected: ${action.label}`)
}
function refreshData() {
  setTimeout(() => alert('Data refreshed!'), 1000)
}
</script> 