import React, { useEffect, useState } from 'react';
import { addWeeks, getDay } from 'date-fns';
import { TableBody } from '@mui/material';
import useArray, { UseArrayType } from '../../../hooks/useArray';
import { Employee } from '../../../models/User';
import { KeyOf } from '../../../models/KeyOf';
import { IVacationRequest } from '../../vacation-request/models/IVacationRequest';
import { IShift } from '../models/IShift';
import { Nullable } from '../../../models/Nullable';
import { isBetween } from '../../../utilities/DateUtilities';
import TableBodyEmpty from '../../../components/TableBodyEmpty';
import ScheduleTableRow from './ScheduleTableRow';
import { useCurrentWeek } from '../contexts/CurrentWeekContext';
import useOnMount from '../../../hooks/useOnMount';
import useOnUnmount from '../../../hooks/useOnUnmount';
import useVacationRequestService from '../../../hooks/use-services/useVacationRequestService';
import { useAuth } from '../../../contexts/AuthContext';

interface IRowDataType {
  employee: Employee;
  weekShifts: Nullable<IShift>[];
  requests: IVacationRequest[];
}

interface IScheduleTableBodyProps {
  employees: Employee[],
  shifts: UseArrayType<IShift, KeyOf<IShift>>,
}

export default function ScheduleTableBody({
  employees,
  shifts,
}: IScheduleTableBodyProps) {
  const vacationRequestService = useVacationRequestService();

  const currentWeek = useCurrentWeek();
  const [rowData, setRowData] = useState<IRowDataType[]>([]);
  const vacationRequests = useArray<IVacationRequest, KeyOf<IVacationRequest>>('id');
  const manager = useAuth().getManager();

  useOnMount(() => {
    vacationRequestService.getAllByManagerEmail(manager.email).then(vacationRequests.setValue);
  });

  useOnUnmount(() => {
    vacationRequests.clear();
  });

  useEffect(() => {
    if (employees.length !== 0) {
      employees.forEach((employee) => {
        const requests: IVacationRequest[] = vacationRequests.value.filter((val) => val.employeeEmail === employee.email);
        // TODO: optimize
        const tempShifts: IShift[] = shifts.value.filter(
          (val) =>
            isBetween(val.startTime, currentWeek.value, addWeeks(currentWeek.value, 1))
            && val.emailEmployee === employee.email,
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

  // if (loading) {
  //   return <ScheduleTableBodySkeleton />;
  // }

  if (employees.length === 0) {
    return <TableBodyEmpty colSpan={10} message="No employees" />;
  }

  return (
    <TableBody>
      {rowData.map(({ employee, weekShifts, requests }) => (
        <ScheduleTableRow
          key={employee.id}
          employee={employee}
          previousWeek={currentWeek.lastPosition.current}
          shifts={weekShifts}
          vacationRequests={requests}
          currentWeek={currentWeek}
        />
      ))}
    </TableBody>
  );
}
