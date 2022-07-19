import { alpha, SxProps, Theme, Toolbar } from '@mui/material';
import React from 'react';
import { IVacationRequest } from '../models/IVacationRequest';
import { Nullable } from '../../../models/Nullable';
import VacationRequestTableToolbarTitle from '../VacationRequestTableToolbarTitle';
import VacationRequestManagementTableToolbarActions from './VacationRequestManagementTableToolbarActions';

export interface IVacationRequestManagementTableToolbarProps {
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
  actions,
}: IVacationRequestManagementTableToolbarProps) {
  const toolbarSx: SxProps<Theme> = {
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
    justifyContent: 'space-between',
    ...(selectedVacationRequest && {
      bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
    }),
  };

  return (
    <Toolbar sx={toolbarSx}>
      <VacationRequestTableToolbarTitle selectedVacationRequest={selectedVacationRequest?.id ?? null} />
      <VacationRequestManagementTableToolbarActions selectedVacationRequest={selectedVacationRequest} actions={actions} />
    </Toolbar>
  );
}
