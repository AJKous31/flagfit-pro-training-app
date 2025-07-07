<template>
  <div class="relative inline-block" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="block">
      <circle
        :cx="size/2"
        :cy="size/2"
        :r="radius"
        fill="none"
        :stroke="trackColor"
        :stroke-width="stroke"
      />
      <circle
        :cx="size/2"
        :cy="size/2"
        :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="stroke"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference - (progress / 100) * circumference"
        stroke-linecap="round"
        style="transition: stroke-dashoffset 0.6s cubic-bezier(.4,2,.6,1);"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
        role="progressbar"
      />
    </svg>
    <span class="absolute inset-0 flex items-center justify-center font-heading text-lg text-text-primary select-none">
      {{ progress }}%
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  progress: { type: Number, required: true },
  size: { type: Number, default: 64 },
  stroke: { type: Number, default: 8 },
  color: { type: String, default: '#00D056' },
  trackColor: { type: String, default: '#E2E8F0' },
})
const radius = (props.size - props.stroke) / 2
const circumference = 2 * Math.PI * radius
</script> 