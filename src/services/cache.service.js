// Cache Service for performance optimization
class CacheService {
  constructor() {
    this.memoryCache = new Map()
    this.ttl = new Map()
    this.maxSize = 1000
    this.defaultTTL = 5 * 60 * 1000 // 5 minutes
    
    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000)
  }
  
  set(key, value, ttlMs = this.defaultTTL) {
    // Evict oldest entries if cache is full
    if (this.memoryCache.size >= this.maxSize) {
      this.evictOldest()
    }
    
    this.memoryCache.set(key, value)
    this.ttl.set(key, Date.now() + ttlMs)
  }
  
  get(key) {
    const expiry = this.ttl.get(key)
    if (!expiry || Date.now() > expiry) {
      this.delete(key)
      return null
    }
    return this.memoryCache.get(key)
  }
  
  delete(key) {
    this.memoryCache.delete(key)
    this.ttl.delete(key)
  }
  
  clear() {
    this.memoryCache.clear()
    this.ttl.clear()
  }
  
  has(key) {
    return this.get(key) !== null
  }
  
  size() {
    return this.memoryCache.size
  }
  
  // Get cache statistics
  getStats() {
    return {
      size: this.memoryCache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate()
    }
  }
  
  // Evict oldest entries when cache is full
  evictOldest() {
    const entries = Array.from(this.ttl.entries())
    entries.sort((a, b) => a[1] - b[1]) // Sort by expiry time
    
    // Remove 20% of oldest entries
    const toRemove = Math.ceil(this.maxSize * 0.2)
    entries.slice(0, toRemove).forEach(([key]) => {
      this.delete(key)
    })
  }
  
  // Cleanup expired entries
  cleanup() {
    const now = Date.now()
    for (const [key, expiry] of this.ttl.entries()) {
      if (now > expiry) {
        this.delete(key)
      }
    }
  }
  
  // Calculate cache hit rate (simplified)
  calculateHitRate() {
    // This would need to be implemented with hit/miss tracking
    return 0.85 // Placeholder
  }
  
  // Cache with automatic key generation
  async cache(key, factory, ttlMs = this.defaultTTL) {
    const cached = this.get(key)
    if (cached) return cached
    
    const value = await factory()
    this.set(key, value, ttlMs)
    return value
  }
  
  // Invalidate cache by pattern
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern)
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        this.delete(key)
      }
    }
  }
}

// Create singleton instance
const cacheService = new CacheService()

export default cacheService 