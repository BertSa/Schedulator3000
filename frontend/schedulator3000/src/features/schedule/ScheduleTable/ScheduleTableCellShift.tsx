import { alpha, Skeleton, SxProps, TableCell, Theme } from '@mui/material';
import React, { useMemo } from 'react';
import { addDays, parseISO } from 'date-fns';
import { Employee } from '../../../models/User';
import { Nullable } from '../../../models/Nullable';
import { IShift } from '../models/IShift';
import { IVacationRequest } from '../../vacation-request/models/IVacationRequest';
import { useSelectedScheduleTableCell } from '../contexts/SelectedScheduleTableCellContext';
import { useCurrentWeek } from '../contexts/CurrentWeekContext';
import { getTimeInHourMinutesAMPM, isBetween } from '../../../utilities/DateUtilities';
import { VacationRequestStatus } from '../../../enums/VacationRequestStatus';

function getColor(theme: Theme, vacation?: IVacationRequest): string {
  switch (vacation?.status) {
    case VacationRequestStatus.Pending:
      return theme.palette.warning.main;
    case VacationRequestStatus.Approved:
      // eslint-disable-next-line prefer-destructuring
      return theme.palette.grey[500];
    default:
      return theme.palette.primary.main;
  }
}

interface IScheduleTableCellShiftProps {
  isLoadingShifts: boolean,
  open: boolean,
  index: number,
  employee: Employee,
  shift: Nullable<IShift>,
  vacationRequests: IVacationRequest[],
}

export default function ScheduleTableCellShift({
  isLoadingShifts,
  employee,
  open,
  index,
  shift,
  vacationRequests,
}: IScheduleTableCellShiftProps) {
  const [selected, setSelected] = useSelectedScheduleTableCell();
  const currentWeek = useCurrentWeek();

  const vacationRequest = useMemo(
    () => vacationRequests.find((vacation) =>
      isBetween(
        currentWeek.getDayOfWeek(index),
        parseISO(vacation.startDate.toString()),
        addDays(parseISO(vacation.endDate.toString()), 1),
      ),
    ), []);

  if (isLoadingShifts) {
    return (
      <TableCell align="center" sx={{ ...(open && { border: 0 }) }}>
        <Skeleton />
        -
        <Skeleton />
      </TableCell>
    );
  }

  const mySx: SxProps<Theme> = {
    cursor: 'pointer',
    ...(open && { border: 0 }),
    ...{
      bgcolor: (theme) => {
        const opacity: number = selected?.day === index && selected?.employee.id === employee.id
          ? theme.palette.action.selectedOpacity : theme.palette.action.disabledOpacity;

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
      bgcolor: (theme) => alpha(getColor(theme, vacationRequest), theme.palette.action.hoverOpacity),
    },
    '&:active': {
      bgcolor: (theme) => alpha(getColor(theme, vacationRequest), theme.palette.action.activatedOpacity),
    },
  };

  const onclick = () =>
    setSelected((current) =>
      current?.day === index && current?.employee.id === employee.id
        ? null
        : {
          employee,
          shift,
          day: index,
        },
    );

  return (
    <TableCell align="center" onClick={onclick} sx={mySx}>
      <small>{shift ? getTimeInHourMinutesAMPM(shift.startTime) : '--:--'}</small>
      <br />
      <small>-</small>
      <br />
      <small>{shift ? getTimeInHourMinutesAMPM(shift.endTime) : '--:--'}</small>
    </TableCell>
  );
}
