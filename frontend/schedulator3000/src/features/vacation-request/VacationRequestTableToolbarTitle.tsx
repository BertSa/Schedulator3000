import { Typography } from '@mui/material';
import React from 'react';
import { Nullable } from '../../models/Nullable';

export default function VacationRequestTableToolbarTitle(
  { selectedVacationRequest }: { selectedVacationRequest: Nullable<number> }) {
  if (selectedVacationRequest) {
    return (
      <Typography id="tableTitle" component="div" variant="subtitle1" color="inherit">
        {`#${selectedVacationRequest} selected`}
      </Typography>
    );
  }

  return (
    <Typography id="tableTitle" component="div" variant="h5">
      Vacation Requests Management
    </Typography>
  );
}
