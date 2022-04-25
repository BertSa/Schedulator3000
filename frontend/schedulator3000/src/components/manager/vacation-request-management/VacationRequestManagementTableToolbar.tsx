import { alpha, IconButton, SxProps, Theme, Toolbar, Tooltip, Typography } from '@mui/material';
import { CheckCircle, FlagCircle } from '@mui/icons-material';
import React from 'react';
import { VacationRequest, VacationRequestStatus } from '../../../models/VacationRequest';
import { Nullable } from '../../../models/Nullable';

interface VacationRequestManagementTableToolbarProps {
  selectedVacationRequest: Nullable<VacationRequest>;
  actions: {
    approve: VoidFunction;
    reject: VoidFunction;
  };
}

export default function VacationRequestManagementTableToolbar({
  selectedVacationRequest,
  actions: { approve, reject },
}: VacationRequestManagementTableToolbarProps) {
  const toolbarSx: SxProps<Theme> = {
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
    justifyContent: 'space-between',
    ...(selectedVacationRequest && {
      bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
    }),
  };

  let titleReject: string;
  switch (selectedVacationRequest?.status.toUpperCase()) {
    case VacationRequestStatus.Cancelled:
      titleReject = 'Request cancelled by the employee';
      break;
    case VacationRequestStatus.Rejected:
      titleReject = 'Already rejected';
      break;
    default:
      titleReject = 'Reject';
  }

  let titleApprove: string;
  switch (selectedVacationRequest?.status.toUpperCase()) {
    case VacationRequestStatus.Approved:
      titleApprove = 'Already approved';
      break;
    case VacationRequestStatus.Cancelled:
      titleApprove = 'Request cancelled by the employee';
      break;
    default:
      titleApprove = 'Approve';
  }

  return (
    <Toolbar sx={toolbarSx}>
      {selectedVacationRequest ? (
        <Typography color="inherit" variant="subtitle1" component="div">
          {`#${selectedVacationRequest.id} selected`}
        </Typography>
      ) : (
        <Typography variant="h5" id="tableTitle" component="div">
          Vacation Requests Management
        </Typography>
      )}

      {selectedVacationRequest && (
        <div>
          <Tooltip title={titleReject}>
            <span>
              <IconButton
                onClick={reject}
                disabled={
                  selectedVacationRequest.status.toUpperCase() === VacationRequestStatus.Cancelled
                  || selectedVacationRequest.status.toUpperCase() === VacationRequestStatus.Rejected
                }
              >
                <FlagCircle />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={titleApprove}>
            <span>
              <IconButton
                onClick={approve}
                disabled={
                  selectedVacationRequest.status.toUpperCase() === VacationRequestStatus.Cancelled
                  || selectedVacationRequest.status.toUpperCase() === VacationRequestStatus.Approved
                }
              >
                <CheckCircle />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
}
