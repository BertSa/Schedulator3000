import {
  alpha,
  Container,
  Paper,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { zonedTimeToUtc } from 'date-fns-tz';
import { differenceInMinutes, hoursToMinutes, minutesToHours, startOfToday } from 'date-fns';
import { Nullable } from '../../models/Nullable';
import { useAuth } from '../../contexts/AuthContext';
import { useDialog } from '../../hooks/useDialog';
import ScheduleTableBodySkeleton from '../schedule/ScheduleTable/ScheduleTableBodySkeleton';
import { AvailabilityDay } from './models/AvailabilityDay';
import { getTimeInHourMinutesAMPM } from '../../utilities/DateUtilities';
import TableBodyEmpty from '../../components/TableBodyEmpty';
import AvailabilitiesTableToolbar from './AvailabilitiesTableToolbar';
import AvailabilityForm, { IAvailabilityFormFieldValue } from './AvailabilityForm';
import { IAvailabilities } from './models/IAvailabilities';
import setNull from '../../utilities/setNull';
import useAvailabilitiesService from '../../hooks/use-services/useAvailabilitiesService';
import useAsync from '../../hooks/useAsync';
import useNullableState from '../../hooks/useNullableState';
import { dayOfWeekMap } from '../../data/dayOfWeekMap';

export interface SelectedAvailabilityTableCell {
  day:number,
  availability:Nullable<AvailabilityDay>,
}

interface IAvailabilityTableColumnWeekProps {
  onClick: VoidFunction,
  isSelected: boolean,
  day:AvailabilityDay
}

export function AvailabilityTableColumnWeek({ onClick, isSelected, day }: IAvailabilityTableColumnWeekProps) {
  const { palette: { primary } } = useTheme();
  const mySx: SxProps<Theme> = {
    cursor: 'pointer',
    ...{
      bgcolor: (theme) => isSelected ? alpha(primary.main, theme.palette.action.activatedOpacity) : 'unset',
    },
    '&:hover': {
      bgcolor: (theme) => alpha(primary.main, theme.palette.action.hoverOpacity),
    },
    '&:active': {
      bgcolor: (theme) => alpha(primary.main, theme.palette.action.activatedOpacity),
    },
  };

  return (
    <TableCell align="center" onClick={onClick} sx={mySx}>
      <small>{day?.start ? getTimeInHourMinutesAMPM(zonedTimeToUtc(day.start, 'utc')) : '--:--'}</small>
      <br />
      <small>-</small>
      <br />
      <small>{day?.end ? getTimeInHourMinutesAMPM(zonedTimeToUtc(day.end, 'utc')) : '--:--'}</small>
    </TableCell>
  );
}

export default function AvailabilitiesTable() {
  const [selectedItem, setSelectedItem] = useNullableState<SelectedAvailabilityTableCell>();
  const [availabilities, setAvailabilities] = useState<IAvailabilities>({
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
    lastModified: startOfToday(),
    id: -1,
  });
  const availabilitiesService = useAvailabilitiesService();
  const [openDialog, closeDialog] = useDialog();
  const employee = useAuth().getEmployee();

  const { loading } = useAsync(
    () =>
      availabilitiesService.getByEmployeeEmail(employee.email)
        .then(setAvailabilities),
    [],
  );

  function TotalTime() {
    if (!availabilities) {
      return <span>00:00</span>;
    }

    const { id, lastModified, ...av } = availabilities;
    const number: number = Object.values(av).reduce(
      (acc, curr) => acc + (curr ? differenceInMinutes(new Date(curr.end), new Date(curr.start)) : 0),
      0,
    );
    const hours: number = minutesToHours(number);
    const minutes: number = number - hoursToMinutes(hours);

    const total: string = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}h`;

    return <span>{total ?? '00:00h'}</span>;
  }

  function updateSelected(availability: AvailabilityDay) {
    if (!selectedItem) {
      return;
    }

    const body = {
      ...availabilities,
      // @ts-ignore
      [dayOfWeekMap[selectedItem.day]]: availability,
    };

    availabilitiesService.update(employee.email, body).then(((value) => {
      setAvailabilities(value);
      setSelectedItem((current) => current
        ? { day: current.day, availability } as SelectedAvailabilityTableCell : null);
    }));
  }

  const createAction = () => {
    if (!selectedItem) {
      return;
    }

    const submit : SubmitHandler<IAvailabilityFormFieldValue> = (data) => {
      closeDialog();
      updateSelected(data);
    };

    openDialog(
      <AvailabilityForm
        onClose={closeDialog}
        submit={submit}
      />,
    );
  };

  const removeAction = setNull(updateSelected);

  const editAction = () => {
    if (!selectedItem) {
      return;
    }

    const submit : SubmitHandler<IAvailabilityFormFieldValue> = (data) => {
      closeDialog();
      updateSelected(data);
    };

    openDialog(
      <AvailabilityForm
        onClose={closeDialog}
        submit={submit}
        availability={selectedItem.availability}
      />,
    );
  };

  function ScheduleTableBody() {
    if (loading) {
      return <ScheduleTableBodySkeleton />;
    }

    if (!availabilities) {
      return <TableBodyEmpty colSpan={7} message="No ava" />;
    }

    const setSelectedByDay = (day:number, availability: AvailabilityDay) =>
      setSelectedItem((current) => current?.day === day ? null : {
        day,
        availability,
      });

    return (
      <TableBody>
        <TableRow className="myRow">
          {
            Object.values(dayOfWeekMap).map((val, index) => {
              // @ts-ignore
              const dayOfWeekMapElement = availabilities[val];
              return (
                <AvailabilityTableColumnWeek
                  isSelected={selectedItem?.day === index}
                  onClick={() => setSelectedByDay(index, dayOfWeekMapElement)}
                  day={dayOfWeekMapElement}
                />
              );
            })
          }
          <TableCell align="right" width="7%">
            <TotalTime />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <Container maxWidth="lg">
      <TableContainer component={Paper}>
        <AvailabilitiesTableToolbar
          selectedItem={selectedItem}
          actions={{
            create: createAction,
            edit: editAction,
            remove: removeAction,
          }}
        />
        <Table aria-label="collapsible table" size="medium">
          <TableHead>
            <TableRow>
              {
                Object.values(dayOfWeekMap).map((val) => (
                  <TableCell align="center">
                    {val}
                  </TableCell>
                ))
              }
              <TableCell align="right" width="7%">
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <ScheduleTableBody />
        </Table>
      </TableContainer>
    </Container>
  );
}
