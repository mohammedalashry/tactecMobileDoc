/**
 * Simple in-memory cache implementation
 */
class CacheManager {
  private cache: Record<
    string,
    {data: any; timestamp: number; expiry: number}
  > = {};

  /**
   * Set a value in the cache with expiration
   * @param key Cache key
   * @param data Data to cache
   * @param expiryMs Expiry time in milliseconds (default: 5 minutes)
   */
  set(key: string, data: any, expiryMs: number = 5 * 60 * 1000): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      expiry: expiryMs,
    };
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns Cached data or null if not found or expired
   */
  get(key: string): any {
    const cacheItem = this.cache[key];

    if (!cacheItem) {
      return null;
    }

    const now = Date.now();
    if (now - cacheItem.timestamp > cacheItem.expiry) {
      // Cache expired
      this.remove(key);
      return null;
    }

    return cacheItem.data;
  }

  /**
   * Remove an item from the cache
   * @param key Cache key
   */
  remove(key: string): void {
    delete this.cache[key];
  }

  /**
   * Clear all cache items
   */
  clear(): void {
    this.cache = {};
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key Cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const cacheItem = this.cache[key];

    if (!cacheItem) {
      return false;
    }

    const now = Date.now();
    if (now - cacheItem.timestamp > cacheItem.expiry) {
      this.remove(key);
      return false;
    }

    return true;
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();
