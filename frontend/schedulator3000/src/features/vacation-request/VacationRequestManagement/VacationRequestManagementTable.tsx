import React from 'react';
import { Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IVacationRequest } from '../../../models/IVacationRequest';
import { useServices } from '../../../hooks/use-services/useServices';
import { Employee } from '../../../models/User';
import VacationRequestManagementTableToolbar from './VacationRequestManagementTableToolbar';
import VacationRequestFormEdit from '../form/VacationRequestFormEdit';
import { useDialog } from '../../../hooks/useDialog';
import { VacationRequestUpdateStatus } from '../../../enums/VacationRequestUpdateStatus';
import useNullableState from '../../../hooks/useNullableState';
import VacationRequestManagementTableBody from './VacationRequestManagementTableBody';
import { SetState } from '../../../models/SetState';

interface IVacationRequestManagementTableProps {
  loading:boolean,
  employees:Employee[],
  vacationRequests: IVacationRequest[],
  setVacationRequests: SetState<IVacationRequest[]>
}

export default function VacationRequestManagementTable({ loading, employees, vacationRequests, setVacationRequests } :
IVacationRequestManagementTableProps) {
  const [selectedVacationRequestId, setSelectedVacationRequestId] = useNullableState<number>();
  const [openDialog, closeDialog] = useDialog();
  const { vacationRequestService } = useServices();

  function updateRequest(status: VacationRequestUpdateStatus): void {
    if (!selectedVacationRequestId) {
      return;
    }
    vacationRequestService.updateStatus(selectedVacationRequestId, status).then((response) => {
      setVacationRequests((current) => [...current.filter((v) => v.id !== selectedVacationRequestId), response]);
      setSelectedVacationRequestId(response.id);
    });
  }

  const approveAction = (): void => updateRequest(VacationRequestUpdateStatus.Approve);
  const rejectAction = (): void => updateRequest(VacationRequestUpdateStatus.Reject);

  const editAction = (): void => {
    if (!selectedVacationRequestId) {
      return;
    }

    const onFinish = (vacationRequest: IVacationRequest): void => {
      closeDialog();
      setVacationRequests((current) => [...current.filter((value) => value.id !== vacationRequest.id), vacationRequest]);
    };

    const vr = vacationRequests.find((value) => value.id === selectedVacationRequestId);

    if (!vr) {
      return;
    }

    openDialog(
      <VacationRequestFormEdit
        vacationRequestService={vacationRequestService}
        onFinish={onFinish}
        onCancel={closeDialog}
        vacationRequest={vr}
      />,
    );
  };

  const deleteAction = async (): Promise<void> => {
    if (!selectedVacationRequestId) {
      return;
    }

    vacationRequestService.deleteById(selectedVacationRequestId).then(() => {
      setVacationRequests((current) => [...current.filter((v) => v.id !== selectedVacationRequestId)]);
      setSelectedVacationRequestId(null);
    });
  };

  const onRowClick = (vacationRequest: IVacationRequest): void => {
    setSelectedVacationRequestId((selected) => (selected === vacationRequest.id ? null : vacationRequest.id));
  };

  return (
    <TableContainer component={Paper}>
      <VacationRequestManagementTableToolbar
        selectedVacationRequest={vacationRequests.find((value) => value.id === selectedVacationRequestId) ?? null}
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
        <VacationRequestManagementTableBody
          loading={loading}
          employees={employees}
          vacationRequests={vacationRequests}
          selectedVacationRequestId={selectedVacationRequestId}
          onClick={onRowClick}
        />
      </Table>
    </TableContainer>
  );
}
