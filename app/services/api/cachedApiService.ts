import {BaseApiService} from './baseApiService';
import {cacheManager} from '../cache/cacheManager';

/**
 * Extends the base API service to add caching capability
 */
export class CachedApiService extends BaseApiService {
  // Cache expiry times in milliseconds
  private static readonly LIST_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
  private static readonly DETAIL_CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

  /**
   * Generates a cache key based on endpoint, method, and params/ID
   */
  private generateCacheKey(
    method: string,
    path: string = '',
    params?: any,
  ): string {
    const paramsString = params ? JSON.stringify(params) : '';
    return `${this.endpoint}:${method}:${path}:${paramsString}`;
  }

  /**
   * Get a list of items with optional query parameters (with caching)
   */
  async getAll(
    token: string,
    params?: any,
    useCache: boolean = true,
  ): Promise<any> {
    // Generate cache key
    const cacheKey = this.generateCacheKey('GET', '', params);

    // Check cache if enabled
    if (useCache) {
      const cachedData = cacheManager.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // No cache or cache miss, do the API call
    const data = await super.getAll(token, params);

    // Cache the result if enabled
    if (useCache) {
      cacheManager.set(cacheKey, data, CachedApiService.LIST_CACHE_EXPIRY);
    }

    return data;
  }

  /**
   * Get an item by ID (with caching)
   */
  async getById(
    id: string,
    token: string,
    useCache: boolean = true,
  ): Promise<any> {
    // Generate cache key
    const cacheKey = this.generateCacheKey('GET', id);

    // Check cache if enabled
    if (useCache) {
      const cachedData = cacheManager.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // No cache or cache miss, do the API call
    const data = await super.getById(id, token);

    // Cache the result if enabled
    if (useCache) {
      cacheManager.set(cacheKey, data, CachedApiService.DETAIL_CACHE_EXPIRY);
    }

    return data;
  }

  /**
   * Create a new item and invalidate relevant caches
   */
  async create(data: any, token: string): Promise<any> {
    // Perform the API call
    const result = await super.create(data, token);

    // Invalidate list cache
    this.invalidateListCache();

    return result;
  }

  /**
   * Update an existing item and invalidate relevant caches
   */
  async update(id: string, data: any, token: string): Promise<any> {
    // Perform the API call
    const result = await super.update(id, data, token);

    // Invalidate caches
    this.invalidateListCache();
    this.invalidateDetailCache(id);

    return result;
  }

  /**
   * Delete an item and invalidate relevant caches
   */
  async delete(id: string, token: string): Promise<any> {
    // Perform the API call
    const result = await super.delete(id, token);

    // Invalidate caches
    this.invalidateListCache();
    this.invalidateDetailCache(id);

    return result;
  }

  /**
   * Invalidate all list caches for this endpoint
   */
  private invalidateListCache(): void {
    // Simple implementation: remove all caches that match the list pattern
    const cacheKeyPrefix = `${this.endpoint}:GET:`;

    // This would need to be implemented in the CacheManager
    // For now we'll just clear everything
    cacheManager.clear();
  }

  /**
   * Invalidate the cache for a specific item
   */
  public invalidateDetailCache(id: string): void {
    const cacheKey = this.generateCacheKey('GET', id);
    cacheManager.remove(cacheKey);
  }
}
