import React from 'react';
import { SelectedScheduleTableCellContextProvider } from '../contexts/SelectedScheduleTableCellContext';
import ScheduleTableMain from './ScheduleTableMain';
import { CurrentWeekContextProvider } from '../contexts/CurrentWeekContext';

export default function ScheduleTable() {
  return (
    <CurrentWeekContextProvider>
      <SelectedScheduleTableCellContextProvider>
        <ScheduleTableMain />
      </SelectedScheduleTableCellContextProvider>
    </CurrentWeekContextProvider>
  );
}
