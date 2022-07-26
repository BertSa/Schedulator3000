import { format } from 'date-fns';
import { TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { dayOfWeekMap } from '../../../data/dayOfWeekMap';
import { useCurrentWeek } from '../contexts/CurrentWeekContext';

export default function ScheduleTableHeader() {
  const currentWeek = useCurrentWeek();

  const daysOfWeek = [...new Array(7)].map((value, index) => {
    const day = format(currentWeek.getDayOfWeek(index), 'yyyy-MM-dd');
    // @ts-ignore
    const name = dayOfWeekMap[index.toString()];
    return (
      <TableCell key={`dow-${index}`} align="center">
        {name}
        <br />
        <small>{day}</small>
      </TableCell>
    );
  });

  return (
    <TableHead>
      <TableRow>
        <TableCell width="6.5%" />
        <TableCell width="15%">Employee</TableCell>
        {daysOfWeek}
        <TableCell align="right" width="7%">Total</TableCell>
      </TableRow>
    </TableHead>
  );
}
