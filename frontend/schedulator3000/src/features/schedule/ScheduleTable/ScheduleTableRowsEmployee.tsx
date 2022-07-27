import { addWeeks, getDay, isSameDay } from 'date-fns';
import { IconButton, TableCell, TableRow } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React, { useMemo } from 'react';
import { Employee } from '../../../models/User';
import { IVacationRequest } from '../../vacation-request/models/IVacationRequest';
import { isBetween } from '../../../utilities/DateUtilities';
import { IShift } from '../models/IShift';
import { useToggleBool } from '../../../hooks/useToggle';
import { ICurrentWeek } from '../contexts/CurrentWeekContext';
import ScheduleTableCellTotalTime from './ScheduleTableCellTotalTime';
import ScheduleTableCellShift from './ScheduleTableCellShift';
import ScheduleTableRowMoreDetails from './ScheduleTableRowMoreDetails';

interface IEmployeeWeekRowProps {
  employee: Employee;
  shifts: IShift[];
  vacationRequests: IVacationRequest[];
  currentWeek: ICurrentWeek;
}

export default function ScheduleTableRowsEmployee({ employee, shifts, vacationRequests, currentWeek }: IEmployeeWeekRowProps) {
  const [open, toggle] = useToggleBool();

  const weekShifts = useMemo(() => {
    const tempShifts: IShift[] = shifts.filter(
      (val) => isBetween(val.startTime, currentWeek.value, addWeeks(currentWeek.value, 1)),
    );

    return [...new Array(7).map((value, index) =>
      tempShifts.find((shift) => getDay(new Date(shift.startTime)) === index) ?? null)];
  }, []);

  const isLoadingShifts = !isSameDay(currentWeek.lastPosition.current, currentWeek.getPreviousWeek())
    && !isSameDay(currentWeek.lastPosition.current, currentWeek.value)
    && !isSameDay(currentWeek.lastPosition.current, currentWeek.getNextWeek());

  return (
    <>
      <TableRow className="myRow">
        <TableCell width="6.5%" sx={{ ...(open && { border: 0 }) }}>
          <IconButton aria-label="expand row" size="small" onClick={() => toggle()} disabled={isLoadingShifts}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" width="15%" sx={{ ...(open && { border: 0 }) }}>
          {`${employee.firstName} ${employee.lastName}`}
        </TableCell>
        {weekShifts.map((shift, key) => (
          <ScheduleTableCellShift
            key={`${employee}:${key}`}
            index={key}
            open={open}
            shift={shift}
            vacationRequests={vacationRequests}
            employee={employee}
            isLoadingShifts={isLoadingShifts}
          />
        ))}
        <TableCell align="right" width="7%" sx={{ ...(open && { border: 0 }) }}>
          <ScheduleTableCellTotalTime shifts={weekShifts} />
        </TableCell>
      </TableRow>
      <ScheduleTableRowMoreDetails open={open} employee={employee} />
    </>
  );
}
