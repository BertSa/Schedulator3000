import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Add, Edit, LocalFireDepartment } from '@mui/icons-material';
import { IEnhancedTableToolbarProps } from './EmployeeTableToolbar';

export default function EmployeeTableToolbarActionButtons({ selected, actions: { create, edit, fire } }: IEnhancedTableToolbarProps) {
  if (selected) {
    return (
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
    );
  }

  return (
    <Tooltip title="Add new employee">
      <IconButton onClick={create}>
        <Add />
      </IconButton>
    </Tooltip>
  );
}
