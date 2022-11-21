import { Container, Paper, Table, TableContainer } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { addWeeks, format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Employee } from '../../../models/User';
import { useAuth } from '../../../contexts/AuthContext';
import ScheduleTableToolbar from './ScheduleTableToolbar';
import useAsyncDebounce from '../../../hooks/useAsyncDebounce';
import { IShift } from '../models/IShift';
import useShiftService from '../hooks/useShiftService';
import useManagerService from '../../../hooks/use-services/useManagerService';
import useOnUnmount from '../../../hooks/useOnUnmount';
import useOnMount from '../../../hooks/useOnMount';
import useArray from '../../../hooks/useArray';
import { KeyOf } from '../../../models/KeyOf';
import ScheduleTableBody from './ScheduleTableBody';
import { ICurrentWeek, useCurrentWeek } from '../contexts/CurrentWeekContext';
import { useSelectedScheduleTableCell } from '../contexts/SelectedScheduleTableCellContext';
import ScheduleTableHeader from './ScheduleTableHeader';

export default function ScheduleTableMain() {
  const shiftService = useShiftService();
  const managerService = useManagerService();

  const currentWeek: ICurrentWeek = useCurrentWeek();
  const shifts = useArray<IShift, KeyOf<IShift>>('id');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [, setSelected] = useSelectedScheduleTableCell();

  const manager = useAuth().getManager();

  useOnMount(() => {
    managerService.getEmployees(manager.email).then(setEmployees);
  });

  useOnUnmount(() => {
    setEmployees([]);
    shifts.clear();
    setSelected(null);
  });

  const getShifts = useCallback(() =>
    shiftService.getShiftsManager({
      userEmail: manager.email,
      from: format(currentWeek.getPreviousWeek(), 'yyyy-MM-dd'),
      to: format(addWeeks(currentWeek.value, 2), 'yyyy-MM-dd'),
    })
      .then((response) => response.map((shift) => (
        {
          ...shift,
          startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
          endTime: zonedTimeToUtc(shift.endTime, 'UTC'),
        }),
      ))
      .then(shifts.setValue), []);

  useAsyncDebounce(
    getShifts,
    1000,
    [currentWeek.value],
  );

  return (
    <Container maxWidth="lg">
      <TableContainer component={Paper}>
        <ScheduleTableToolbar shifts={shifts} employees={employees} />
        <Table aria-label="collapsible table" size="medium">
          <ScheduleTableHeader />
          <ScheduleTableBody employees={employees} shifts={shifts} />
        </Table>
      </TableContainer>
    </Container>
  );
}
