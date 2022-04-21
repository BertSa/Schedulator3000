import { TableCell, TableRow } from '@mui/material';
import { VacationRequestStatusIcon } from './VacationRequestStatusIcon';
import React from 'react';
import { VacationRequest } from '../../../models/VacationRequest';


interface VacationRequestTableRowProps {
    request: VacationRequest;
    isSelected: boolean;
    onClick: VoidFunction;
}

export function VacationRequestTableRow({request, isSelected, onClick}: VacationRequestTableRowProps) {

    return <>
        <TableRow
            selected={ isSelected }
            hover
            sx={ {
                cursor: 'pointer',
                '&:last-child td, &:last-child th': {border: 0},
            } }
            onClick={ onClick }>
            <TableCell component="th" scope="row">
                { request.id }
            </TableCell>
            <TableCell>
                { request.startDate }
            </TableCell>
            <TableCell>
                { request.endDate }
            </TableCell>
            <TableCell>
                { request.reason }
            </TableCell>
            <TableCell align="center">
                <VacationRequestStatusIcon status={ request.status } />
            </TableCell>
        </TableRow>
    </>;
}
