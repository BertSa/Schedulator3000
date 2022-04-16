import { alpha, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { Add, CancelRounded, Edit } from '@mui/icons-material';
import React from 'react';
import { VacationRequest, VacationRequestStatus } from '../../models/VacationRequest';

type VacationRequestTableToolbarProps = {
    selected: VacationRequest | null,
    cancelRequest: VoidFunction,
    createRequest: VoidFunction,
    editRequest: VoidFunction,
};

export function VacationRequestTableToolbar({
                                                selected,
                                                cancelRequest,
                                                createRequest,
                                                editRequest
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
                        <IconButton onClick={ cancelRequest }
                                    disabled={ selected.status.toUpperCase() !== VacationRequestStatus.Pending }>
                            <CancelRounded />
                        </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <span>
                        <IconButton onClick={editRequest} disabled={ selected.status.toUpperCase() !== VacationRequestStatus.Pending }>
                            <Edit />
                        </IconButton>
                        </span>
                    </Tooltip>
                </div>
            ) : (<div>
                    <Tooltip title="Request">
                        <IconButton onClick={ createRequest }>
                            <Add />
                        </IconButton>
                    </Tooltip>
                </div>
            ) }
        </Toolbar>
    );
}
