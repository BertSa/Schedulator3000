import { alpha, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { CheckCircle, FlagCircle } from '@mui/icons-material';
import React from 'react';
import { VacationRequest, VacationRequestStatus } from '../../../models/VacationRequest';

type VacationRequestManagementTableToolbarProps = {
    selected: VacationRequest | null,
    rejectRequest: VoidFunction,
    approveRequest: VoidFunction,
};

export function VacationRequestManagementTableToolbar({
                                                          selected,
                                                          rejectRequest,
                                                          approveRequest
                                                      }: VacationRequestManagementTableToolbarProps) {
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
                    Vacation Requests Management
                </Typography>
            ) }

            { selected !== null && <div>
                <Tooltip
                    title={ selected.status.toUpperCase() === VacationRequestStatus.Cancelled ? 'Request cancelled by the employee' : selected.status.toUpperCase() === VacationRequestStatus.Rejected ? 'Already rejected' : 'Reject' }>
                        <span>
                        <IconButton onClick={ rejectRequest }
                                    disabled={ selected.status.toUpperCase() === VacationRequestStatus.Cancelled || selected.status.toUpperCase() === VacationRequestStatus.Rejected }>
                            <FlagCircle />
                        </IconButton>
                        </span>
                </Tooltip>
                <Tooltip
                    title={ selected.status.toUpperCase() === VacationRequestStatus.Cancelled ? 'Request cancelled by the employee' : selected.status.toUpperCase() === VacationRequestStatus.Approved ? 'Already approved' : 'Approve' }>
                        <span>
                        <IconButton onClick={ approveRequest }
                                    disabled={ selected.status.toUpperCase() === VacationRequestStatus.Cancelled || selected.status.toUpperCase() === VacationRequestStatus.Approved }>
                            <CheckCircle />
                        </IconButton>
                        </span>
                </Tooltip>
            </div> }
        </Toolbar>
    );
}
