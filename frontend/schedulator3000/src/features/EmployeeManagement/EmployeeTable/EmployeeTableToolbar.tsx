import { alpha, IconButton, SxProps, Theme, Toolbar, Tooltip, Typography } from '@mui/material';
import { Add, Edit, LocalFireDepartment } from '@mui/icons-material';
import React from 'react';
import { Employee } from '../../../models/User';
import { Nullable } from '../../../models/Nullable';

interface IEnhancedTableToolbarProps {
  selected: Nullable<Employee>;
  actions: {
    create: VoidFunction;
    edit: VoidFunction;
    fire: VoidFunction;
  };
}

export default function EmployeeTableToolbar({ selected, actions: { create, edit, fire } }: IEnhancedTableToolbarProps) {
  const toolbarSx: SxProps<Theme> = {
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
    ...(selected && {
      bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
    }),
  };

  return (
    <Toolbar sx={toolbarSx}>
      {selected ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {`${selected.firstName} ${selected.lastName} selected`}
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h5" id="tableTitle" component="div">
          Employees
        </Typography>
      )}
      {selected ? (
        <>
          <Tooltip title="Edit">
            <IconButton onClick={edit}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Promote to customer">
            <IconButton onClick={fire}>
              <LocalFireDepartment />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Add new employee">
          <IconButton onClick={create}>
            <Add />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
