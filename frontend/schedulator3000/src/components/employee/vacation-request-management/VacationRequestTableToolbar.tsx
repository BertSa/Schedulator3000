import { alpha, IconButton, SxProps, Theme, Toolbar, Tooltip, Typography } from '@mui/material';
import { Add, CancelRounded, Delete, Edit } from '@mui/icons-material';
import React from 'react';
import { VacationRequest, VacationRequestStatus } from '../../../models/VacationRequest';
import { Nullable } from '../../../models/Nullable';

interface VacationRequestTableToolbarProps {
  selected: Nullable<VacationRequest>;
  actions: {
    create: VoidFunction;
    edit: VoidFunction;
    cancel: VoidFunction;
    del: VoidFunction;
  };
}

export default function VacationRequestTableToolbar({
  selected,
  actions: { create, edit, cancel, del },
}: VacationRequestTableToolbarProps) {
  const toolbarSx: SxProps<Theme> = {
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
    justifyContent: 'space-between',
    ...(selected && {
      bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
    }),
  };

  return (
    <Toolbar sx={toolbarSx}>
      {selected ? (
        <Typography color="inherit" variant="subtitle1" component="div">
          {`#${selected.id} Selected`}
        </Typography>
      ) : (
        <Typography variant="h5" id="tableTitle" component="div">
          Vacation Requests
        </Typography>
      )}

      {selected ? (
        <div>
          <Tooltip title="Delete">
            <span>
              <IconButton
                onClick={del}
                disabled={selected.status.toUpperCase() !== VacationRequestStatus.Pending
                  && selected.status.toUpperCase() !== VacationRequestStatus.Rejected}
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Cancel request">
            <span>
              <IconButton onClick={cancel} disabled={selected.status.toUpperCase() !== VacationRequestStatus.Approved}>
                <CancelRounded />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Edit">
            <span>
              <IconButton onClick={edit} disabled={selected.status.toUpperCase() !== VacationRequestStatus.Pending}>
                <Edit />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      ) : (
        <div>
          <Tooltip title="Request">
            <IconButton onClick={create}>
              <Add />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
}
