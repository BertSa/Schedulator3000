import { alpha, IconButton, SxProps, Theme, Toolbar, Tooltip, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import React from 'react';
import { SelectedItemType } from './AvailabilitiesTable';

interface AvailabilitiesTableToolbarProps {
  selectedItem: SelectedItemType;
  actions: {
    create: VoidFunction;
    edit: VoidFunction;
    remove: VoidFunction;
  };
}

export default function AvailabilitiesTableToolbar({
  selectedItem,
  actions: { create, edit, remove },
}: AvailabilitiesTableToolbarProps) {
  const toolbarSx: SxProps<Theme> = {
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
    justifyContent: 'space-between',
    ...(selectedItem && {
      bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
    }),
  };
  return (
    <Toolbar sx={toolbarSx}>
      <Typography variant="h5" id="tableTitle" component="div">
        Availabilities
      </Typography>
      {selectedItem && (
        <div>
          <Tooltip title="Delete">
            <span>
              <IconButton onClick={remove} disabled={!selectedItem.availability}>
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Edit">
            <span>
              <IconButton onClick={edit} disabled={!selectedItem.availability}>
                <Edit />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Add">
            <span>
              <IconButton
                onClick={create}
                disabled={selectedItem.availability !== null}
              >
                <Add />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
}
