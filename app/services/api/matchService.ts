import { CachedApiService } from "./cachedApiService";
import { ImageData } from "../../components/shared/media/ImageUploader";

/**
 * Interface for match image data
 */
export interface MatchImage {
  url: string;
  description?: string;
}

/**
 * Interface for player in match
 */
export interface MatchPlayer {
  _id?: string;
  name: string;
  shirtNumber: string;
  position: string;
  starting: boolean;
}

/**
 * Interface for match data
 */
export interface Match {
  _id?: string;
  title: string;
  date: string | Date;
  venue?: string;
  opponent?: string;
  home?: boolean;
  images?: MatchImage[];
  players?: MatchPlayer[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Service for match API calls with caching
 */
class MatchService extends CachedApiService {
  constructor() {
    super("/v1/matches");
  }

  /**
   * Get all matches (with caching)
   * @param token Authorization token
   * @param params Optional query parameters
   * @param useCache Whether to use cache (default: true)
   * @returns List of matches
   */
  async getAllMatches(
    token: string,
    params?: any,
    useCache: boolean = true
  ): Promise<Match[]> {
    try {
      const data = await super.getAll(token, params, useCache);
      return data?.records || [];
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error;
    }
  }

  /**
   * Get a specific match by ID (with caching)
   * @param id Match ID
   * @param token Authorization token
   * @param useCache Whether to use cache (default: true)
   * @returns Match details
   */
  async getMatchById(
    id: string,
    token: string,
    useCache: boolean = true
  ): Promise<Match> {
    try {
      return await super.getById(id, token, useCache);
    } catch (error) {
      console.error(`Error fetching match with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new match
   * @param data Match data
   * @param token Authorization token
   * @returns Created match
   */
  async createMatch(data: Partial<Match>, token: string): Promise<any> {
    try {
      return await super.create(data, token);
    } catch (error) {
      console.error("Error creating match:", error);
      throw error;
    }
  }

  /**
   * Update an existing match
   * @param id Match ID
   * @param match Match data to update
   * @param token Authorization token
   * @returns Updated match
   */
  async updateMatch(
    id: string,
    match: Partial<Match>,
    token: string
  ): Promise<any> {
    try {
      return await super.update(id, match, token);
    } catch (error) {
      console.error(`Error updating match with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a match
   * @param id Match ID
   * @param token Authorization token
   * @returns Response after deletion
   */
  async deleteMatch(id: string, token: string): Promise<any> {
    try {
      return await super.delete(id, token);
    } catch (error) {
      console.error(`Error deleting match with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Upload an image for a match
   * @param id Match ID
   * @param image Image data
   * @param token Authorization token
   * @returns Response with image URL
   */
  async uploadMatchImage(
    id: string,
    image: ImageData,
    token: string
  ): Promise<{ url: string }> {
    try {
      const response = await this.customRequest(`${id}/upload`, {
        method: "POST",
        data: { image },
        token,
      });
      return { url: response.url };
    } catch (error) {
      console.error(`Error uploading image for match ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update match images
   * @param id Match ID
   * @param images Array of MatchImage objects
   * @param token Authorization token
   * @returns Response after update
   */
  async updateMatchImages(
    id: string,
    images: MatchImage[],
    token: string
  ): Promise<any> {
    try {
      return await this.customRequest(`${id}/images`, {
        method: "PATCH",
        data: { images },
        token,
      });
    } catch (error) {
      console.error(`Error updating images for match ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const matchService = new MatchService();
