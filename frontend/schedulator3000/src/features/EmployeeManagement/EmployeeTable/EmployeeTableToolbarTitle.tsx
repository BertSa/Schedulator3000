import { Typography } from '@mui/material';
import React from 'react';
import { Nullable } from '../../../models/Nullable';
import { Employee } from '../../../models/User';

export default function EmployeeTableToolbarTitle({ selected }: { selected: Nullable<Employee> }) {
  if (selected) {
    return (
      <Typography id="tableTitle" component="div" sx={{ flex: '1 1 100%' }} variant="subtitle1" color="inherit">
        {`${selected.firstName} ${selected.lastName} selected`}
      </Typography>
    );
  }

  return (
    <Typography id="tableTitle" component="div" sx={{ flex: '1 1 100%' }} variant="h5">
      Employees
    </Typography>
  );
}
