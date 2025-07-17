// Analytics Composable
import { ref, computed } from 'vue'
import { analyticsService } from '@/services/index.js'

export function useAnalytics() {
  const loading = ref(false)
  const error = ref(null)
  const analyticsData = ref({})
  
  // Computed properties
  const hasData = computed(() => Object.keys(analyticsData.value).length > 0)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)
  
  // Team Analytics
  async function loadTeamAnalytics(teamId, options = {}) {
    loading.value = true
    error.value = null
    
    try {
      const data = await analyticsService.getTeamAnalytics(teamId, options)
      analyticsData.value.team = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Progress Analysis
  async function loadProgressAnalysis(athleteId, timeframe = '4weeks') {
    loading.value = true
    error.value = null
    
    try {
      const data = await analyticsService.analyzeProgress(athleteId, timeframe)
      analyticsData.value.progress = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Performance Metrics
  async function loadPerformanceMetrics(athleteId, metricType = null, timeRange = '30d') {
    loading.value = true
    error.value = null
    
    try {
      const data = await analyticsService.getPerformanceMetrics(athleteId, metricType, timeRange)
      analyticsData.value.performance = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Wellness Analytics
  async function loadWellnessAnalytics(athleteId, timeRange = '30d') {
    loading.value = true
    error.value = null
    
    try {
      const data = await analyticsService.getWellnessAnalytics(athleteId, timeRange)
      analyticsData.value.wellness = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Training Volume
  async function loadTrainingVolume(athleteId, timeRange = '30d') {
    loading.value = true
    error.value = null
    
    try {
      const data = await analyticsService.getTrainingVolume(athleteId, timeRange)
      analyticsData.value.volume = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Adherence Analysis
  async function loadAdherenceAnalysis(athleteId, timeRange = '30d') {
    loading.value = true
    error.value = null
    
    try {
      const data = await analyticsService.getAdherenceAnalysis(athleteId, timeRange)
      analyticsData.value.adherence = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Submit Performance Metric
  async function submitPerformanceMetric(athleteId, metricData) {
    loading.value = true
    error.value = null
    
    try {
      const data = await analyticsService.submitPerformanceMetric(athleteId, metricData)
      
      // Invalidate related caches
      analyticsData.value.performance = null
      
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Clear data
  function clearData() {
    analyticsData.value = {}
    error.value = null
  }
  
  // Clear error
  function clearError() {
    error.value = null
  }
  
  return {
    // State
    loading,
    error,
    analyticsData,
    
    // Computed
    hasData,
    isLoading,
    hasError,
    
    // Methods
    loadTeamAnalytics,
    loadProgressAnalysis,
    loadPerformanceMetrics,
    loadWellnessAnalytics,
    loadTrainingVolume,
    loadAdherenceAnalysis,
    submitPerformanceMetric,
    clearData,
    clearError
  }
} 