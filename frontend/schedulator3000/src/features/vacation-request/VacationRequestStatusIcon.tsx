import { Tooltip } from '@mui/material';
import { Cancel, CheckCircle, FlagCircle, Help, Timer } from '@mui/icons-material';
import React from 'react';
import { VacationRequestStatus } from '../../enums/VacationRequestStatus';

interface IVacationRequestStatusIconProps {
  status: VacationRequestStatus;
}

function UnknownIcon() {
  return (
    <Tooltip title="Unknown">
      <Help color="warning" />
    </Tooltip>
  );
}

const VacationRequestStatusIcons = {
  [VacationRequestStatus.Rejected]: (
    <Tooltip title="Rejected">
      <FlagCircle color="error" />
    </Tooltip>
  ),
  [VacationRequestStatus.Approved]: (
    <Tooltip title="Approved">
      <CheckCircle color="success" />
    </Tooltip>
  ),
  [VacationRequestStatus.Cancelled]: (
    <Tooltip title="Cancelled">
      <Cancel color="warning" />
    </Tooltip>
  ),
  [VacationRequestStatus.Pending]: (
    <Tooltip title="Pending">
      <Timer color="info" />
    </Tooltip>
  ),
};

export default function VacationRequestStatusIcon({ status }: IVacationRequestStatusIconProps) {
  return VacationRequestStatusIcons[status] ?? <UnknownIcon />;
}
