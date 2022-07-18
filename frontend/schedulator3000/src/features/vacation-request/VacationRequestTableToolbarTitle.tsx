import { Typography } from '@mui/material';
import React from 'react';
import { IVacationRequest } from '../../models/IVacationRequest';

export default function VacationRequestTableToolbarTitle(
  { selectedVacationRequest }: { selectedVacationRequest: IVacationRequest | null }) {
  if (selectedVacationRequest) {
    return (
      <Typography id="tableTitle" component="div" variant="subtitle1" color="inherit">
        {`#${selectedVacationRequest.id} selected`}
      </Typography>
    );
  }

  return (
    <Typography id="tableTitle" component="div" variant="h5">
      Vacation Requests Management
    </Typography>
  );
}
