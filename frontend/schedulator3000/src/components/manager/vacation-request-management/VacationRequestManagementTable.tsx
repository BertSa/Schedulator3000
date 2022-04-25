import React, { useState } from 'react';
import {
  Container,
  Hidden,
  Icon,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { VacationRequest, VacationRequestUpdateStatus } from '../../../models/VacationRequest';
import { useServices } from '../../../hooks/use-services/use-services';
import { useAuth } from '../../../hooks/use-auth';
import { Employee, Manager } from '../../../models/User';
import VacationRequestManagementTableToolbar from './VacationRequestManagementTableToolbar';
import { Nullable } from '../../../models/Nullable';
import VacationRequestManagementTableRow from './VacationRequestManagementTableRow';
import useAsync from '../../../hooks/use-async';
import TableBodyEmpty from '../../shared/TableBodyEmpty';

function VacationRequestManagementTableBodySkeleton() {
  return (
    <TableBody>
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component="th" scope="row" width="5%"><Skeleton /></TableCell>
        <TableCell width="15%"><Skeleton /></TableCell>
        <TableCell width="10%"><Skeleton /></TableCell>
        <TableCell width="10%"><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell align="center" width="10%"><Icon><Skeleton variant="circular" /></Icon></TableCell>
      </TableRow>
    </TableBody>
  );
}

export default function VacationRequestManagementTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const { managerService, vacationRequestService } = useServices();
  const [selectedVacationRequest, setSelectedVacationRequest] = useState<Nullable<VacationRequest>>(null);
  const manager: Manager = useAuth().getManager();

  const { loading } = useAsync(() => new Promise<void>(async (resolve, reject) => {
    await managerService.getEmployees(manager.email).then(setEmployees, reject);
    await vacationRequestService.getAllByManagerEmail(manager.email).then(setVacationRequests, reject);
    resolve();
  }), [manager.email]);

  function updateRequest(status: VacationRequestUpdateStatus): void {
    if (!selectedVacationRequest) {
      return;
    }
    vacationRequestService.updateStatus(selectedVacationRequest.id, status).then((response) => {
      setVacationRequests((current) => [...current.filter((v) => v.id !== selectedVacationRequest.id), response]);
      setSelectedVacationRequest(response);
    });
  }

  const approveAction = (): void => updateRequest(VacationRequestUpdateStatus.Approve);
  const rejectAction = (): void => updateRequest(VacationRequestUpdateStatus.Reject);

  function VacationRequestManagementTableBody() {
    if (loading) {
      return <VacationRequestManagementTableBodySkeleton />;
    }

    if (vacationRequests.length === 0) {
      return <TableBodyEmpty colSpan={6} message="No vacation requests" />;
    }

    function handleRowClick(vacationRequest: VacationRequest): void {
      setSelectedVacationRequest((selected) => (selected?.id === vacationRequest.id ? null : vacationRequest));
    }

    return (
      <TableBody>
        {vacationRequests.map((vacationRequest, key) => {
          const employee: Employee | undefined = employees.find((emp) => emp.email === vacationRequest.employeeEmail);
          if (employee) {
            return (
              <VacationRequestManagementTableRow
                key={employee.id}
                vacationRequest={vacationRequest}
                employee={employee}
                isSelected={selectedVacationRequest?.id === vacationRequest.id}
                onClick={() => handleRowClick(vacationRequest)}
              />
            );
          }
          return <Hidden key={key} />;
        })}
      </TableBody>
    );
  }

  return (
    <Container maxWidth="lg">
      <TableContainer component={Paper}>
        <VacationRequestManagementTableToolbar
          selectedVacationRequest={selectedVacationRequest}
          actions={{
            approve: approveAction,
            reject: rejectAction,
          }}
        />
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell width="5%">#</TableCell>
              <TableCell width="15%">Employee</TableCell>
              <TableCell width="10%">Start Date</TableCell>
              <TableCell width="10%">End Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell align="center" width="10%">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <VacationRequestManagementTableBody />
        </Table>
      </TableContainer>
    </Container>
  );
}
