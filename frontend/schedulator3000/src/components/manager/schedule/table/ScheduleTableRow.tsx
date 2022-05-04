import { differenceInMinutes, format, hoursToMinutes, isSameDay, minutesToHours, parseISO } from 'date-fns';
import { Box, Collapse, IconButton, Skeleton, TableCell, TableRow, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React, { useState } from 'react';
import { Employee } from '../../../../models/User';
import { Shift } from '../../../../models/Shift';
import { VacationRequest } from '../../../../models/VacationRequest';
import useToggle from '../../../../hooks/use-toggle';
import { SelectedItemType } from './ScheduleTable';
import ScheduleTableColumnWeek from './ScheduleTableColumnWeek';
import { Nullable } from '../../../../models/Nullable';
import { ICurrentWeek } from '../../../../hooks/use-currentWeek';
import useUpdateEffectOnlyOnce from '../../../../hooks/useUpdateOnlyOnce';
import { useServices } from '../../../../hooks/use-services/use-services';
import { INote } from '../../../../models/INote';
import EditableTextField from '../../../shared/form/EditableTextField';

interface EmployeeWeekRowProps {
  selectedItem: SelectedItemType;
  employee: Employee;
  shifts: Nullable<Shift>[];
  vacationRequests: VacationRequest[];
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
}: EmployeeWeekRowProps) {
  const [open, toggle] = useToggle();
  const { noteService } = useServices();
  const [note, setNote] = useState<Nullable<INote>>(null);

  useUpdateEffectOnlyOnce(() => {
    noteService.getByEmployeeEmail(employee.email).then(setNote);
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
        <TableCell width="6.5%">
          <IconButton aria-label="expand row" size="small" onClick={() => toggle()} disabled={isLoadingShifts}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" width="15%">
          {`${employee.firstName} ${employee.lastName}`}
        </TableCell>
        {shifts.map((shift, key) =>
          isLoadingShifts ? (
            // eslint-disable-next-line react/no-array-index-key
            <TableCell key={`${employee}:${key}`} align="center">
              <Skeleton />
              -
              <Skeleton />
            </TableCell>
          ) : (
            <ScheduleTableColumnWeek
              // eslint-disable-next-line react/no-array-index-key
              key={`${employee}:${key}`}
              index={key}
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
        <TableCell align="right" width="7%">
          <TotalTime />
        </TableCell>
      </TableRow>
      <TableRow className="myRow">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Preferences and Notes
              </Typography>
            </Box>
            <Box
              component="form"
              sx={{
                margin: 1,
              }}
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
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
