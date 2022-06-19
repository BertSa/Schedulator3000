import React, { useEffect, useState } from 'react';
import { Container, Icon, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IVacationRequest } from '../../../models/IVacationRequest';
import { useServices } from '../../../hooks/use-services/useServices';
import { useAuth } from '../../../contexts/AuthContext';
import { Employee, Manager } from '../../../models/User';
import VacationRequestManagementTableToolbar from './VacationRequestManagementTableToolbar';
import { Nullable } from '../../../models/Nullable';
import VacationRequestManagementTableRow from './VacationRequestManagementTableRow';
import useAsync from '../../../hooks/useAsync';
import TableBodyEmpty from '../../shared/TableBodyEmpty';
import VacationRequestFormEdit from './form/VacationRequestFormEdit';
import { useDialog } from '../../../hooks/useDialog';
import { VacationRequestUpdateStatus } from '../../../enums/VacationRequestUpdateStatus';

function VacationRequestManagementTableBodySkeleton() {
  return (
    <TableBody>
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component="th" scope="row" width="5%">
          <Skeleton />
        </TableCell>
        <TableCell width="15%">
          <Skeleton />
        </TableCell>
        <TableCell width="10%">
          <Skeleton />
        </TableCell>
        <TableCell width="10%">
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell align="center" width="10%">
          <Icon>
            <Skeleton variant="circular" />
          </Icon>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

export default function VacationRequestManagementTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vacationRequests, setVacationRequests] = useState<IVacationRequest[]>([]);
  const { managerService, vacationRequestService } = useServices();
  const [selectedVacationRequest, setSelectedVacationRequest] = useState<Nullable<IVacationRequest>>(null);
  const manager: Manager = useAuth().getManager();
  const [openDialog, closeDialog] = useDialog();

  const { loading } = useAsync(
    () =>
      new Promise<void>(async (resolve, reject) => {
        await managerService.getEmployees(manager.email).then(setEmployees, reject);
        await vacationRequestService.getAllByManagerEmail(manager.email).then(setVacationRequests, reject);
        resolve();
      }),
    [manager.email],
  );

  useEffect(() => () => {
    // setVacationRequests([]);
    // setEmployees([]);
  }, []);

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

  const callback = (vacationRequest: IVacationRequest): void => {
    closeDialog();
    setVacationRequests((current) => [...current.filter((value) => value.id !== vacationRequest.id), vacationRequest]);
  };

  const editAction = (): void => {
    if (!selectedVacationRequest) {
      return;
    }

    openDialog(
      <VacationRequestFormEdit
        vacationRequestService={vacationRequestService}
        callback={callback}
        onCancel={closeDialog}
        vacationRequest={selectedVacationRequest}
      />,
    );
  };

  const deleteAction = async (): Promise<void> => {
    if (!selectedVacationRequest) {
      return;
    }

    vacationRequestService.deleteById(selectedVacationRequest.id).then(() => {
      setVacationRequests((current) => [...current.filter((v) => v.id !== selectedVacationRequest.id)]);
      setSelectedVacationRequest(null);
    });
  };

  function VacationRequestManagementTableBody() {
    if (loading) {
      return <VacationRequestManagementTableBodySkeleton />;
    }

    if (vacationRequests.length === 0) {
      return <TableBodyEmpty colSpan={6} message="No vacation requests" />;
    }

    function handleRowClick(vacationRequest: IVacationRequest): void {
      setSelectedVacationRequest((selected) => (selected?.id === vacationRequest.id ? null : vacationRequest));
    }

    return (
      <TableBody>
        {vacationRequests.map((vacationRequest) => {
          const employee: Employee | undefined = employees.find((emp) => emp.email === vacationRequest.employeeEmail);
          if (employee) {
            return (
              <VacationRequestManagementTableRow
                key={vacationRequest.id}
                vacationRequest={vacationRequest}
                employee={employee}
                isSelected={selectedVacationRequest?.id === vacationRequest.id}
                onClick={() => handleRowClick(vacationRequest)}
              />
            );
          }
          return null;
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
            edit: editAction,
            del: deleteAction,
          }}
        />
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell width="5%">#</TableCell>
              <TableCell width="15%">Employee</TableCell>
              <TableCell width="10%">Type</TableCell>
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