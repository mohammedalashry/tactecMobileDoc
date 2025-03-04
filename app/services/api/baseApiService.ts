import {axiosInterceptor} from 'utils/axios-utils';

/**
 * Configuration for API requests
 */
interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  params?: any;
  token?: string;
  headers?: Record<string, string>;
}

/**
 * Base API service that provides common functionality for all services
 */
export class BaseApiService {
  /**
   * Base endpoint for this service
   */
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * Make an API request with the provided configuration
   */
  protected async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      const response = await axiosInterceptor(config);
      return response.data;
    } catch (error) {
      console.error(`API error (${config.method} ${config.url}):`, error);
      throw error;
    }
  }

  /**
   * Get a list of items with optional query parameters
   */
  async getAll(token: string, params?: any): Promise<any> {
    return this.request({
      url: this.endpoint,
      method: 'GET',
      params,
      token,
    });
  }

  /**
   * Get an item by ID
   */
  async getById(id: string, token: string): Promise<any> {
    return this.request({
      url: `${this.endpoint}/${id}`,
      method: 'GET',
      token,
    });
  }

  /**
   * Create a new item
   */
  async create(data: any, token: string): Promise<any> {
    return this.request({
      url: this.endpoint,
      method: 'POST',
      data,
      token,
    });
  }

  /**
   * Update an existing item
   */
  async update(id: string, data: any, token: string): Promise<any> {
    return this.request({
      url: `${this.endpoint}/${id}`,
      method: 'PATCH',
      data,
      token,
    });
  }

  /**
   * Delete an item
   */
  async delete(id: string, token: string): Promise<any> {
    return this.request({
      url: `${this.endpoint}/${id}`,
      method: 'DELETE',
      token,
    });
  }

  /**
   * Perform a custom request with a specific path
   */
  async customRequest(
    path: string,
    config: Omit<RequestConfig, 'url'>,
  ): Promise<any> {
    return this.request({
      ...config,
      url: `${this.endpoint}/${path}`,
    });
  }
}
