import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Views
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AthleteDashboard from '@/AthleteDashboard.vue'
import CoachDashboard from '@/CoachDashboard.vue'
import AdminDashboard from '@/AdminDashboard.vue'
import Welcome from '../views/onboarding/Welcome.vue'

const routes = [
  {
    path: '/onboarding/welcome',
    name: 'OnboardingWelcome',
    component: Welcome
  },
  {
    path: '/onboarding/metric',
    name: 'OnboardingMetric',
    component: () => import('../views/onboarding/MetricSystem.vue')
  },
  {
    path: '/onboarding/user-details',
    name: 'OnboardingUserDetails',
    component: () => import('../views/onboarding/UserDetails.vue')
  },
  {
    path: '/onboarding/goals',
    name: 'OnboardingGoals',
    component: () => import('../views/onboarding/Goals.vue')
  },
  {
    path: '/onboarding/summary',
    name: 'OnboardingSummary',
    component: () => import('../views/onboarding/Summary.vue')
  },
  {
    path: '/',
    redirect: { name: 'OnboardingWelcome' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/athlete',
    name: 'AthleteDashboard',
    component: AthleteDashboard,
    meta: { requiresAuth: true, role: 'athlete' }
  },
  {
    path: '/coach',
    name: 'CoachDashboard',
    component: CoachDashboard,
    meta: { requiresAuth: true, role: 'coach' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  // 1. Onboarding check FIRST
  const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true'
  const onboardingRoutes = [
    'OnboardingWelcome',
    'OnboardingMetric',
    'OnboardingUserDetails',
    'OnboardingGoals',
    'OnboardingSummary'
  ]
  console.log('[RouterGuard] to:', to.name, '| onboardingComplete:', onboardingComplete)
  if (!onboardingComplete) {
    if (!onboardingRoutes.includes(to.name)) {
      console.log('[RouterGuard] Redirecting to onboarding welcome')
      next({ name: 'OnboardingWelcome' })
      return
    } else {
      console.log('[RouterGuard] Allowing onboarding route')
      next()
      return
    }
  } else if (onboardingRoutes.includes(to.name)) {
    console.log('[RouterGuard] Onboarding complete, redirecting to dashboard')
    next({ name: 'AthleteDashboard' })
    return
  }

  // 2. Auth/role checks AFTER onboarding check
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next('/login')
      return
    }
    if (to.meta.role && authStore.user?.role !== to.meta.role) {
      const role = authStore.user?.role || 'athlete'
      next(`/${role}`)
      return
    }
  }
  if (to.meta.requiresGuest && isAuthenticated) {
    const role = authStore.user?.role || 'athlete'
    next(`/${role}`)
    return
  }

  next()
})

export default router 