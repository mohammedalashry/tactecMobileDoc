import {CachedApiService} from './cachedApiService';

/**
 * Interface for medical complaint data
 */
export interface MedicalComplaint {
  _id: string;
  description: string;
  reply?: string;
  createdAt: string;
  updatedAt: string;
  player: {
    _id: string;
    name: string;
    profileImage?: string;
  };
}

/**
 * Service for medical complaint API calls with caching
 */
class MedicalComplaintService extends CachedApiService {
  constructor() {
    super('/v1/medicalcomplaints');
  }

  /**
   * Get all medical complaints for the user (with caching)
   * @param token Authorization token
   * @param useCache Whether to use cache (default: true)
   * @returns List of medical complaints
   */
  async getAll(
    token: string,
    useCache: boolean = true,
  ): Promise<MedicalComplaint[]> {
    try {
      const data = await super.getAll(token, undefined, useCache);
      return data?.records || [];
    } catch (error) {
      console.error('Error fetching medical complaints:', error);
      throw error;
    }
  }

  /**
   * Get a specific medical complaint by ID (with caching)
   * @param id Medical complaint ID
   * @param token Authorization token
   * @param useCache Whether to use cache (default: true)
   * @returns Medical complaint details
   */
  async getById(
    id: string,
    token: string,
    useCache: boolean = true,
  ): Promise<MedicalComplaint> {
    try {
      return await super.getById(id, token, useCache);
    } catch (error) {
      console.error(`Error fetching medical complaint with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new medical complaint
   * @param data Complaint data (description)
   * @param token Authorization token
   * @returns Response with created complaint
   */
  async create(data: {description: string}, token: string): Promise<any> {
    try {
      return await super.create(data, token);
    } catch (error) {
      console.error('Error creating medical complaint:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const medicalComplaintService = new MedicalComplaintService();
