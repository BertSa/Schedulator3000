import React from 'react';
import { TableBody } from '@mui/material';
import useArray, { UseArrayType } from '../../../hooks/useArray';
import { Employee } from '../../../models/User';
import { KeyOf } from '../../../models/KeyOf';
import { IVacationRequest } from '../../vacation-request/models/IVacationRequest';
import { IShift } from '../models/IShift';
import TableBodyEmpty from '../../../components/TableBodyEmpty';
import ScheduleTableRowsEmployee from './ScheduleTableRowsEmployee';
import { useCurrentWeek } from '../contexts/CurrentWeekContext';
import useOnMount from '../../../hooks/useOnMount';
import useOnUnmount from '../../../hooks/useOnUnmount';
import useVacationRequestService from '../../../hooks/use-services/useVacationRequestService';
import { useAuth } from '../../../contexts/AuthContext';

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
  const vacationRequests = useArray<IVacationRequest, KeyOf<IVacationRequest>>('id');
  const manager = useAuth().getManager();

  useOnMount(() => {
    vacationRequestService.getAllByManagerEmail(manager.email).then(vacationRequests.setValue);
  });

  useOnUnmount(() => {
    vacationRequests.clear();
  });

  // if (loading) {
  //   return <ScheduleTableBodySkeleton />;
  // }

  if (employees.length === 0) {
    return <TableBodyEmpty colSpan={10} message="No employees" />;
  }

  return (
    <TableBody>
      {employees.map((employee) => (
        <ScheduleTableRowsEmployee
          key={employee.id}
          employee={employee}
          shifts={shifts.getAllBy('emailEmployee', employee.email)}
          vacationRequests={vacationRequests.getAllBy('employeeEmail', employee.email)}
          currentWeek={currentWeek}
        />
      ))}
    </TableBody>
  );
}
