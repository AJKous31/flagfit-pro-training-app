<template>
  <div class="max-w-[1200px] mx-auto px-4 py-6">
    <!-- Breadcrumbs (desktop only) -->
    <Breadcrumbs :crumbs="[
      { label: 'Home', href: '/' },
      { label: 'Admin Control' }
    ]" />

    <!-- Pull to Refresh (mobile only) -->
    <PullToRefresh @refresh="refreshData">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <img :src="adminImg" alt="Admin avatar" class="w-12 h-12 rounded-full border-2 border-purple-600" />
          <div>
            <span class="label block">Admin Control</span>
            <h1 class="text-2xl font-display font-bold flex items-center gap-2">
              <span class="material-icons text-success">shield</span>
              System Health: <span class="text-success ml-1">All Good</span>
            </h1>
          </div>
        </div>
        <ContextMenu :items="quickActions" @select="handleAction" />
      </div>

      <!-- Metrics Overview Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="card flex flex-col items-center bg-surface2 shadow-card rounded-card animate-pulse">
          <span class="text-3xl mb-1">👥</span>
          <span class="font-heading text-primary">Total Users</span>
          <span class="font-display text-2xl font-bold">1,247</span>
          <span class="caption text-success flex items-center gap-1">+12 today <span aria-label="up">↗️</span></span>
        </div>
        <div class="card flex flex-col items-center bg-surface2 shadow-card rounded-card animate-pulse">
          <span class="text-3xl mb-1">🔄</span>
          <span class="font-heading text-primary">Active Now</span>
          <span class="font-display text-2xl font-bold flex items-center gap-2">
            89
            <span class="inline-block w-2 h-2 bg-success rounded-full animate-ping"></span>
          </span>
          <span class="caption text-success">Live indicator</span>
        </div>
        <div class="card flex flex-col items-center bg-surface2 shadow-card rounded-card animate-pulse">
          <span class="text-3xl mb-1">📊</span>
          <span class="font-heading text-primary">Usage</span>
          <span class="font-display text-2xl font-bold">94%</span>
          <span class="caption text-success">Normal</span>
        </div>
      </div>

      <!-- Management Tools -->
      <div class="card bg-surface2 shadow-card rounded-card mb-6">
        <div class="flex items-center mb-4">
          <input
            type="text"
            placeholder="🔍 Search users, GDPR requests, metrics..."
            class="px-4 py-2 rounded-btn border border-muted bg-surface2 text-text-primary font-body focus:outline-primary w-full"
          />
        </div>
        <div class="flex gap-2 mb-4">
          <button class="btn-primary" :class="{ 'bg-accent': activeTab === 'users' }" @click="activeTab = 'users'">Users</button>
          <button class="btn-primary" :class="{ 'bg-accent': activeTab === 'gdpr' }" @click="activeTab = 'gdpr'">GDPR</button>
          <button class="btn-primary" :class="{ 'bg-accent': activeTab === 'analytics' }" @click="activeTab = 'analytics'">Analytics</button>
        </div>
        <div>
          <div v-if="activeTab === 'users'">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-text-secondary">
                  <th class="py-2 px-3">Name</th>
                  <th class="py-2 px-3">Role</th>
                  <th class="py-2 px-3">Status</th>
                  <th class="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-muted" v-for="user in users" :key="user.name">
                  <td class="py-2 px-3">{{ user.name }}</td>
                  <td class="py-2 px-3">{{ user.role }}</td>
                  <td class="py-2 px-3">
                    <span :class="user.status === 'Active' ? 'text-success' : 'text-warning'">{{ user.status }}</span>
                  </td>
                  <td class="py-2 px-3">
                    <ContextMenu :items="userActions" @select="(action) => handleUserAction(user, action)" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else-if="activeTab === 'gdpr'">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-text-secondary">
                  <th class="py-2 px-3">Date</th>
                  <th class="py-2 px-3">User</th>
                  <th class="py-2 px-3">Type</th>
                  <th class="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-muted" v-for="req in gdprRequests" :key="req.date + req.user">
                  <td class="py-2 px-3">{{ req.date }}</td>
                  <td class="py-2 px-3">{{ req.user }}</td>
                  <td class="py-2 px-3">{{ req.type }}</td>
                  <td class="py-2 px-3">
                    <span :class="req.status === 'Completed' ? 'text-success' : 'text-warning'">{{ req.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <div class="text-text-secondary">Analytics content goes here...</div>
          </div>
        </div>
      </div>

      <!-- System Alerts -->
      <div class="card bg-surface2 shadow-card rounded-card">
        <div class="font-heading text-lg text-text-primary mb-2 flex items-center gap-2">
          <span class="material-icons">warning</span>
          SYSTEM ALERTS
        </div>
        <ul>
          <li class="flex items-center gap-2 mb-1">
            <span class="inline-block w-3 h-3 bg-success rounded-full"></span>
            <span class="font-body">All systems operational</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="inline-block w-3 h-3 bg-warning rounded-full"></span>
            <span class="font-body">Scheduled maintenance: Sunday 2:00 AM</span>
          </li>
        </ul>
      </div>
    </PullToRefresh>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Breadcrumbs from './components/Breadcrumbs.vue'
import PullToRefresh from './components/PullToRefresh.vue'
import ContextMenu from './components/ContextMenu.vue'
import { useSponsorStore } from '@/stores/sponsor'
import adminImg from '@/assets/avatars/admin.png'

const quickActions = [
  { label: 'System Status', icon: 'monitor_heart' },
  { label: 'Settings', icon: 'settings' },
]
const userActions = [
  { label: 'Edit', icon: 'edit' },
  { label: 'Delete', icon: 'delete' },
]
const activeTab = ref('users')
const users = [
  { name: 'Alex Smith', role: 'Athlete', status: 'Active' },
  { name: 'Jordan Lee', role: 'Coach', status: 'Active' },
  { name: 'Chris Kim', role: 'Admin', status: 'Inactive' },
]
const gdprRequests = [
  { date: '2024-06-10', user: 'Alex Smith', type: 'Export', status: 'Completed' },
  { date: '2024-06-09', user: 'Jordan Lee', type: 'Delete', status: 'Pending' },
]
const sponsorStore = useSponsorStore()
const recommendations = ref([])

function handleAction(action) {
  alert(`Selected: ${action.label}`)
}
function handleUserAction(user, action) {
  alert(`User: ${user.name}, Action: ${action.label}`)
}
function refreshData() {
  setTimeout(() => alert('Data refreshed!'), 1000)
}

// Pseudocode for federated update
async function federatedModelUpdate(localModel, serverUrl) {
    // 1. Train model locally on device data
    const localUpdates = await localModel.trainOnLocalData();

    // 2. Add differential privacy noise
    const noisyUpdates = addDifferentialPrivacy(localUpdates);

    // 3. Send only model updates (not raw data) to server
    await sendUpdatesToServer(serverUrl, noisyUpdates);

    // 4. Receive aggregated global model
    const globalModel = await fetchGlobalModel(serverUrl);

    // 5. Update local model
    localModel.setWeights(globalModel.weights);
}

async function trackImpression(impressionId, placementId, userId) {
  await fetch('/api/sponsor/impression', {
    method: 'POST',
    body: JSON.stringify({ impressionId, placementId, userId }),
    headers: { 'Content-Type': 'application/json' }
  })
}

onMounted(() => {
  sponsorStore.fetchRecommendations('pre_workout').then(() => {
    // Track impression for each recommendation
    recommendations.value.forEach(rec => {
      rec.products.forEach(product => {
        const impressionId = crypto.randomUUID();
        sponsorStore.trackImpression(impressionId, product.placement_id, sponsorStore.getUserId());
      });
    });
  });
});
</script>

<style scoped>
.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes ping {
  0% { opacity: 1; }
  75%, 100% { opacity: 0; }
}
</style> 