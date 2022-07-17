import { Tooltip } from '@mui/material';
import { Cancel, CheckCircle, FlagCircle, Help, Timer } from '@mui/icons-material';
import React from 'react';
import { VacationRequestStatus } from '../../enums/VacationRequestStatus';

interface IVacationRequestStatusIconProps {
  status: VacationRequestStatus;
}

export default function VacationRequestStatusIcon({ status }: IVacationRequestStatusIconProps) {
  switch (status.toUpperCase()) {
    case VacationRequestStatus.Rejected:
      return (
        <Tooltip title="Rejected">
          <FlagCircle color="error" />
        </Tooltip>
      );
    case VacationRequestStatus.Approved:
      return (
        <Tooltip title="Approved">
          <CheckCircle color="success" />
        </Tooltip>
      );
    case VacationRequestStatus.Cancelled:
      return (
        <Tooltip title="Cancelled">
          <Cancel color="warning" />
        </Tooltip>
      );
    case VacationRequestStatus.Pending:
      return (
        <Tooltip title="Pending">
          <Timer color="info" />
        </Tooltip>
      );
    default:
      return (
        <Tooltip title="Unknown">
          <Help color="warning" />
        </Tooltip>
      );
  }
}
