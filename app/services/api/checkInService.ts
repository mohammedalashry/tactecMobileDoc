import {BaseApiService} from './baseApiService';

/**
 * Interface for check-in data from QR code
 */
export interface CheckInQRData {
  _id: string;
  date: string | Date;
}

/**
 * Interface for check-in response
 */
export interface CheckInResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Service for check-in API calls
 */
class CheckInService extends BaseApiService {
  constructor() {
    super('/v1/attendances');
  }

  /**
   * Submit a check-in based on QR code data
   * @param qrData QR code data containing ID and date
   * @param token Authorization token
   * @returns Response from check-in API
   */
  async submitCheckIn(
    qrData: {qrCodeId: string; qrCodeDate: Date},
    token: string,
  ): Promise<CheckInResponse> {
    try {
      const result = await this.request({
        url: this.endpoint,
        method: 'POST',
        data: qrData,
        token,
      });

      return {
        success: true,
        message: 'Check-in successful',
        data: result,
      };
    } catch (error: any) {
      console.error('Error submitting check-in:', error);

      // Handle API error responses
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Failed to check in',
        };
      }

      // Handle network errors or other issues
      return {
        success: false,
        message: 'Could not connect to server. Please try again.',
      };
    }
  }

  /**
   * Get check-in history for the user
   * @param token Authorization token
   * @returns List of check-ins
   */
  async getCheckInHistory(token: string): Promise<any[]> {
    try {
      const data = await this.request({
        url: `${this.endpoint}/history`,
        method: 'GET',
        token,
      });
      return data.records || [];
    } catch (error) {
      console.error('Error fetching check-in history:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const checkInService = new CheckInService();
