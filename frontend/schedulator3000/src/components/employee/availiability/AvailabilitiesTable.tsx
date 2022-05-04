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
import { Nullable } from '../../../models/Nullable';
import { useAuth } from '../../../hooks/useAuth';
import useAsync from '../../../hooks/useAsync';
import { useDialog } from '../../../hooks/useDialog';
import ScheduleTableBodySkeleton from '../../manager/schedule/table/ScheduleTableBodySkeleton';
import { useServices } from '../../../hooks/use-services/useServices';
import { IAvailabilities, AvailabilityDay } from '../../../models/Availabilities';
import { getTimeInHourMinutesAMPM } from '../../../utilities/DateUtilities';
import TableBodyEmpty from '../../shared/TableBodyEmpty';
import AvailabilitiesTableToolbar from './AvailabilitiesTableToolbar';
import AvailabilityForm, { AvailabilityFormFieldValue } from './AvailabilityForm';

export type SelectedItemType = Nullable<{ day:number, availability:Nullable<AvailabilityDay> }>;
interface AvailiabilityTableColumnWeekProps { onClick: () => void, isSelected: boolean, day:AvailabilityDay }
export function AvailiabilityTableColumnWeek({ onClick, isSelected, day }: AvailiabilityTableColumnWeekProps) {
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
  const [selectedItem, setSelectedItem] = useState<SelectedItemType>(null);
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
  const { availabilitiesService } = useServices();
  const [openDialog, closeDialog] = useDialog();
  const employee = useAuth().getEmployee();

  const { loading } = useAsync(
    () =>
      new Promise<void>(async (resolve, reject) => {
        await availabilitiesService.getByEmployeeEmail(employee.email).then(setAvailabilities, reject);
        resolve();
      }),
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

    const body = { ...availabilities };

    if (selectedItem.day === 0) {
      body.sunday = availability;
    } else if (selectedItem.day === 1) {
      body.monday = availability;
    } else if (selectedItem.day === 2) {
      body.tuesday = availability;
    } else if (selectedItem.day === 3) {
      body.wednesday = availability;
    } else if (selectedItem.day === 4) {
      body.thursday = availability;
    } else if (selectedItem.day === 5) {
      body.friday = availability;
    } else if (selectedItem.day === 6) {
      body.saturday = availability;
    }

    availabilitiesService.update(employee.email, body).then(((value) => {
      setAvailabilities(value);
      setSelectedItem((current) => current
        ? { day: current.day, availability } as SelectedItemType : null);
    }));
  }

  const createAction = () => {
    if (!selectedItem) {
      return;
    }

    const submit : SubmitHandler<AvailabilityFormFieldValue> = (data) => {
      closeDialog();
      updateSelected({
        start: data.start,
        end: data.end,
      });
    };

    openDialog(
      <AvailabilityForm
        onClose={closeDialog}
        submit={submit}
      />,
    );
  };

  const removeAction = () => updateSelected(null);

  const editAction = () => {
    if (!selectedItem) {
      return;
    }

    const submit : SubmitHandler<AvailabilityFormFieldValue> = (data) => {
      closeDialog();
      updateSelected({
        start: data.start,
        end: data.end,
      });
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
          <AvailiabilityTableColumnWeek
            isSelected={selectedItem?.day === 0}
            onClick={() => setSelectedByDay(0, availabilities.sunday)}
            day={availabilities.sunday}
          />
          <AvailiabilityTableColumnWeek
            isSelected={selectedItem?.day === 1}
            onClick={() => setSelectedByDay(1, availabilities.monday)}
            day={availabilities.monday}
          />
          <AvailiabilityTableColumnWeek
            isSelected={selectedItem?.day === 2}
            onClick={() => setSelectedByDay(2, availabilities.tuesday)}
            day={availabilities.tuesday}
          />
          <AvailiabilityTableColumnWeek
            isSelected={selectedItem?.day === 3}
            onClick={() => setSelectedByDay(3, availabilities.wednesday)}
            day={availabilities.wednesday}
          />
          <AvailiabilityTableColumnWeek
            isSelected={selectedItem?.day === 4}
            onClick={() => setSelectedByDay(4, availabilities.thursday)}
            day={availabilities.thursday}
          />
          <AvailiabilityTableColumnWeek
            isSelected={selectedItem?.day === 5}
            onClick={() => setSelectedByDay(5, availabilities.friday)}
            day={availabilities.friday}
          />
          <AvailiabilityTableColumnWeek
            isSelected={selectedItem?.day === 6}
            onClick={() => setSelectedByDay(6, availabilities.saturday)}
            day={availabilities.saturday}
          />
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
              <TableCell align="center">
                Sunday
              </TableCell>
              <TableCell align="center">
                Monday
              </TableCell>
              <TableCell align="center">
                Tuesday
              </TableCell>
              <TableCell align="center">
                Wednesday
              </TableCell>
              <TableCell align="center">
                Thursday
              </TableCell>
              <TableCell align="center">
                Friday
              </TableCell>
              <TableCell align="center">
                Saturday
              </TableCell>
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
