import { differenceInMinutes, format, hoursToMinutes, isSameDay, minutesToHours, parseISO } from 'date-fns';
import { Box, IconButton, Skeleton, TableCell, TableRow } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React from 'react';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Employee } from '../../../../models/User';
import { IVacationRequest } from '../../../../models/IVacationRequest';
import { SelectedItemType } from './ScheduleTable';
import ScheduleTableColumnWeek from './ScheduleTableColumnWeek';
import { Nullable } from '../../../../models/Nullable';
import { ICurrentWeek } from '../../../../hooks/useCurrentWeek';
import useUpdateEffect from '../../../../hooks/useUpdateEffect';
import { useServices } from '../../../../hooks/use-services/useServices';
import { INote } from '../../../../models/INote';
import EditableTextField from '../../../shared/EditableTextField';
import { AvailabilityDay } from '../../../../models/AvailabilityDay';
import { getTimeInHourMinutesAMPM } from '../../../../utilities/DateUtilities';
import { IAvailabilities } from '../../../../models/IAvailabilities';
import { IShift } from '../../../../models/IShift';
import useNullableState from '../../../../hooks/useNullableState';
import { useToggleBool } from '../../../../hooks/useToggle';

interface IAvailabilityRowProps {
  availability?: AvailabilityDay;
}
function AvailabilityRow({ availability }: IAvailabilityRowProps) {
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

AvailabilityRow.defaultProps = {
  availability: undefined,
};

interface IEmployeeWeekRowProps {
  selectedItem: SelectedItemType;
  employee: Employee;
  shifts: Nullable<IShift>[];
  vacationRequests: IVacationRequest[];
  currentWeek: ICurrentWeek;
  setSelected: React.Dispatch<React.SetStateAction<SelectedItemType>>;
  previousWeek: Date;
}
export default function ScheduleTableRow({
  selectedItem,
  employee,
  shifts,
  vacationRequests,
  currentWeek,
  setSelected,
  previousWeek,
}: IEmployeeWeekRowProps) {
  const [open, toggle] = useToggleBool();
  const [note, setNote] = useNullableState<INote>();
  const [availabilities, setAvailabilities] = useNullableState<IAvailabilities>();
  const { noteService, availabilitiesService } = useServices();

  useUpdateEffect(() => {
    noteService.getByEmployeeEmail(employee.email).then(setNote);
    availabilitiesService.getByEmployeeEmail(employee.email).then(setAvailabilities);
  }, [open]);

  function TotalTime() {
    const number: number = shifts.reduce(
      (acc, curr) => acc + (curr ? differenceInMinutes(new Date(curr.endTime), new Date(curr.startTime)) : 0),
      0,
    );
    const hours: number = minutesToHours(number);
    const minutes: number = number - hoursToMinutes(hours);

    const total: string = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}h`;

    return <span>{total ?? '00:00h'}</span>;
  }

  const isLoadingShifts = !isSameDay(previousWeek, currentWeek.getPreviousWeek())
    && !isSameDay(previousWeek, currentWeek.value)
    && !isSameDay(previousWeek, currentWeek.getNextWeek());

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
        {shifts.map((shift, key) =>
          isLoadingShifts ? (
          // eslint-disable-next-line react/no-array-index-key
            <TableCell key={`${employee}:${key}`} align="center" sx={{ ...(open && { border: 0 }) }}>
              <Skeleton />
              -
              <Skeleton />
            </TableCell>
          ) : (
            <ScheduleTableColumnWeek
            // eslint-disable-next-line react/no-array-index-key
              key={`${employee}:${key}`}
              index={key}
              open={open}
              isSelected={selectedItem?.day === key && selectedItem?.employee.id === employee.id}
              shift={shift}
              vacations={vacationRequests}
              currentWeek={currentWeek}
              onClick={() =>
                setSelected((current) =>
                  current?.day === key && current?.employee.id === employee.id
                    ? null
                    : {
                      employee,
                      shift,
                      day: key,
                    },
                )}
            />
          ),
        )}
        <TableCell align="right" width="7%" sx={{ ...(open && { border: 0 }) }}>
          <TotalTime />
        </TableCell>
      </TableRow>
      {open && note
        && (
        <>
          <TableRow>
            <TableCell sx={{ border: 0 }} colSpan={2} />
            <AvailabilityRow availability={availabilities?.sunday} />
            <AvailabilityRow availability={availabilities?.monday} />
            <AvailabilityRow availability={availabilities?.tuesday} />
            <AvailabilityRow availability={availabilities?.wednesday} />
            <AvailabilityRow availability={availabilities?.thursday} />
            <AvailabilityRow availability={availabilities?.friday} />
            <AvailabilityRow availability={availabilities?.saturday} />
            <TableCell sx={{ border: 0 }} />
          </TableRow>
          <TableRow className="myRow">
            <TableCell width="100%" colSpan={10}>
              <Box
                component="form"
                noValidate
                autoComplete="off"
              >
                <EditableTextField
                  defaultValue={note?.text ?? ''}
                  onConfirm={((text) => noteService.update(employee.email, { ...note, text } as INote).then(setNote))}
                  textHelper={`Last edited on:${note?.lastModified
                    ? format(parseISO(note.lastModified.toString()), 'yyyy-MM-dd hh:mm') : 'Never'}`}
                />
              </Box>
            </TableCell>
          </TableRow>
        </>
        )}
    </>
  );
}
