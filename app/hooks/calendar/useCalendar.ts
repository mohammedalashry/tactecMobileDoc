import {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState} from 'redux/store';
import {calendarService, CalendarEvent} from 'services/api/calendarService';
import {sameDay} from 'utils/utility';

interface CalendarEvents {
  [date: string]: CalendarEvent[];
}

/**
 * Custom hook to handle calendar functionality
 */
export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvents>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const navigation = useNavigation();

  const loadItems = useCallback(
    async (date: {month: number; year: number; timestamp: number}) => {
      if (!token) {
        setError('No authentication token available');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Month is 0-indexed in JS Date, but we want 1-indexed for the API
        const month = date.month + 1;
        const year = date.year;

        const eventsData = await calendarService.getMonthEvents(
          month,
          year,
          token,
        );

        // Group events by date for Agenda component
        const groupedEvents: CalendarEvents = {};

        eventsData.forEach(event => {
          const eventDate = new Date(event.start);
          const dateString = eventDate.toISOString().split('T')[0];

          if (!groupedEvents[dateString]) {
            groupedEvents[dateString] = [];
          }

          groupedEvents[dateString].push(event);
        });

        setEvents(prevEvents => ({
          ...prevEvents,
          ...groupedEvents,
        }));
      } catch (err) {
        console.error('Error loading calendar items:', err);
        setError('Failed to load calendar events');
      } finally {
        setIsLoading(false);
      }
    },
    [token],
  );

  const navigateToEvent = useCallback(
    (event: CalendarEvent) => {
      if (!event || !event._id) return;

      switch (event.type) {
        case 'match':
          navigation.navigate('PlayerMatchScreen', {_id: event._id});
          break;
        case 'task':
          navigation.navigate(
            'PlayerTaskScreen' as never,
            {_id: event._id} as never,
          );
          break;
        case 'training':
          navigation.navigate(
            'PlayerTrainingScreen' as never,
            {_id: event._id} as never,
          );
          break;
        default:
          console.warn('Unknown event type:', event.type);
      }
    },
    [navigation],
  );

  // Helper function to check if an event is on a specific day
  const isEventOnDay = useCallback((event: CalendarEvent, date: Date) => {
    return sameDay(new Date(event.start), date);
  }, []);

  return {
    events,
    isLoading,
    error,
    loadItems,
    navigateToEvent,
    isEventOnDay,
  };
};
