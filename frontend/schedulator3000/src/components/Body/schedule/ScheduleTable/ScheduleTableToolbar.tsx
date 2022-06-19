import { alpha, IconButton, SxProps, Theme, Toolbar, Tooltip, Typography } from '@mui/material';
import { Add, ArrowBack, ArrowForward, Delete, Edit } from '@mui/icons-material';
import React from 'react';
import { addDays, format } from 'date-fns';
import { SelectedItemType } from './ScheduleTable';

interface ScheduleTableToolbarProps {
  currentWeek: Date;
  selectedItem: SelectedItemType;
  actionsDisabled: boolean;
  actions: {
    prev: VoidFunction;
    next: VoidFunction;
    create: VoidFunction;
    edit: VoidFunction;
    remove: VoidFunction;
  };
}

export default function ScheduleTableToolbar({
  currentWeek,
  selectedItem,
  actionsDisabled,
  actions: { prev, next, create, edit, remove },
}: ScheduleTableToolbarProps) {
  const getDateOfDay = (day: number) => format(addDays(new Date(currentWeek), day), 'yyyy-MM-dd');

  const toolbarSx: SxProps<Theme> = {
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
    justifyContent: 'space-between',
    ...(selectedItem && {
      bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
    }),
  };
  return (
    <Toolbar sx={toolbarSx}>
      <Typography variant="h5" id="tableTitle" component="div">
        Schedule
      </Typography>
      <Typography variant="h6" id="tableTitle" component="div">
        {selectedItem ? getDateOfDay(selectedItem.day) : format(currentWeek, 'yyyy-MM-dd')}
      </Typography>
      {selectedItem ? (
        <div>
          <Tooltip title="Delete">
            <span>
              <IconButton onClick={remove} disabled={!selectedItem.shift}>
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Edit">
            <span>
              <IconButton onClick={edit} disabled={!selectedItem.shift}>
                <Edit />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Add">
            <span>
              <IconButton onClick={create} disabled={selectedItem.shift !== null}>
                <Add />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      ) : (
        <div>
          <Tooltip title={actionsDisabled ? 'Add an employee first' : 'Previous Week'}>
            <span>
              <IconButton onClick={prev} disabled={actionsDisabled}>
                <ArrowBack />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={actionsDisabled ? 'Add an employee first' : 'Next Week'}>
            <span>
              <IconButton onClick={next} disabled={actionsDisabled}>
                <ArrowForward />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
}
