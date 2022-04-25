import { useState } from 'react';
import { addDays, addWeeks, startOfWeek, subWeeks } from 'date-fns';
import { isBetween } from '../utilities/DateUtilities';

export interface ICurrentWeek {
  value: Date;
  next: VoidFunction;
  previous: VoidFunction;
  getPreviousWeek: () => Date;
  getNextWeek: () => Date;
  getDayOfWeek: (day: number) => Date;
  isDuringWeek: (date: Date) => boolean;
}

export default function useCurrentWeek(defaultValue?: Date): ICurrentWeek {
  const [value, setCurrentWeek] = useState<Date>(startOfWeek(defaultValue ?? new Date()));

  function getDayOfWeek(val: number): Date {
    return addDays(value, val);
  }

  function getPreviousWeek(date?: Date): Date {
    return subWeeks(date ?? value, 1);
  }

  function getNextWeek(date?: Date): Date {
    return addWeeks(date ?? value, 1);
  }

  function isDuringWeek(date: Date): boolean {
    return isBetween(date, value, getNextWeek());
  }

  const previous = (): void => setCurrentWeek(getPreviousWeek);
  const next = (): void => setCurrentWeek(getNextWeek);

  return {
    value,
    previous,
    next,
    getDayOfWeek,
    getPreviousWeek,
    getNextWeek,
    isDuringWeek,
  };
}
