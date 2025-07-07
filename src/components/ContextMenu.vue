<template>
  <div class="relative inline-block" @keydown.esc="closeMenu" tabindex="0" aria-haspopup="true" :aria-expanded="open ? 'true' : 'false'">
    <button class="btn btn-secondary flex items-center gap-1" @click="toggleMenu" aria-label="Open menu" :aria-expanded="open ? 'true' : 'false'">
      <span class="material-icons">more_vert</span>
    </button>
    <div v-if="open" class="absolute right-0 mt-2 w-48 bg-surface2 border border-muted rounded-xl shadow-xl z-50 animate-fade-in" role="menu">
      <button v-for="item in items" :key="item.label" class="block w-full text-left px-4 py-2 hover:bg-surface focus:bg-primary/10 focus:outline-primary focus-visible:ring-2 focus-visible:ring-primary transition" @click="select(item)" :aria-label="item.label" role="menuitem">
        <span class="flex items-center gap-2">
          <span v-if="item.icon" class="material-icons text-primary">{{ item.icon }}</span>
          {{ item.label }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  items: { type: Array, required: true },
})
const emit = defineEmits(['select'])
const open = ref(false)
function toggleMenu() { open.value = !open.value }
function closeMenu() { open.value = false }
function select(item) { emit('select', item); closeMenu() }
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: none; } }
.animate-fade-in { animation: fade-in 0.18s cubic-bezier(.4,2,.6,1); }
</style> 