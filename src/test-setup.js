// Test setup for Vitest
import { vi } from 'vitest'

// Set up environment variables for testing
vi.stubEnv('VITE_POCKETBASE_URL', 'http://127.0.0.1:8090')

// Mock PocketBase
global.mockPocketBase = {
  authStore: {
    isValid: false,
    model: null,
    token: null,
    clear: vi.fn(),
    save: vi.fn()
  },
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

// Legacy Supabase compatibility for existing tests
global.mockSupabase = global.mockPocketBase

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn()
} 