import { Button, IconButton, Tooltip } from '@mui/material';
import { Add, ArrowBack, ArrowForward, Delete, Edit, SvgIconComponent } from '@mui/icons-material';
import React from 'react';
import { Nullable } from '../../../models/Nullable';
import { ISelectedScheduleTableCell } from '../contexts/SelectedScheduleTableCellContext';

interface IScheduleTableToolbarActionProps {
  title: string,
  onClick: VoidFunction,
  disabled: boolean,
  icon: SvgIconComponent,
}

function ScheduleTableToolbarAction({ title, onClick, disabled, icon: Icon }: IScheduleTableToolbarActionProps) {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton onClick={onClick} disabled={disabled}>
          <Icon />
        </IconButton>
      </span>
    </Tooltip>
  );
}

interface IScheduleTableToolbarActionsProps {
  selectedItem: Nullable<ISelectedScheduleTableCell>,
  actionsDisabled: boolean,
  actions: {
    remove: VoidFunction,
    create: VoidFunction,
    edit: VoidFunction,
    prev: VoidFunction,
    next: VoidFunction,
    today: VoidFunction,
  },
}

export default function ScheduleTableToolbarActions({
  selectedItem,
  actionsDisabled,
  actions: { remove, create, edit, prev, next, today },
}: IScheduleTableToolbarActionsProps) {
  if (selectedItem) {
    return (
      <div>
        <ScheduleTableToolbarAction
          title="Delete"
          icon={Delete}
          onClick={remove}
          disabled={!selectedItem.shift}
        />
        <ScheduleTableToolbarAction
          title="Edit"
          icon={Edit}
          onClick={edit}
          disabled={!selectedItem.shift}
        />
        <ScheduleTableToolbarAction
          title="Add"
          icon={Add}
          onClick={create}
          disabled={selectedItem.shift !== null}
        />
      </div>
    );
  }
  return (
    <div>
      <ScheduleTableToolbarAction
        title={actionsDisabled ? 'Add an employee first' : 'Previous Week'}
        icon={ArrowBack}
        onClick={prev}
        disabled={actionsDisabled}
      />
      <Button sx={{ height: '100%' }} color="inherit" onClick={today}>
        Today
      </Button>
      <ScheduleTableToolbarAction
        title={actionsDisabled ? 'Add an employee first' : 'Next Week'}
        icon={ArrowForward}
        onClick={next}
        disabled={actionsDisabled}
      />
    </div>
  );
}
