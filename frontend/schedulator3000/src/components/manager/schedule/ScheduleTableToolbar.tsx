import { alpha, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { Add, ArrowBack, ArrowForward, Edit, LocalFireDepartment } from '@mui/icons-material';
import React from 'react';
import { Employee } from '../../../models/User';
import { Shift } from '../../../models/Shift';
import { addDays, format } from 'date-fns';

type ScheduleTableToolbarProps = {
    currentWeek: Date,
    prev: VoidFunction,
    next: VoidFunction,
    selected: null | { employee: Employee, day: number, shift: Shift | undefined },
    create: VoidFunction,
};

export function ScheduleTableToolbar({currentWeek, prev, next, selected,create}: ScheduleTableToolbarProps) {
    const getDateOfDay = (day: number) => {
        console.log(day);
        console.log(currentWeek);
        console.log(addDays(currentWeek, day));
        return format(addDays(new Date(currentWeek), day), 'yyyy-MM-dd');
    };

    return (
        <Toolbar
            sx={ {
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                justifyContent: 'space-between',
                ...(selected !== null && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            } }
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
                        <Tooltip title="Promote to customer">
                            <IconButton>
                                <LocalFireDepartment />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Add">
                            <IconButton onClick={create}>
                                <Add />
                            </IconButton>
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
