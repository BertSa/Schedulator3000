import { CheckCircle, Delete, Edit, FlagCircle } from '@mui/icons-material';
import React from 'react';
import { VacationRequestStatus } from '../../../enums/VacationRequestStatus';
import VacationRequestTableToolbarAction from '../VacationRequestTableToolbarAction';
import { IVacationRequestManagementTableToolbarProps } from './VacationRequestManagementTableToolbar';

const titlesReject = {
  [VacationRequestStatus.Cancelled]: 'Request cancelled by the employee',
  [VacationRequestStatus.Rejected]: 'Already rejected',
  [VacationRequestStatus.Pending]: 'Reject',
  [VacationRequestStatus.Approved]: 'Reject',
};

const titlesApprove = {
  [VacationRequestStatus.Cancelled]: 'Request cancelled by the employee',
  [VacationRequestStatus.Rejected]: 'Approve',
  [VacationRequestStatus.Pending]: 'Approve',
  [VacationRequestStatus.Approved]: 'Already approved',
};

export default function VacationRequestManagementTableToolbarActions({
  selectedVacationRequest,
  actions: { del, edit, reject, approve },
}: IVacationRequestManagementTableToolbarProps) {
  if (!selectedVacationRequest) {
    return null;
  }

  return (
    <div>
      <VacationRequestTableToolbarAction
        title="Delete"
        action={del}
        disabled={[VacationRequestStatus.Approved, VacationRequestStatus.Cancelled].includes(selectedVacationRequest.status)}
        icon={Delete}
      />
      <VacationRequestTableToolbarAction
        title="Edit"
        action={edit}
        icon={Edit}
      />
      <VacationRequestTableToolbarAction
        title={titlesReject[selectedVacationRequest.status]}
        action={reject}
        disabled={[VacationRequestStatus.Cancelled, VacationRequestStatus.Rejected].includes(selectedVacationRequest.status)}
        icon={FlagCircle}
      />
      <VacationRequestTableToolbarAction
        title={titlesApprove[selectedVacationRequest.status]}
        action={approve}
        disabled={[VacationRequestStatus.Cancelled, VacationRequestStatus.Approved].includes(selectedVacationRequest.status)}
        icon={CheckCircle}
      />
    </div>
  );
}
