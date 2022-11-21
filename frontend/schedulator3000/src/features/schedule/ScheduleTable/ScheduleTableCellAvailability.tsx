import { TableCell } from '@mui/material';
import { zonedTimeToUtc } from 'date-fns-tz';
import React from 'react';
import { getTimeInHourMinutesAMPM } from '../../../utilities/DateUtilities';

interface IAvailabilityCellProps {
  availability?: any;
}

export default function ScheduleTableCellAvailability({ availability }: IAvailabilityCellProps) {
  if (!availability) {
    return (
      <TableCell align="center" sx={{ border: 0 }}><small>No availability</small></TableCell>
    );
  }

  return (
    <TableCell align="center" sx={{ border: 0 }}>
      <small>
        {getTimeInHourMinutesAMPM(zonedTimeToUtc(availability.start, 'utc'))}
      </small>
      <small> to </small>
      <small>
        {getTimeInHourMinutesAMPM(zonedTimeToUtc(availability.end, 'utc'))}
      </small>
    </TableCell>
  );
}

ScheduleTableCellAvailability.defaultProps = {
  availability: undefined,
};
