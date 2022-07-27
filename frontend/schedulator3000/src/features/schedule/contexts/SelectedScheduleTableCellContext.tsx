import React, { PropsWithChildren, useContext } from 'react';
import { Nullable } from '../../../models/Nullable';
import { SetState } from '../../../models/SetState';
import useNullableState from '../../../hooks/useNullableState';
import { Employee } from '../../../models/User';
import { IShift } from '../models/IShift';

export interface ISelectedScheduleTableCell {
  employee: Employee;
  day: number;
  shift: Nullable<IShift>;
}

type SelectedScheduleTableCellContextType = [Nullable<ISelectedScheduleTableCell>, SetState<Nullable<ISelectedScheduleTableCell>> ];

const selectedScheduleTableCellContext = React
  .createContext<SelectedScheduleTableCellContextType>({} as SelectedScheduleTableCellContextType);

export function SelectedScheduleTableCellContextProvider({ children }:PropsWithChildren<any>) {
  const selectedItem = useNullableState<ISelectedScheduleTableCell>();
  return <selectedScheduleTableCellContext.Provider value={selectedItem}>{children}</selectedScheduleTableCellContext.Provider>;
}

export const useSelectedScheduleTableCell = () => useContext(selectedScheduleTableCellContext);
