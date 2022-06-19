import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { addWeeks, format, getDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Employee } from '../../../../models/User';
import { isBetween } from '../../../../utilities/DateUtilities';
import { useAuth } from '../../../../contexts/AuthContext';
import { useServices } from '../../../../hooks/use-services/useServices';
import { IRequestDtoShiftsFromTo } from '../../../../models/IRequestDtoShiftsFromTo';
import { useDialog } from '../../../../hooks/useDialog';
import ScheduleTableToolbar from './ScheduleTableToolbar';
import { IVacationRequest } from '../../../../models/IVacationRequest';
import useCurrentWeek, { ICurrentWeek } from '../../../../hooks/useCurrentWeek';
import { Nullable } from '../../../../models/Nullable';
import { ShiftFormFieldValue } from '../ShiftForm/ShiftForm';
import ShiftFormCreate from '../ShiftForm/ShiftFormCreate';
import ShiftFormEdit from '../ShiftForm/ShiftFormEdit';
import useAsync from '../../../../hooks/useAsync';
import ScheduleTableBodySkeleton from './ScheduleTableBodySkeleton';
import useAsyncDebounce from '../../../../hooks/useAsyncDebounce';
import useDebounce from '../../../../hooks/useDebounce';
import TableBodyEmpty from '../../../shared/TableBodyEmpty';
import ScheduleTableRow from './ScheduleTableRow';
import { IShift } from '../../../../models/IShift';

export type SelectedItemType = Nullable<{ employee: Employee; day: number; shift: Nullable<IShift> }>;

interface RowDataType {
  employee: Employee;
  weekShifts: Nullable<IShift>[];
  requests: IVacationRequest[];
}

export default function ScheduleTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<IShift[]>([]);
  const [vacationRequests, setVacationRequests] = useState<IVacationRequest[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItemType>(null);
  const { managerService, shiftService, vacationRequestService } = useServices();
  const currentWeek: ICurrentWeek = useCurrentWeek();
  const [openDialog, closeDialog] = useDialog();
  const manager = useAuth().getManager();
  const weekRef: React.MutableRefObject<Date> = useRef(currentWeek.value);

  useDebounce(
    () => {
      weekRef.current = currentWeek.value;
    },
    1000,
    [currentWeek.value],
  );

  useAsyncDebounce(
    () =>
      new Promise<void>(async (resolve, reject) => {
        const body: IRequestDtoShiftsFromTo = {
          userEmail: manager.email,
          from: format(currentWeek.getPreviousWeek(), 'yyyy-MM-dd'),
          to: format(addWeeks(currentWeek.value, 2), 'yyyy-MM-dd'),
        };

        await shiftService.getShiftsManager(body).then((response) => {
          setShifts(
            response.length === 0
              ? []
              : response.map((shift) => ({
                ...shift,
                startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
                endTime: zonedTimeToUtc(shift.endTime, 'UTC'),
              })),
          );
        }, reject);
        resolve();
      }),
    1000,
    [currentWeek.value],
  );

  const { loading } = useAsync(
    () =>
      new Promise<void>(async (resolve, reject) => {
        const body: IRequestDtoShiftsFromTo = {
          userEmail: manager.email,
          from: format(currentWeek.getPreviousWeek(), 'yyyy-MM-dd'),
          to: format(addWeeks(currentWeek.value, 2), 'yyyy-MM-dd'),
        };
        await managerService.getEmployees(manager.email).then(setEmployees, reject);
        await shiftService.getShiftsManager(body).then((response) => {
          setShifts(
            response.length === 0
              ? []
              : response.map((shift) => ({
                ...shift,
                startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
                endTime: zonedTimeToUtc(shift.endTime, 'UTC'),
              })),
          );
        }, reject);
        await vacationRequestService.getAllByManagerEmail(manager.email).then(setVacationRequests, reject);
        resolve();
      }),
    [],
  );

  const createAction = () => {
    if (!selectedItem) {
      return;
    }

    const dayOfWeek: Date = currentWeek.getDayOfWeek(selectedItem.day);
    const selectedValue: ShiftFormFieldValue = {
      employeeId: selectedItem.employee.id,
      start: dayOfWeek,
      end: dayOfWeek,
    };

    const callback = (shift: IShift) => {
      closeDialog();
      setShifts((currentShifts: IShift[]) => [...currentShifts, shift]);
      setSelectedItem((current) => current && { ...current, shift });
    };

    openDialog(
      <ShiftFormCreate
        shiftService={shiftService}
        employees={employees}
        closeDialog={closeDialog}
        selected={selectedValue}
        manager={manager}
        callback={callback}
      />,
    );
  };

  const editAction = () => {
    if (!selectedItem?.shift) {
      return;
    }

    const selectedValue: ShiftFormFieldValue = {
      shiftId: selectedItem.shift.id,
      employeeId: selectedItem.employee.id,
      start: selectedItem.shift.startTime,
      end: selectedItem.shift.endTime,
    };

    const callbackDelete = () => {
      closeDialog();
      setShifts((current) => current.filter((shift) => shift.id !== selectedValue.shiftId));
      setSelectedItem(null);
    };

    const callbackUpdate = (shift: IShift) => {
      closeDialog();
      setShifts((currentShifts: IShift[]) => [...currentShifts.filter((v) => v.id !== shift.id), shift]);
    };

    openDialog(
      <ShiftFormEdit
        shiftService={shiftService}
        employees={employees}
        closeDialog={closeDialog}
        selected={selectedValue}
        manager={manager}
        callbackDelete={callbackDelete}
        callbackUpdate={callbackUpdate}
      />,
    );
  };

  const removeAction = () => {
    if (!selectedItem?.shift?.id) {
      return;
    }

    shiftService.deleteShift(selectedItem.shift.id).then(() => {
      setShifts((current) => current.filter((shift) => shift.id !== selectedItem?.shift?.id));
      setSelectedItem(null);
    });
  };

  function ScheduleTableBody() {
    const [rowData, setRowData] = useState<RowDataType[]>([]);

    useEffect(() => {
      if (!loading && employees.length !== 0) {
        employees.forEach((employee) => {
          const requests: IVacationRequest[] = vacationRequests.filter((value) => value.employeeEmail === employee.email);
          // TODO: optimize
          const tempShifts: IShift[] = shifts.filter(
            (value) =>
              isBetween(value.startTime, currentWeek.value, addWeeks(currentWeek.value, 1))
            && value.emailEmployee === employee.email,
          );

          const weekShifts: Nullable<IShift>[] = [];
          for (let i = 0; i < 7; i++) {
            weekShifts[i] = tempShifts.find((shift) => getDay(new Date(shift.startTime)) === i) ?? null;
          }

          setRowData((prevState) => [
            ...prevState.filter((data) => data.employee.id !== employee.id),
            {
              employee,
              weekShifts,
              requests,
            },
          ]);
        });
      }

      return () => {
        setRowData([]);
      };
    }, [currentWeek.value, employees, vacationRequests, shifts]);

    if (loading) {
      return <ScheduleTableBodySkeleton />;
    }

    if (employees.length === 0) {
      return <TableBodyEmpty colSpan={10} message="No employees" />;
    }

    return (
      <TableBody>
        {rowData.map(({ employee, weekShifts, requests }) => (
          <ScheduleTableRow
            key={employee.id}
            employee={employee}
            previousWeek={weekRef.current}
            shifts={weekShifts}
            vacationRequests={requests}
            selectedItem={selectedItem}
            currentWeek={currentWeek}
            setSelected={setSelectedItem}
          />
        ))}
      </TableBody>
    );
  }

  return (
    <Container maxWidth="lg">
      <TableContainer component={Paper}>
        <ScheduleTableToolbar
          currentWeek={currentWeek.value}
          selectedItem={selectedItem}
          actionsDisabled={loading || employees.length === 0}
          actions={{
            prev: currentWeek.previous,
            next: currentWeek.next,
            create: createAction,
            edit: editAction,
            remove: removeAction,
          }}
        />
        <Table aria-label="collapsible table" size="medium">
          <TableHead>
            <TableRow>
              <TableCell width="6.5%" />
              <TableCell width="15%">Employee</TableCell>
              <TableCell align="center">
                Sunday
                <br />
                <small>{format(currentWeek.getDayOfWeek(0), 'yyyy-MM-dd')}</small>
              </TableCell>
              <TableCell align="center">
                Monday
                <br />
                <small>{format(currentWeek.getDayOfWeek(1), 'yyyy-MM-dd')}</small>
              </TableCell>
              <TableCell align="center">
                Tuesday
                <br />
                <small>{format(currentWeek.getDayOfWeek(2), 'yyyy-MM-dd')}</small>
              </TableCell>
              <TableCell align="center">
                Wednesday
                <br />
                <small>{format(currentWeek.getDayOfWeek(3), 'yyyy-MM-dd')}</small>
              </TableCell>
              <TableCell align="center">
                Thursday
                <br />
                <small>{format(currentWeek.getDayOfWeek(4), 'yyyy-MM-dd')}</small>
              </TableCell>
              <TableCell align="center">
                Friday
                <br />
                <small>{format(currentWeek.getDayOfWeek(5), 'yyyy-MM-dd')}</small>
              </TableCell>
              <TableCell align="center">
                Saturday
                <br />
                <small>{format(currentWeek.getDayOfWeek(6), 'yyyy-MM-dd')}</small>
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
