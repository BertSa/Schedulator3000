import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { IVacationRequest } from '../models/IVacationRequest';
import { Employee } from '../../../models/User';
import VacationRequestStatusIcon from '../VacationRequestStatusIcon';

interface IVacationRequestManagementTableRowProps {
  vacationRequest: IVacationRequest;
  employee: Employee;
  isSelected: boolean;
  onClick: VoidFunction;
}

export default function VacationRequestManagementTableRow({
  vacationRequest,
  employee,
  isSelected,
  onClick,
}: IVacationRequestManagementTableRowProps) {
  return (
    <TableRow
      selected={isSelected}
      hover
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell component="th" scope="row" width="5%">
        {vacationRequest.id}
      </TableCell>
      <TableCell width="15%">{`${employee?.firstName} ${employee?.lastName}`}</TableCell>
      <TableCell width="10%" className="cap">{vacationRequest.type}</TableCell>
      <TableCell width="10%">{vacationRequest.startDate}</TableCell>
      <TableCell width="10%">{vacationRequest.endDate}</TableCell>
      <TableCell>{vacationRequest.reason}</TableCell>
      <TableCell align="center" width="10%">
        <VacationRequestStatusIcon status={vacationRequest.status} />
      </TableCell>
    </TableRow>
  );
}
