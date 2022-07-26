import React, { useState } from 'react';
import { Container, Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IVacationRequest } from '../models/IVacationRequest';
import { useAuth } from '../../../contexts/AuthContext';
import { Employee } from '../../../models/User';
import VacationRequestTableToolbar from './VacationRequestTableToolbar';
import useAsync from '../../../hooks/useAsync';
import useNullableState from '../../../hooks/useNullableState';
import VacationRequestTableBody from './VacationRequestTableBody';
import { NoParamFunction } from '../../../models/NoParamFunction';
import useVacationRequestService from '../../../hooks/use-services/useVacationRequestService';

export interface IActions {
  create: VoidFunction,
  edit: VoidFunction,
  cancel: NoParamFunction<Promise<void>>,
  delete: NoParamFunction<Promise<void>>,
}

export default function VacationRequestTable() {
  const [vacationRequests, setVacationRequests] = useState<IVacationRequest[]>([]);
  const [selectedVacationRequestId, setSelectedVacationRequest] = useNullableState<number>();
  const vacationRequestService = useVacationRequestService();
  const employee: Employee = useAuth().getEmployee();

  const { loading } = useAsync(
    () => vacationRequestService.getAllByEmployeeEmail(employee.email).then(setVacationRequests),
    [employee.email],
  );

  const onRowClick = (vacationRequest: IVacationRequest): void => {
    setSelectedVacationRequest((selected) => (selected === vacationRequest.id ? null : vacationRequest.id));
  };

  return (
    <Container maxWidth="lg">
      <TableContainer component={Paper}>
        <VacationRequestTableToolbar
          vacationRequests={vacationRequests}
          setVacationRequests={setVacationRequests}
          selectedVacationRequestId={selectedVacationRequestId}
          setSelectedVacationRequestId={setSelectedVacationRequest}
        />
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell width="5%">#</TableCell>
              <TableCell width="10%">Type</TableCell>
              <TableCell width="10%">Start Date</TableCell>
              <TableCell width="10%">End Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell align="center" width="10%">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <VacationRequestTableBody
            vacationRequests={vacationRequests}
            selectedVacationRequest={selectedVacationRequestId}
            loading={loading}
            onRowClick={onRowClick}
          />
        </Table>
      </TableContainer>
    </Container>
  );
}
