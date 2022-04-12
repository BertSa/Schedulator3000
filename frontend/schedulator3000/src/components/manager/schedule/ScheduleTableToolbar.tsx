import { IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import React from 'react';

type ScheduleTableToolbarProps = {
    currentWeek: string,
    prev: VoidFunction,
    next: VoidFunction
};

export function ScheduleTableToolbar({currentWeek, prev, next}: ScheduleTableToolbarProps) {
    return (
        <Toolbar
            sx={ {
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                justifyContent: 'space-between',
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
                { currentWeek }
            </Typography>
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
            </div>
        </Toolbar>
    );
}
