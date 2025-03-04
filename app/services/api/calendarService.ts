import {BaseApiService} from './baseApiService';

/**
 * Interface for calendar event
 */
export interface CalendarEvent {
  _id: string;
  title: string;
  summary?: string;
  start: string | Date;
  end?: string | Date;
  type: 'match' | 'task' | 'training';
}

/**
 * Service for calendar API calls
 */
class CalendarService extends BaseApiService {
  constructor() {
    super('/v1/calendar');
  }

  /**
   * Get calendar events for a specific month
   * @param month Month number (1-12)
   * @param year Year (e.g., 2023)
   * @param token Authorization token
   * @returns List of calendar events
   */
  async getMonthEvents(
    month: number,
    year: number,
    token: string,
  ): Promise<CalendarEvent[]> {
    try {
      const data = await this.request({
        url: `${this.endpoint}/events`,
        method: 'GET',
        params: {month, year},
        token,
      });
      return data?.events || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const calendarService = new CalendarService();
