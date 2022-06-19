import { TableCell, TableRow } from '@mui/material';
import React from 'react';
import VacationRequestStatusIcon from './VacationRequestStatusIcon';
import { IVacationRequest } from '../../../models/IVacationRequest';

interface VacationRequestTableRowProps {
  request: IVacationRequest;
  isSelected: boolean;
  onClick: VoidFunction;
}

export default function VacationRequestTableRow({ request, isSelected, onClick }: VacationRequestTableRowProps) {
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
        {request.id}
      </TableCell>
      <TableCell width="10%" className="cap">{request.type}</TableCell>
      <TableCell width="10%">{request.startDate}</TableCell>
      <TableCell width="10%">{request.endDate}</TableCell>
      <TableCell>{request.reason}</TableCell>
      <TableCell align="center" width="10%">
        <VacationRequestStatusIcon status={request.status} />
      </TableCell>
    </TableRow>
  );
}
