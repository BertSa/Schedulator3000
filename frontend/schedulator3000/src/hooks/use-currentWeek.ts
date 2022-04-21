import { useCallback, useState } from 'react';
import { isBetween } from '../utilities';
import { addDays, addWeeks, startOfWeek, subWeeks } from 'date-fns';

type useCurrentWeekProps = {
    value: Date,
    next: VoidFunction,
    previous: VoidFunction,
    getPreviousWeek: () => Date,
    getNextWeek: () => Date,
    getDayOfWeek: (day: number) => Date,
    isDuringWeek: (date: Date) => boolean
}

export default function useCurrentWeek(defaultValue?: Date): useCurrentWeekProps {
    const [value, setCurrentWeek] = useState<Date>(startOfWeek(defaultValue ?? new Date()));

    const previous = useCallback(() => setCurrentWeek(curentWeek => getPreviousWeek(curentWeek)), [value]);
    const next = useCallback(() => setCurrentWeek(curentWeek => getNextWeek(curentWeek)), [value]);

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

    return {
        value: value,
        previous: previous,
        next: next,
        getDayOfWeek: getDayOfWeek,
        getPreviousWeek: getPreviousWeek,
        getNextWeek: getNextWeek,
        isDuringWeek: isDuringWeek,
    };
}
