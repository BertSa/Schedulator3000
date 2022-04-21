import { alpha, IconButton, SxProps, Theme, Toolbar, Tooltip, Typography } from '@mui/material';
import { Add, ArrowBack, ArrowForward, Delete, Edit } from '@mui/icons-material';
import React from 'react';
import { addDays, format } from 'date-fns';
import { SelectedType } from './ScheduleTable';

interface ScheduleTableToolbarProps {
    currentWeek: Date,
    selected: SelectedType,
    actions: {
        prev: VoidFunction,
        next: VoidFunction,
        create: VoidFunction,
        edit: VoidFunction,
        remove: VoidFunction,
    }
}

export function ScheduleTableToolbar({
                                         currentWeek,
                                         selected,
                                         actions: {prev, next, create, edit, remove}
                                     }: ScheduleTableToolbarProps) {
    const getDateOfDay = (day: number) => format(addDays(new Date(currentWeek), day), 'yyyy-MM-dd');

    const toolbarSx: SxProps<Theme> = {
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
        justifyContent: 'space-between',
        ...(selected && {
            bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
    };
    return (
        <Toolbar
            sx={ toolbarSx }
        >
            <Typography
                variant="h5"
                id="tableTitle"
                component="div"
            >
                Schedule
            </Typography>
            <Typography
                variant="h6"
                id="tableTitle"
                component="div"
            >
                { selected !== null ? getDateOfDay(selected.day) : format(currentWeek, 'yyyy-MM-dd') }
            </Typography>
            { selected !== null ? (
                    <div>
                        <Tooltip title="Delete">
                            <span>
                            <IconButton onClick={ remove }
                                        disabled={ !selected?.shift }>
                                <Delete />
                            </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <span>
                            <IconButton onClick={ edit }
                                        disabled={ !selected?.shift }>
                                <Edit />
                            </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Add">
                            <span>
                            <IconButton onClick={ create }
                                        disabled={ !!selected?.shift }>
                                <Add />
                            </IconButton>
                            </span>
                        </Tooltip>
                    </div>
                ) :
                <div>
                    <Tooltip title="Previous Week">
                        <IconButton onClick={ prev }>
                            <ArrowBack />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Next Week">
                        <IconButton onClick={ next }>
                            <ArrowForward />
                        </IconButton>
                    </Tooltip>
                </div> }
        </Toolbar>
    );
}
