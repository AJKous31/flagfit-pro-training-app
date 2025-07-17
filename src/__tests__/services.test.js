// Service Tests
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Container } from '../services/container.js'

// Initialize mockPocketBase
let mockPocketBase

describe('Auth Service', () => {
  let container, authService

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Create fresh mockPocketBase for each test
    mockPocketBase = {
      authStore: {
        isValid: false,
        model: null,
        token: null,
        clear: vi.fn(),
        save: vi.fn()
      },
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      getCurrentUser: vi.fn(),
      updateProfile: vi.fn(),
      collection: vi.fn(() => ({
        create: vi.fn(),
        getList: vi.fn(),
        getOne: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        authWithPassword: vi.fn(),
        authRefresh: vi.fn(),
        requestPasswordReset: vi.fn(),
        confirmPasswordReset: vi.fn(),
        confirmVerification: vi.fn(),
        subscribe: vi.fn()
      })),
      files: {
        getUrl: vi.fn()
      }
    }

    container = new Container()
    container.register('pocketbase', () => mockPocketBase)
    container.register('config', () => ({
      pocketbaseUrl: 'http://127.0.0.1:8090',
      apiTimeout: 30000,
      cacheTTL: 300000,
      maxRetries: 3
    }))

    // Import and create service instance after container is configured
    const { default: AuthService } = await import('../services/auth.service.js')
    authService = new AuthService()
    authService.pocketbase = mockPocketBase
    authService.config = container.resolve('config')
  })

  it('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    }

    mockPocketBase.signUp.mockResolvedValue({
      user: { id: 'user123', email: userData.email, name: userData.name },
      token: 'test-token'
    })

    const result = await authService.register(userData)

    expect(result.user).toBeDefined()
    expect(result.token).toBeDefined()
    expect(mockPocketBase.signUp).toHaveBeenCalledWith(userData)
  })

  it('should login user', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    }

    mockPocketBase.signIn.mockResolvedValue({
      user: { id: 'user123', email: credentials.email },
      token: 'test-token'
    })

    const result = await authService.login(credentials)

    expect(result.user).toBeDefined()
    expect(result.token).toBeDefined()
    expect(mockPocketBase.signIn).toHaveBeenCalledWith(
      credentials.email,
      credentials.password
    )
  })

  it('should logout user', async () => {
    await authService.logout()

    expect(mockPocketBase.signOut).toHaveBeenCalled()
  })

  it('should get current user', async () => {
    mockPocketBase.getCurrentUser.mockResolvedValue({ id: 'user123', email: 'test@example.com' })

    const user = await authService.getCurrentUser()

    expect(user).toBeDefined()
    expect(user.id).toBe('user123')
  })

  it('should update user profile', async () => {
    const profileData = { name: 'Updated Name' }
    const updatedUser = { id: 'user123', name: 'Updated Name' }

    mockPocketBase.updateProfile.mockResolvedValue({
      user: updatedUser
    })

    const result = await authService.updateProfile(profileData)

    expect(result.user).toBeDefined()
    expect(mockPocketBase.updateProfile).toHaveBeenCalledWith(profileData)
  })
})

describe('Training Service', () => {
  let container

  beforeEach(() => {
    // Reset all mocks for Training Service tests
    vi.clearAllMocks()
    
    // Create fresh mockPocketBase for each test
    mockPocketBase = {
      getList: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      collection: vi.fn(() => ({
        create: vi.fn(),
        getList: vi.fn(),
        getOne: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        authWithPassword: vi.fn(),
        authRefresh: vi.fn(),
        requestPasswordReset: vi.fn(),
        confirmPasswordReset: vi.fn(),
        confirmVerification: vi.fn(),
        subscribe: vi.fn()
      })),
      files: {
        getUrl: vi.fn()
      }
    }

    container = new Container()
    container.register('pocketbase', () => mockPocketBase)
    container.register('config', () => ({
      pocketbaseUrl: 'http://127.0.0.1:8090',
      apiTimeout: 30000,
      cacheTTL: 300000,
      maxRetries: 3
    }))
  })

  it('should get training sessions', async () => {
    const mockSessions = [
      { id: '1', title: 'Session 1', duration: 60 },
      { id: '2', title: 'Session 2', duration: 45 }
    ]

    mockPocketBase.getList.mockResolvedValue({
      data: mockSessions,
      count: 2,
      error: null
    })

    const sessions = await trainingService.getTrainingSessions()

    expect(sessions).toEqual(mockSessions)
    expect(mockPocketBase.getList).toHaveBeenCalledWith('training_sessions', expect.any(Object))
  })

  it('should create training session', async () => {
    const sessionData = {
      title: 'New Session',
      duration: 60,
      type: 'strength'
    }

    const createdSession = { id: 'new123', ...sessionData }

    mockPocketBase.create.mockResolvedValue({
      data: createdSession,
      error: null
    })

    const result = await trainingService.createTrainingSession(sessionData)

    expect(result).toBeDefined()
    expect(mockPocketBase.create).toHaveBeenCalledWith(
      'training_sessions',
      expect.any(Object)
    )
  })

  it('should update training session', async () => {
    const sessionId = 'session123'
    const updateData = { title: 'Updated Session' }
    const updatedSession = { id: sessionId, ...updateData }

    mockPocketBase.update.mockResolvedValue({
      data: updatedSession,
      error: null
    })

    const result = await trainingService.updateTrainingSession(sessionId, updateData)

    expect(result).toBeDefined()
    expect(mockPocketBase.update).toHaveBeenCalledWith('training_sessions', sessionId, updateData)
  })

  it('should delete training session', async () => {
    const sessionId = 'session123'

    mockPocketBase.delete.mockResolvedValue({
      data: { success: true },
      error: null
    })

    const result = await trainingService.deleteTrainingSession(sessionId)

    expect(result.success).toBe(true)
    expect(mockPocketBase.delete).toHaveBeenCalledWith('training_sessions', sessionId)
  })

  it('should get training stats', async () => {
    const mockSessions = [
      { session_date: new Date().toISOString(), duration: 60 },
      { session_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), duration: 45 }
    ]

    mockPocketBase.getList.mockResolvedValue({
      data: mockSessions,
      count: 2,
      error: null
    })

    const stats = await trainingService.getTrainingStats('7d')

    expect(stats.totalSessions).toBe(2)
    expect(stats.totalDuration).toBe(105)
  })
})

describe('Analytics Service', () => {
  let container

  beforeEach(() => {
    // Reset all mocks for Analytics Service tests
    vi.clearAllMocks()
    
    // Create fresh mockPocketBase for each test
    mockPocketBase = {
      getList: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      collection: vi.fn(() => ({
        create: vi.fn(),
        getList: vi.fn(),
        getOne: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        authWithPassword: vi.fn(),
        authRefresh: vi.fn(),
        requestPasswordReset: vi.fn(),
        confirmPasswordReset: vi.fn(),
        confirmVerification: vi.fn(),
        subscribe: vi.fn()
      })),
      files: {
        getUrl: vi.fn()
      }
    }

    container = new Container()
    container.register('pocketbase', () => mockPocketBase)
    container.register('config', () => ({
      pocketbaseUrl: 'http://127.0.0.1:8090',
      apiTimeout: 30000,
      cacheTTL: 300000,
      maxRetries: 3
    }))
  })

  it('should track analytics event', async () => {
    const eventData = {
      type: 'page_view',
      pageUrl: '/dashboard',
      sessionId: 'session123'
    }

    const trackedEvent = { id: 'event123', ...eventData }

    mockPocketBase.create.mockResolvedValue({
      data: trackedEvent,
      error: null
    })

    const result = await analyticsService.trackEvent(eventData)

    expect(result).toBeDefined()
    expect(mockPocketBase.create).toHaveBeenCalledWith(
      'analytics_events',
      expect.any(Object)
    )
  })

  it('should get analytics events', async () => {
    const mockEvents = [
      { id: '1', event_type: 'page_view', timestamp: new Date().toISOString() },
      { id: '2', event_type: 'user_interaction', timestamp: new Date().toISOString() }
    ]

    mockPocketBase.getList.mockResolvedValue({
      data: mockEvents,
      count: 2,
      error: null
    })

    const events = await analyticsService.getEvents()

    expect(events).toEqual(mockEvents)
    expect(mockPocketBase.getList).toHaveBeenCalledWith('analytics_events', expect.any(Object))
  })

  it('should get analytics metrics', async () => {
    const mockEvents = [
      { event_type: 'page_view', user_id: 'user1', timestamp: new Date().toISOString() },
      { event_type: 'page_view', user_id: 'user2', timestamp: new Date().toISOString() },
      { event_type: 'conversion', user_id: 'user1', timestamp: new Date().toISOString() }
    ]

    mockPocketBase.getList.mockResolvedValue({
      data: mockEvents,
      count: 3,
      error: null
    })

    const metrics = await analyticsService.getMetrics('7d')

    expect(metrics.pageViews).toBe(2)
    expect(metrics.uniqueUsers).toBe(2)
    expect(metrics.conversionRate).toBe(50)
  })

  it('should get user behavior', async () => {
    const mockEvents = [
      { event_type: 'page_view', event_data: { pageUrl: '/dashboard' } },
      { event_type: 'page_view', event_data: { pageUrl: '/profile' } }
    ]

    mockPocketBase.getList.mockResolvedValue({
      data: mockEvents,
      count: 2,
      error: null
    })

    const behavior = await analyticsService.getUserBehavior()

    expect(behavior.mostVisitedPages).toBeDefined()
    expect(behavior.userJourney).toBeDefined()
    expect(behavior.dropoffPoints).toBeDefined()
  })
})

describe('Container', () => {
  it('should register and resolve services', () => {
    const container = new Container()
    
    expect(container.resolve('pocketbase')).toBeDefined()
    expect(container.resolve('config')).toBeDefined()
  })

  it('should handle missing services', () => {
    const container = new Container()
    
    expect(() => container.resolve('nonexistent')).toThrow('Service \'nonexistent\' not found in container')
  })

  it('should maintain singleton instances', () => {
    const container = new Container()
    
    const service1 = container.resolve('pocketbase')
    const service2 = container.resolve('pocketbase')
    
    expect(service1).toBe(service2)
  })
})

describe('Error Handling', () => {
  beforeEach(() => {
    // Create fresh mockPocketBase for error handling tests
    mockPocketBase = {
      collection: vi.fn(() => ({
        create: vi.fn(),
        getList: vi.fn(),
        getOne: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        authWithPassword: vi.fn(),
        authRefresh: vi.fn(),
        requestPasswordReset: vi.fn(),
        confirmPasswordReset: vi.fn(),
        confirmVerification: vi.fn(),
        subscribe: vi.fn()
      })),
      files: {
        getUrl: vi.fn()
      }
    }
  })

  it('should handle authentication errors', async () => {
    mockPocketBase.signIn.mockRejectedValue(new Error('Network error'))

    await expect(authService.login({
      email: 'test@example.com',
      password: 'wrong-password'
    })).rejects.toThrow('Login failed: Network error')
  })

  it('should handle database errors', async () => {
    mockPocketBase.getList.mockResolvedValue({
      data: null,
      count: 0,
      error: 'Database connection failed'
    })

    await expect(trainingService.getTrainingSessions()).rejects.toThrow('Database connection failed')
  })
}) 