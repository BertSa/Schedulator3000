import { format, getDay, isAfter, isBefore, isSameDay, parse, startOfWeek } from 'date-fns';
import { dateFnsLocalizer } from 'react-big-calendar';
import enCA from 'date-fns/locale/en-CA';

/**
 * @description isBetween returns true if the date is between the start and end dates
 * @param  {[Date]} date the date to check
 * @param  {[Date]} start the start date (inclusive)
 * @param  {[Date]} end the end date (exclusive)
 * @return {[boolean]} true if the date is between the start and end dates
 */
export function isBetween(date: Date, start: Date, end: Date): boolean {
  const dateToCheck = new Date(date);
  const dateStart = new Date(start);
  const dateEnd = new Date(end);

  return (isSameDay(dateToCheck, dateStart) || isAfter(dateToCheck, dateStart)) && isBefore(dateToCheck, dateEnd);
}

export function getCurrentTimezoneDate(date: Date) {
  return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000);
}

// TODO: Add preference of manager in the backend
export const preferences = Object.freeze({
  calendar: {
    step: 30,
    timeslots: 2,
    scrollToTime: new Date(1970, 1, 1, 6),
    toolbar: true,
  },
});

export function getTimeInHourMinutesAMPM(date: Date) {
  return format(new Date(date), 'h:mma');
}

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-CA': enCA,
  },
});
