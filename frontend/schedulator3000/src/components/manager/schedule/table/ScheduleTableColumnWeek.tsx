import { alpha, SxProps, TableCell, Theme } from '@mui/material';
import { addDays, format, parseISO } from 'date-fns';
import React from 'react';
import { VacationRequest, VacationRequestStatus } from '../../../../models/VacationRequest';
import { Shift } from '../../../../models/Shift';
import { Nullable } from '../../../../models/Nullable';
import { ICurrentWeek } from '../../../../hooks/use-currentWeek';
import { isBetween } from '../../../../utilities/DateUtilities';

interface EmployeeWeekColumnProps {
  index: number;
  onClick: VoidFunction;
  isSelected: boolean;
  vacations: VacationRequest[];
  shift: Nullable<Shift>;
  currentWeek: ICurrentWeek;
}

export default function ScheduleTableColumnWeek({ index, isSelected, onClick, vacations, shift, currentWeek }: EmployeeWeekColumnProps) {
  const vacationRequest = vacations.find((vacation) =>
    isBetween(currentWeek.getDayOfWeek(index), parseISO(vacation.startDate.toString()), addDays(parseISO(vacation.endDate.toString()), 1)),
  );

  function getColor(theme: Theme, vacation?: VacationRequest): string {
    let color: string;
    switch (vacation?.status) {
      case VacationRequestStatus.Pending:
        color = theme.palette.warning.main;
        break;
      case VacationRequestStatus.Approved:
        // eslint-disable-next-line prefer-destructuring
        color = theme.palette.grey[500];
        break;
      default:
        color = theme.palette.primary.main;
        break;
    }
    return color;
  }

  function getTimeInHourMinutesAMPM(date: Date) {
    return format(new Date(date), 'h:mma');
  }

  const mySx: SxProps<Theme> = {
    cursor: 'pointer',
    ...{
      bgcolor: (theme) => {
        const opacity: number = isSelected ? theme.palette.action.selectedOpacity : theme.palette.action.disabledOpacity;

        if (vacationRequest?.status === VacationRequestStatus.Pending) {
          return alpha(theme.palette.warning.main, opacity);
        }
        if (vacationRequest?.status === VacationRequestStatus.Approved) {
          return alpha(theme.palette.grey[500], opacity);
        }
        if (opacity === theme.palette.action.selectedOpacity) {
          return alpha(theme.palette.primary.main, opacity);
        }
        return 'unset';
      },
    },
    '&:hover': {
      bgcolor: (theme) => {
        const color = getColor(theme, vacationRequest);

        return alpha(color, theme.palette.action.hoverOpacity);
      },
    },
    '&:active': {
      bgcolor: (theme) => {
        const color = getColor(theme, vacationRequest);

        return alpha(color, theme.palette.action.activatedOpacity);
      },
    },
  };

  return (
    <TableCell align="center" onClick={onClick} sx={mySx}>
      <small>{shift ? getTimeInHourMinutesAMPM(shift.startTime) : '--:--'}</small>
      <br />
      <small>-</small>
      <br />
      <small>{shift ? getTimeInHourMinutesAMPM(shift.endTime) : '--:--'}</small>
    </TableCell>
  );
}
