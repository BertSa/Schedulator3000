import { alpha, IconButton, SxProps, Theme, Toolbar, Tooltip, Typography } from '@mui/material';
import { CheckCircle, Delete, Edit, FlagCircle } from '@mui/icons-material';
import React from 'react';
import { IVacationRequest } from '../../models/IVacationRequest';
import { Nullable } from '../../models/Nullable';
import { VacationRequestStatus } from '../../enums/VacationRequestStatus';

interface IVacationRequestManagementTableToolbarProps {
  selectedVacationRequest: Nullable<IVacationRequest>;
  actions: {
    approve: VoidFunction;
    reject: VoidFunction;
    edit: VoidFunction;
    del: VoidFunction;
  };
}

export default function VacationRequestManagementTableToolbar({
  selectedVacationRequest,
  actions: { approve, reject, del, edit },
}: IVacationRequestManagementTableToolbarProps) {
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
          <Tooltip title="Delete">
            <span>
              <IconButton
                onClick={del}
                disabled={selectedVacationRequest.status.toUpperCase() !== VacationRequestStatus.Pending
                  && selectedVacationRequest.status.toUpperCase() !== VacationRequestStatus.Rejected}
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Edit">
            <span>
              <IconButton onClick={edit}>
                <Edit />
              </IconButton>
            </span>
          </Tooltip>
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
