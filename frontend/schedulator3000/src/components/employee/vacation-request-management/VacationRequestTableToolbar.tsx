import { alpha, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { Add, CancelRounded, Edit } from '@mui/icons-material';
import React from 'react';
import { VacationRequest, VacationRequestStatus } from '../../../models/VacationRequest';

type VacationRequestTableToolbarProps = {
    selected: VacationRequest | null,
    actions: {
        create: VoidFunction,
        edit: VoidFunction,
        cancel: VoidFunction,
    },
};

export function VacationRequestTableToolbar({
                                                selected,
                                                actions: { create, edit, cancel },
                                            }: VacationRequestTableToolbarProps) {
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
            { selected !== null ? (
                <Typography
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    #{ selected.id } Selected
                </Typography>
            ) : (
                <Typography
                    variant="h5"
                    id="tableTitle"
                    component="div"
                >
                    Vacation Requests
                </Typography>
            ) }

            { selected !== null ? (
                <div>
                    <Tooltip title="Cancel request">
                        <span>
                        <IconButton onClick={ cancel }
                                    disabled={ selected.status.toUpperCase() !== VacationRequestStatus.Pending }>
                            <CancelRounded />
                        </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <span>
                        <IconButton onClick={ edit }
                                    disabled={ selected.status.toUpperCase() !== VacationRequestStatus.Pending }>
                            <Edit />
                        </IconButton>
                        </span>
                    </Tooltip>
                </div>
            ) : (<div>
                    <Tooltip title="Request">
                        <IconButton onClick={ create }>
                            <Add />
                        </IconButton>
                    </Tooltip>
                </div>
            ) }
        </Toolbar>
    );
}
