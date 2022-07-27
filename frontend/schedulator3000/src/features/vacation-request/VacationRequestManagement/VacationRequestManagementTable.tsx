import React from 'react';
import { Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IVacationRequest } from '../models/IVacationRequest';
import { Employee } from '../../../models/User';
import VacationRequestManagementTableToolbar from './VacationRequestManagementTableToolbar';
import VacationRequestFormEdit from '../form/VacationRequestFormEdit';
import { useDialog } from '../../../hooks/useDialog';
import { VacationRequestUpdateStatus } from '../../../enums/VacationRequestUpdateStatus';
import VacationRequestManagementTableBody from './VacationRequestManagementTableBody';
import { SetState } from '../../../models/SetState';
import useSelected from '../../../hooks/useSelected';
import useVacationRequestService from '../../../hooks/use-services/useVacationRequestService';

interface IVacationRequestManagementTableProps {
  loading:boolean,
  employees:Employee[],
  vacationRequests: IVacationRequest[],
  setVacationRequests: SetState<IVacationRequest[]>
}

export default function VacationRequestManagementTable({ loading, employees, vacationRequests, setVacationRequests } :
IVacationRequestManagementTableProps) {
  const selectedVacationRequest = useSelected(vacationRequests, 'id');
  const [openDialog, closeDialog] = useDialog();
  const vacationRequestService = useVacationRequestService();

  function updateRequest(status: VacationRequestUpdateStatus): void {
    if (!selectedVacationRequest.selected) {
      return;
    }
    vacationRequestService.updateStatus(selectedVacationRequest.selected, status).then((response) => {
      setVacationRequests((current) => [...current.filter((v) => v.id !== selectedVacationRequest.selected), response]);
      selectedVacationRequest.select(response);
    });
  }

  const approveAction = (): void => updateRequest(VacationRequestUpdateStatus.Approve);
  const rejectAction = (): void => updateRequest(VacationRequestUpdateStatus.Reject);

  const editAction = (): void => {
    if (!selectedVacationRequest) {
      return;
    }

    const onFinish = (vacationRequest: IVacationRequest): void => {
      closeDialog();
      setVacationRequests((current) => [...current.filter((value) => value.id !== vacationRequest.id), vacationRequest]);
    };

    const vr = selectedVacationRequest.value();

    if (!vr) {
      return;
    }

    openDialog(
      <VacationRequestFormEdit
        onFinish={onFinish}
        onCancel={closeDialog}
        vacationRequest={vr}
      />,
    );
  };

  const deleteAction = async (): Promise<void> => {
    if (!selectedVacationRequest.selected) {
      return;
    }

    vacationRequestService.deleteById(selectedVacationRequest.selected).then(() => {
      setVacationRequests((current) => [...current.filter((v) => v.id !== selectedVacationRequest.selected)]);
      selectedVacationRequest.clear();
    });
  };

  return (
    <TableContainer component={Paper}>
      <VacationRequestManagementTableToolbar
        selectedVacationRequest={selectedVacationRequest.value()}
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
          selectedVacationRequestId={selectedVacationRequest.selected}
          onClick={selectedVacationRequest.select}
        />
      </Table>
    </TableContainer>
  );
}
