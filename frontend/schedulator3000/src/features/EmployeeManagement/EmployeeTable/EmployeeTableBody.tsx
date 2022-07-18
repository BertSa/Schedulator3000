import React from 'react';
import { TableBody, TableCell, TableRow } from '@mui/material';
import { Employee } from '../../../models/User';
import { Nullable } from '../../../models/Nullable';
import EmployeeTableBodySkeleton from './EmployeeTableBodySkeleton';
import TableBodyEmpty from '../../../components/TableBodyEmpty';
import ActiveMessage from './ActiveMessage';

export default function EmployeeTableBody({ loading, employees, selectedEmployee, onClick }:
{
  loading: boolean,
  employees: Employee[],
  selectedEmployee: Nullable<number>,
  onClick: (employee: Employee) => void
}) {
  if (loading) {
    return <EmployeeTableBodySkeleton />;
  }

  if (employees.length === 0) {
    return <TableBodyEmpty colSpan={6} message="No employees" />;
  }

  return (
    <TableBody>
      {employees.map((employee) => (
        <TableRow
          key={employee.id}
          hover
          selected={selectedEmployee === employee.id}
          onClick={() => onClick(employee)}
          sx={{
            cursor: 'pointer',
            '&:last-child td, &:last-child th': { border: 0 },
          }}
        >
          <TableCell component="th" scope="row" width="5%">
            {employee.id}
          </TableCell>
          <TableCell width="10%">{employee.firstName}</TableCell>
          <TableCell width="10%">{employee.lastName}</TableCell>
          <TableCell>{employee.email}</TableCell>
          <TableCell width="15%">{employee.phone}</TableCell>
          <TableCell width="10%">{employee.role}</TableCell>
          <TableCell width="10%"><ActiveMessage isActive={employee.active} /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
