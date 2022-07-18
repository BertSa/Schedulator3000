import { alpha, SxProps, Theme, Toolbar } from '@mui/material';
import React from 'react';
import { IVacationRequest } from '../../../models/IVacationRequest';
import { Nullable } from '../../../models/Nullable';
import VacationRequestTableToolbarTitle from '../VacationRequestTableToolbarTitle';
import VacationRequestTableToolbarActions from './VacationRequestTableToolbarActions';

export interface IVacationRequestTableToolbarProps {
  selected: Nullable<IVacationRequest>;
  actions: {
    create: VoidFunction;
    edit: VoidFunction;
    cancel: VoidFunction;
    del: VoidFunction;
  };
}

export default function VacationRequestTableToolbar({
  selected,
  actions,
}: IVacationRequestTableToolbarProps) {
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
      <VacationRequestTableToolbarTitle selectedVacationRequest={selected} />
      <VacationRequestTableToolbarActions selected={selected} actions={actions} />

    </Toolbar>
  );
}
