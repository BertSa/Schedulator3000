import { alpha, IconButton, SxProps, Theme, Toolbar, Tooltip, Typography } from '@mui/material';
import { CheckCircle, FlagCircle } from '@mui/icons-material';
import React from 'react';
import { VacationRequest, VacationRequestStatus } from '../../../models/VacationRequest';
import { Nullable } from '../../../models/Nullable';

interface VacationRequestManagementTableToolbarProps {
    selected: Nullable<VacationRequest>,
    actions: {
        approve: VoidFunction,
        reject: VoidFunction,
    },
}

export function VacationRequestManagementTableToolbar({
                                                          selected,
                                                          actions: {
                                                              approve,
                                                              reject,
                                                          }
                                                      }: VacationRequestManagementTableToolbarProps) {
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
        <Toolbar sx={ toolbarSx }>
            { selected ? (
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
                    Vacation Requests Management
                </Typography>
            ) }

            { selected && <div>
                <Tooltip
                    title={ selected.status.toUpperCase() === VacationRequestStatus.Cancelled ? 'Request cancelled by the employee' : selected.status.toUpperCase() === VacationRequestStatus.Rejected ? 'Already rejected' : 'Reject' }>
                        <span>
                        <IconButton onClick={ reject }
                                    disabled={ selected.status.toUpperCase() === VacationRequestStatus.Cancelled || selected.status.toUpperCase() === VacationRequestStatus.Rejected }>
                            <FlagCircle />
                        </IconButton>
                        </span>
                </Tooltip>
                <Tooltip
                    title={ selected.status.toUpperCase() === VacationRequestStatus.Cancelled ? 'Request cancelled by the employee' : selected.status.toUpperCase() === VacationRequestStatus.Approved ? 'Already approved' : 'Approve' }>
                        <span>
                        <IconButton onClick={ approve }
                                    disabled={ selected.status.toUpperCase() === VacationRequestStatus.Cancelled || selected.status.toUpperCase() === VacationRequestStatus.Approved }>
                            <CheckCircle />
                        </IconButton>
                        </span>
                </Tooltip>
            </div> }
        </Toolbar>
    );
}
