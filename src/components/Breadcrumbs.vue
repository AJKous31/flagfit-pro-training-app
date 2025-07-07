<template>
  <nav class="hidden md:flex items-center gap-2 text-sm font-label text-text-secondary mb-4" aria-label="Breadcrumb">
    <ol class="flex items-center gap-2">
      <li v-for="(crumb, i) in crumbs" :key="crumb.label" class="flex items-center gap-2">
        <a
          v-if="crumb.href"
          :href="crumb.href"
          class="hover:text-primary focus:outline-primary focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
          :aria-current="i === crumbs.length - 1 ? 'page' : undefined"
        >
          {{ crumb.label }}
        </a>
        <span v-else class="text-text-primary">{{ crumb.label }}</span>
        <span v-if="i < crumbs.length - 1" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  crumbs: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>

<style scoped>
nav[aria-label="Breadcrumb"] a {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
</style> 