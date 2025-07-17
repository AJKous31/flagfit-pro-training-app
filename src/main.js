import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Initialize services before app creation
import { initializeServices } from './services/container.js'
initializeServices()

// Create Vue app
const app = createApp(App)

// Install Pinia
const pinia = createPinia()
app.use(pinia)

// Install router
app.use(router)

// Mount app
app.mount('#app') 