import React, { PropsWithChildren, useContext, useRef, useState } from 'react';

import { addDays, addWeeks, startOfWeek, subWeeks } from 'date-fns';
import { NavigateAction } from 'react-big-calendar';
import { isBetween } from '../../../utilities/DateUtilities';
import { NoParamFunction } from '../../../models/NoParamFunction';
import useDebounce from '../../../hooks/useDebounce';

export interface ICurrentWeek {
  value: Date;
  next: VoidFunction;
  previous: VoidFunction;
  getPreviousWeek: NoParamFunction<Date>;
  getNextWeek: NoParamFunction<Date>;
  getDayOfWeek: (day: number) => Date;
  isDuringWeek: (date: Date) => boolean;
  thisWeek: VoidFunction;
  onNavigate: (act: NavigateAction) => void;
  lastPosition: React.MutableRefObject<Date>;
}

function useProvideCurrentWeek(defaultValue?: Date): ICurrentWeek {
  const [value, setCurrentWeek] = useState<Date>(startOfWeek(defaultValue ?? new Date()));

  const lastPosition: React.MutableRefObject<Date> = useRef(value);

  useDebounce(
    () => { lastPosition.current = value; },
    1000,
    [value],
  );

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
  const thisWeek = (): void => setCurrentWeek(startOfWeek(defaultValue ?? new Date()));
  const onNavigate = (act: NavigateAction) => {
    if (act === 'PREV') {
      previous();
    } else if (act === 'NEXT') {
      next();
    } else if (act === 'TODAY') {
      thisWeek();
    }
  };

  return {
    value,
    previous,
    next,
    getDayOfWeek,
    getPreviousWeek,
    getNextWeek,
    isDuringWeek,
    thisWeek,
    onNavigate,
    lastPosition,
  };
}

const MyContext = React.createContext<ICurrentWeek>({} as ICurrentWeek);

export function CurrentWeekContextProvider({ children }:PropsWithChildren<any>) {
  const iCurrentWeek = useProvideCurrentWeek();
  return <MyContext.Provider value={iCurrentWeek}>{children}</MyContext.Provider>;
}

export const useCurrentWeek = ():ICurrentWeek => useContext(MyContext);
