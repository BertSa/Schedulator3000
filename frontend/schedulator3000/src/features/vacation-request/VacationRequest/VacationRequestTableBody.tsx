import { TableBody } from '@mui/material';
import React from 'react';
import { IVacationRequest } from '../models/IVacationRequest';
import { Nullable } from '../../../models/Nullable';
import VacationRequestTableRowSkeleton from './VacationRequestTableRowSkeleton';
import TableBodyEmpty from '../../../components/TableBodyEmpty';
import VacationRequestTableRow from './VacationRequestTableRow';

interface IVacationRequestTableBodyProps {
  loading: boolean,
  vacationRequests: IVacationRequest[],
  selectedVacationRequest: Nullable<number>,
  onRowClick: (request: IVacationRequest) => void
}

export default function VacationRequestTableBody(
  { loading, vacationRequests, selectedVacationRequest, onRowClick }: IVacationRequestTableBodyProps) {
  if (loading) {
    return <VacationRequestTableRowSkeleton />;
  }

  if (vacationRequests.length === 0) {
    return <TableBodyEmpty colSpan={6} message="No vacation requests" />;
  }

  return (
    <TableBody>
      {vacationRequests.map((request) => (
        <VacationRequestTableRow
          key={request.id}
          request={request}
          isSelected={selectedVacationRequest === request.id}
          onClick={() => onRowClick(request)}
        />
      ))}
    </TableBody>
  );
}
