import { SvgIconComponent } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import React from 'react';

interface IVacationRequestTableToolbarActionProps {
  title: string,
  action: VoidFunction,
  icon: SvgIconComponent,
  disabled?: boolean,
}
export default function VacationRequestTableToolbarAction({
  title,
  action,
  disabled,
  icon: Ico,
}: IVacationRequestTableToolbarActionProps) {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          onClick={action}
          disabled={disabled}
        >
          <Ico />
        </IconButton>
      </span>
    </Tooltip>
  );
}

VacationRequestTableToolbarAction.defaultProps = {
  disabled: false,
};
