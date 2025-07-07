<template>
  <div
    class="w-full"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    :aria-busy="isRefreshing ? 'true' : 'false'"
    aria-label="Pull to refresh"
  >
    <div class="flex flex-col items-center justify-center h-12 transition-all duration-300" :style="{ height: `${pullDistance}px` }">
      <svg v-if="!isRefreshing" class="w-6 h-6 text-primary transition-transform duration-200" :style="{ transform: `rotate(${pullDistance * 2}deg)` }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
      <svg v-else class="w-6 h-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['refresh'])
const isRefreshing = ref(false)
const pullDistance = ref(0)
let startY = 0
let pulling = false

function onTouchStart(e) {
  if (window.scrollY === 0) {
    pulling = true
    startY = e.touches[0].clientY
  }
}
function onTouchMove(e) {
  if (!pulling) return
  const dist = e.touches[0].clientY - startY
  pullDistance.value = Math.max(0, Math.min(dist, 64))
}
function onTouchEnd() {
  if (pulling && pullDistance.value > 48) {
    isRefreshing.value = true
    emit('refresh')
    setTimeout(() => {
      isRefreshing.value = false
      pullDistance.value = 0
    }, 1200)
  } else {
    pullDistance.value = 0
  }
  pulling = false
}
</script> 