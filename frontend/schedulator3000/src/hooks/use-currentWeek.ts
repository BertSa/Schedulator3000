import { useCallback, useState } from 'react';
import { isBetween } from '../utilities';
import { addDays, addWeeks, startOfWeek, subWeeks } from 'date-fns';

export default function useCurrentWeek(defaultValue?: Date): {
    value: Date, next: VoidFunction, previous: VoidFunction, getPreviousWeek: () => Date, getNextWeek: () => Date, getDayOfWeek: (day: number) => Date,
    isDuringWeek: (date: Date) => boolean
} {
    const [value, setCurrentWeek] = useState<Date>(startOfWeek(defaultValue ?? new Date()));

    const previous: () => void = useCallback(() => setCurrentWeek(curentWeek => getPreviousWeek(curentWeek)), [value]);
    const next: () => void = useCallback(() => setCurrentWeek(curentWeek => getNextWeek(curentWeek)), [value]);

    const getDayOfWeek = (val: number) => addDays(value, val);
    const getPreviousWeek = (date?: Date) => subWeeks(date ?? value, 1);
    const getNextWeek = (date?: Date) => addWeeks(date ?? value, 1);

    const isDuringWeek = (date: Date) => isBetween(date, value, getNextWeek());

    return {
        value,
        previous,
        next,
        getDayOfWeek: getDayOfWeek,
        getPreviousWeek,
        getNextWeek,
        isDuringWeek,
    };
}
