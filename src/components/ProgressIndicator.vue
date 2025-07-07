<template>
  <div class="w-full flex items-center gap-2" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
    <div class="flex-1 h-3 bg-muted rounded-full overflow-hidden">
      <div
        class="h-3 rounded-full transition-all duration-700"
        :class="statusClass"
        :style="{ width: progress + '%', background: barColor }"
      ></div>
    </div>
    <span class="font-label text-xs text-text-secondary ml-2">{{ progress }}%</span>
  </div>
</template>

<script setup>
const props = defineProps({
  progress: { type: Number, required: true },
  status: { type: String, default: 'normal' }, // normal, success, warning, error
})
const statusClass = {
  normal: '',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
}[props.status] || ''
const barColor = {
  normal: 'linear-gradient(90deg, #00D056 0%, #00A844 100%)',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
}[props.status] || 'linear-gradient(90deg, #00D056 0%, #00A844 100%)'
</script> 