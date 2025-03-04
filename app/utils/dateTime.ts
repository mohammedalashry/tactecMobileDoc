// utils/dateTime.ts
import {format, parse, addHours, isValid} from 'date-fns';

export const formatDate = (date: Date | string | number): string => {
  if (!date) return '';

  try {
    const dateObj =
      typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    return format(dateObj, 'MMMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};
// utils/dateTime.ts (continued)
export const formatTime = (date: Date | string | number): string => {
  if (!date) return '';

  try {
    const dateObj =
      typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    return format(dateObj, 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

export const formatDateTime = (date: Date | string | number): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const parseFormDateTime = (
  day: string,
  month: string,
  year: string,
  hours: string,
  minutes: string,
  ampm: string,
): Date => {
  // Convert 12-hour format to 24-hour for internal use
  let hour = parseInt(hours, 10);
  if (ampm.toLowerCase() === 'pm' && hour < 12) {
    hour += 12;
  } else if (ampm.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }

  // Create date object
  const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(
    2,
    '0',
  )} ${hour}:${minutes}`;
  const date = parse(dateString, 'yyyy-MM-dd H:m', new Date());

  if (!isValid(date)) {
    throw new Error('Invalid date format');
  }

  return date;
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return months[monthIndex] || '';
};

export const getMonthNumber = (monthName: string): number => {
  const months = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  return months[monthName.toLowerCase()] !== undefined
    ? months[monthName.toLowerCase()]
    : -1;
};

export const addHoursToDate = (
  date: Date | string | number,
  hours: number,
): Date => {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  return addHours(dateObj, hours);
};
