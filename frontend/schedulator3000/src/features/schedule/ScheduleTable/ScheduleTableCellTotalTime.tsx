import { differenceInMinutes, hoursToMinutes, minutesToHours } from 'date-fns';
import React from 'react';
import { IShift } from '../models/IShift';

export default function ScheduleTableCellTotalTime({ shifts }: { shifts: (IShift | null)[] }) {
  const number: number = shifts.reduce(
    (acc, curr) => acc + (curr ? differenceInMinutes(new Date(curr.endTime), new Date(curr.startTime)) : 0),
    0,
  );
  const hours: number = minutesToHours(number);
  const minutes: number = number - hoursToMinutes(hours);

  const total: string = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}h`;

  return <span>{total ?? '00:00h'}</span>;
}
