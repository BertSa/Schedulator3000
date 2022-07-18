import { TableBody } from '@mui/material';
import React from 'react';
import { IVacationRequest } from '../../../models/IVacationRequest';
import { Nullable } from '../../../models/Nullable';
import { Employee } from '../../../models/User';
import VacationRequestManagementTableBodySkeleton from './VacationRequestManagementTableBodySkeleton';
import TableBodyEmpty from '../../../components/TableBodyEmpty';
import VacationRequestManagementTableRow from './VacationRequestManagementTableRow';

interface IVacationRequestManagementTableBodyProps {
  loading: boolean,
  vacationRequests: IVacationRequest[],
  selectedVacationRequestId: Nullable<number>,
  employees: Employee[],
  onClick: (vacationRequest: IVacationRequest) => void
}

export default function VacationRequestManagementTableBody(props:IVacationRequestManagementTableBodyProps) {
  const { loading, vacationRequests, selectedVacationRequestId, employees, onClick } = props;

  if (loading) {
    return <VacationRequestManagementTableBodySkeleton />;
  }
  if (vacationRequests.length === 0) {
    return <TableBodyEmpty colSpan={6} message="No vacation requests" />;
  }

  return (
    <TableBody>
      {vacationRequests.map((vacationRequest) => {
        const employee = employees.find((emp) => emp.email === vacationRequest.employeeEmail);
        if (!employee) {
          return null;
        }

        return (
          <VacationRequestManagementTableRow
            key={vacationRequest.id}
            vacationRequest={vacationRequest}
            employee={employee}
            isSelected={selectedVacationRequestId === vacationRequest.id}
            onClick={() => onClick(vacationRequest)}
          />
        );
      })}
    </TableBody>
  );
}
