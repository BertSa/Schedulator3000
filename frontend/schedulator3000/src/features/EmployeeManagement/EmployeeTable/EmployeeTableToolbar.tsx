import { alpha, SxProps, Theme, Toolbar } from '@mui/material';
import React from 'react';
import { Employee } from '../../../models/User';
import { Nullable } from '../../../models/Nullable';
import EmployeeTableToolbarActionButtons from './EmployeeTableToolbarActionButtons';
import EmployeeTableToolbarTitle from './EmployeeTableToolbarTitle';

export interface IEnhancedTableToolbarProps {
  selected: Nullable<Employee>;
  actions: {
    create: VoidFunction;
    edit: VoidFunction;
    fire: VoidFunction;
  };
}

export default function EmployeeTableToolbar({ selected, actions }: IEnhancedTableToolbarProps) {
  const toolbarSx: SxProps<Theme> = {
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
    ...(selected && {
      bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
    }),
  };

  return (
    <Toolbar sx={toolbarSx}>
      <EmployeeTableToolbarTitle selected={selected} />
      <EmployeeTableToolbarActionButtons selected={selected} actions={actions} />
    </Toolbar>
  );
}
