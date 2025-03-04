import {CachedApiService} from './cachedApiService';
import {store} from '../../redux/store';
import {ImageData} from '../../components/shared/media/ImageUploader';

/**
 * Interface for user profile data
 */
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  idImage?: string;
  passportImage?: string;
  covidImage?: string;
  role: string;
  dateOfBirth?: string;
  // Other fields
}

/**
 * Service for user profile and authentication API calls
 */
class UserProfileService extends CachedApiService {
  constructor() {
    super('/v1/users');
  }

  /**
   * Get the current user's profile (with caching)
   * @param token Authorization token
   * @param useCache Whether to use cache (default: true)
   * @returns User profile data
   */
  async getCurrentUser(
    token: string,
    useCache: boolean = true,
  ): Promise<UserProfile> {
    try {
      const userId = store.getState().login?.userData?._id;
      if (!userId) {
        throw new Error('User ID not found in store');
      }

      return await this.getById(userId, token, useCache);
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  }

  /**
   * Update the current user's profile
   * @param data Profile data to update
   * @param token Authorization token
   * @returns Response with updated profile
   */
  async updateProfile(data: Partial<UserProfile>, token: string): Promise<any> {
    try {
      const userId = store.getState().login?.userData?._id;
      if (!userId) {
        throw new Error('User ID not found in store');
      }

      return await this.update(userId, data, token);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Upload a profile image
   * @param imageData Image data to upload
   * @param imageType Type of image (profile, id, passport, covid)
   * @param token Authorization token
   * @returns URL of the uploaded image
   */
  async uploadProfileImage(
    imageData: ImageData,
    imageType: 'profile' | 'id' | 'passport' | 'covid',
    token: string,
  ): Promise<string> {
    try {
      const userId = store.getState().login?.userData?._id;
      if (!userId) {
        throw new Error('User ID not found in store');
      }

      const response = await this.customRequest(`${userId}/upload`, {
        method: 'POST',
        data: {
          image: imageData,
          type: imageType,
        },
        token,
      });

      // Invalidate cache after uploading image
      this.invalidateDetailCache(userId);

      return response.url;
    } catch (error) {
      console.error(`Error uploading ${imageType} image:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const userProfileService = new UserProfileService();
