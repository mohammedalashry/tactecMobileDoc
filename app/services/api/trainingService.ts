import {CachedApiService} from './cachedApiService';
import {ImageData} from '../../components/shared/media/ImageUploader';

/**
 * Interface for training image data
 */
export interface TrainingImage {
  url: string;
  description?: string;
}

/**
 * Interface for training data
 */
export interface Training {
  _id: string;
  title: string;
  date: string | Date;
  images: TrainingImage[];
  description?: string;
  players?: any[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Service for training API calls with caching
 */
class TrainingService extends CachedApiService {
  constructor() {
    super('/v1/trainings');
  }

  /**
   * Get all trainings (with caching)
   * @param token Authorization token
   * @param params Optional query parameters
   * @param useCache Whether to use cache (default: true)
   * @returns List of trainings
   */
  async getAllTrainings(
    token: string,
    params?: any,
    useCache: boolean = true,
  ): Promise<Training[]> {
    try {
      const data = await super.getAll(token, params, useCache);
      return data?.records || [];
    } catch (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }
  }

  /**
   * Get a specific training by ID (with caching)
   * @param id Training ID
   * @param token Authorization token
   * @param useCache Whether to use cache (default: true)
   * @returns Training details
   */
  async getTrainingById(
    id: string,
    token: string,
    useCache: boolean = true,
  ): Promise<Training> {
    try {
      return await super.getById(id, token, useCache);
    } catch (error) {
      console.error(`Error fetching training with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new training
   * @param data Training data
   * @param token Authorization token
   * @returns Created training
   */
  async createTraining(data: Partial<Training>, token: string): Promise<any> {
    try {
      return await super.create(data, token);
    } catch (error) {
      console.error('Error creating training:', error);
      throw error;
    }
  }

  /**
   * Update an existing training
   * @param id Training ID
   * @param training Training data to update
   * @param token Authorization token
   * @returns Updated training
   */
  async updateTraining(
    id: string,
    training: Partial<Training>,
    token: string,
  ): Promise<any> {
    try {
      return await super.update(id, training, token);
    } catch (error) {
      console.error(`Error updating training with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a training
   * @param id Training ID
   * @param token Authorization token
   * @returns Response after deletion
   */
  async deleteTraining(id: string, token: string): Promise<any> {
    try {
      return await super.delete(id, token);
    } catch (error) {
      console.error(`Error deleting training with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Upload an image for a training
   * @param id Training ID
   * @param image Image data
   * @param token Authorization token
   * @returns Response with image URL
   */
  async uploadTrainingImage(
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
      console.error(`Error uploading image for training ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update training images
   * @param id Training ID
   * @param images Array of TrainingImage objects
   * @param token Authorization token
   * @returns Response after update
   */
  async updateTrainingImages(
    id: string,
    images: TrainingImage[],
    token: string,
  ): Promise<any> {
    try {
      return await this.customRequest(`${id}/images`, {
        method: 'PATCH',
        data: {images},
        token,
      });
    } catch (error) {
      console.error(`Error updating images for training ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const trainingService = new TrainingService();
