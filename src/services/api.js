import { pocketbaseService } from './pocketbase.service.js'

// Initialize PocketBase client
const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'

// Export PocketBase service as the main API client
export const api = pocketbaseService

// Legacy Supabase compatibility - export as supabase for backward compatibility
export const supabase = pocketbaseService

// API Service class for backward compatibility
class ApiService {
  constructor() {
    this.pocketbase = pocketbaseService
  }

  // Authentication methods
  async signUp(credentials) {
    return this.pocketbase.auth.signUp(credentials)
  }

  async signIn(credentials) {
    return this.pocketbase.auth.signInWithPassword(credentials)
  }

  async signOut() {
    return this.pocketbase.auth.signOut()
  }

  async getCurrentUser() {
    return this.pocketbase.auth.getUser()
  }

  async refreshSession() {
    return this.pocketbase.auth.refreshSession()
  }

  async resetPassword(email) {
    return this.pocketbase.auth.resetPasswordForEmail(email)
  }

  async updateUser(userData) {
    return this.pocketbase.auth.updateUser(userData)
  }

  // Database methods
  async create(collection, data) {
    return this.pocketbase.create(collection, data)
  }

  async getList(collection, options = {}) {
    return this.pocketbase.getList(collection, options)
  }

  async getOne(collection, id) {
    return this.pocketbase.getOne(collection, id)
  }

  async update(collection, id, data) {
    return this.pocketbase.update(collection, id, data)
  }

  async delete(collection, id) {
    return this.pocketbase.delete(collection, id)
  }

  // Real-time subscriptions
  subscribe(collection, callback) {
    return this.pocketbase.subscribe(collection, callback)
  }

  subscribeToRecord(collection, recordId, callback) {
    return this.pocketbase.subscribeToRecord(collection, recordId, callback)
  }

  // File operations
  async uploadFile(file) {
    return this.pocketbase.uploadFile(file)
  }

  getFileUrl(collection, recordId, filename) {
    return this.pocketbase.getFileUrl(collection, recordId, filename)
  }

  // Utility methods
  isAuthenticated() {
    return this.pocketbase.isAuthenticated()
  }

  getToken() {
    return this.pocketbase.getToken()
  }

  setToken(token) {
    return this.pocketbase.setToken(token)
  }
}

// Export API service instance
export const apiService = new ApiService() 