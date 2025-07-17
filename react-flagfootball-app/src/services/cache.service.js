// Cache Service for React
class CacheService {
  constructor() {
    this.memoryCache = new Map()
    this.ttl = new Map()
    this.maxSize = 1000
    this.defaultTTL = 5 * 60 * 1000 // 5 minutes
    this.hitCount = 0
    this.missCount = 0
    setInterval(() => this.cleanup(), 60 * 1000)
  }

  /**
   * Set a value in the cache with optional TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttlMs - Time to live in milliseconds
   */
  set(key, value, ttlMs = this.defaultTTL) {
    if (this.memoryCache.size >= this.maxSize) {
      this.evictOldest()
    }
    this.memoryCache.set(key, value)
    this.ttl.set(key, Date.now() + ttlMs)
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if not found/expired
   */
  get(key) {
    const expiry = this.ttl.get(key)
    if (!expiry || Date.now() > expiry) {
      this.delete(key)
      this.missCount++
      return null
    }
    this.hitCount++
    return this.memoryCache.get(key)
  }

  /**
   * Delete a key from the cache
   * @param {string} key - Cache key to delete
   */
  delete(key) {
    this.memoryCache.delete(key)
    this.ttl.delete(key)
  }

  /**
   * Clear all cached data
   */
  clear() {
    this.memoryCache.clear()
    this.ttl.clear()
    this.hitCount = 0
    this.missCount = 0
  }

  /**
   * Check if a key exists in cache
   * @param {string} key - Cache key
   * @returns {boolean} - True if key exists and is not expired
   */
  has(key) {
    return this.get(key) !== null
  }

  /**
   * Get current cache size
   * @returns {number} - Number of cached items
   */
  size() {
    return this.memoryCache.size
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache stats including size, max size, and hit rate
   */
  getStats() {
    return {
      size: this.memoryCache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate(),
      hits: this.hitCount,
      misses: this.missCount
    }
  }

  /**
   * Evict oldest entries when cache is full
   */
  evictOldest() {
    const entries = Array.from(this.ttl.entries())
    entries.sort((a, b) => a[1] - b[1])
    const toRemove = Math.ceil(this.maxSize * 0.2)
    entries.slice(0, toRemove).forEach(([key]) => {
      this.delete(key)
    })
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now()
    for (const [key, expiry] of this.ttl.entries()) {
      if (now > expiry) {
        this.delete(key)
      }
    }
  }

  /**
   * Calculate cache hit rate
   * @returns {number} - Hit rate as a percentage (0-100)
   */
  calculateHitRate() {
    const total = this.hitCount + this.missCount
    return total > 0 ? (this.hitCount / total) * 100 : 0
  }

  /**
   * Cache a value with async factory function
   * @param {string} key - Cache key
   * @param {Function} factory - Async function to generate value
   * @param {number} ttlMs - Time to live in milliseconds
   * @returns {Promise<any>} - Cached or newly generated value
   */
  async cache(key, factory, ttlMs = this.defaultTTL) {
    const cached = this.get(key)
    if (cached) return cached
    const value = await factory()
    this.set(key, value, ttlMs)
    return value
  }

  /**
   * Invalidate cache entries matching a pattern
   * @param {string} pattern - Regex pattern to match keys
   */
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern)
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        this.delete(key)
      }
    }
  }

  /**
   * Invalidate a specific cache key
   * @param {string} key - Cache key to invalidate
   */
  invalidate(key) {
    this.delete(key)
  }
}

export default new CacheService(); 