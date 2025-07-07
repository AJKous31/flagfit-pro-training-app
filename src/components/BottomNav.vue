<template>
  <nav class="bottom-nav fixed bottom-0 left-0 right-0 z-40 flex justify-around bg-white dark:bg-gray-800 shadow-lg py-2 rounded-t-2xl">
    <router-link
      to="/athlete"
      class="nav-item flex flex-col items-center"
      :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'AthleteDashboard', 'text-gray-500 dark:text-gray-400': $route.name !== 'AthleteDashboard' }"
    >
      <span class="material-icons">home</span>
      <span class="text-xs">Home</span>
    </router-link>
    <router-link
      to="/training"
      class="nav-item flex flex-col items-center"
      :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/training', 'text-gray-500 dark:text-gray-400': $route.path !== '/training' }"
    >
      <span class="material-icons">fitness_center</span>
      <span class="text-xs">Training</span>
    </router-link>
    <router-link
      to="/progress"
      class="nav-item flex flex-col items-center"
      :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/progress', 'text-gray-500 dark:text-gray-400': $route.path !== '/progress' }"
    >
      <span class="material-icons">bar_chart</span>
      <span class="text-xs">Progress</span>
    </router-link>
    <router-link
      to="/team"
      class="nav-item flex flex-col items-center"
      :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/team', 'text-gray-500 dark:text-gray-400': $route.path !== '/team' }"
    >
      <span class="material-icons">groups</span>
      <span class="text-xs">Team</span>
    </router-link>
    <router-link
      to="/profile"
      class="nav-item flex flex-col items-center"
      :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/profile', 'text-gray-500 dark:text-gray-400': $route.path !== '/profile' }"
    >
      <span class="material-icons">person</span>
      <span class="text-xs">Profile</span>
    </router-link>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.bottom-nav {
  /* Add any custom styles if needed */
}
</style> 