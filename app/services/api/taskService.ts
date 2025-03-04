import {CachedApiService} from './cachedApiService';
import {ImageData} from '../../components/shared/media/ImageUploader';

/**
 * Interface for task image data
 */
export interface TaskImage {
  url: string;
  description?: string;
}

/**
 * Interface for task data
 */
export interface Task {
  _id: string;
  title: string;
  date: string | Date;
  images: TaskImage[];
  description?: string;
  category?: string;
  teams?: any[];
  players?: any[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Service for task API calls with caching
 */
class TaskService extends CachedApiService {
  constructor() {
    super('/v1/tasks');
  }

  /**
   * Get all tasks (with caching)
   * @param token Authorization token
   * @param params Optional query parameters
   * @param useCache Whether to use cache (default: true)
   * @returns List of tasks
   */
  async getAllTasks(
    token: string,
    params?: any,
    useCache: boolean = true,
  ): Promise<Task[]> {
    try {
      const data = await super.getAll(token, params, useCache);
      return data?.records || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  /**
   * Get a specific task by ID (with caching)
   * @param id Task ID
   * @param token Authorization token
   * @param useCache Whether to use cache (default: true)
   * @returns Task details
   */
  async getTaskById(
    id: string,
    token: string,
    useCache: boolean = true,
  ): Promise<{data: Task}> {
    try {
      const data = await super.getById(id, token, useCache);
      return {data};
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new task
   * @param data Task data
   * @param token Authorization token
   * @returns Created task
   */
  async createTask(data: Partial<Task>, token: string): Promise<any> {
    try {
      return await super.create(data, token);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Update an existing task
   * @param id Task ID
   * @param task Task data to update
   * @param token Authorization token
   * @returns Updated task
   */
  async updateTask(
    id: string,
    task: Partial<Task>,
    token: string,
  ): Promise<any> {
    try {
      return await super.update(id, task, token);
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a task
   * @param id Task ID
   * @param token Authorization token
   * @returns Response after deletion
   */
  async deleteTask(id: string, token: string): Promise<any> {
    try {
      return await super.delete(id, token);
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Upload an image for a task
   * @param id Task ID
   * @param image Image data
   * @param token Authorization token
   * @returns Response with image URL
   */
  async uploadTaskImage(
    id: string,
    image: ImageData,
    token: string,
  ): Promise<{url: string}> {
    try {
      const response = await this.customRequest(`${id}/upload`, {
        method: 'POST',
        data: {image},
        token,
      });
      return {url: response.url};
    } catch (error) {
      console.error(`Error uploading image for task ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update task images
   * @param id Task ID
   * @param images Array of TaskImage objects
   * @param token Authorization token
   * @returns Response after update
   */
  async updateTaskImages(
    id: string,
    images: TaskImage[],
    token: string,
  ): Promise<any> {
    try {
      return await this.customRequest(`${id}/images`, {
        method: 'PATCH',
        data: {images},
        token,
      });
    } catch (error) {
      console.error(`Error updating images for task ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const taskService = new TaskService();
