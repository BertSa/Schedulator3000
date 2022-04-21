import { VacationRequest } from '../../../models/VacationRequest';
import { Employee } from '../../../models/User';
import { TableCell, TableRow } from '@mui/material';
import { VacationRequestStatusIcon } from '../../employee/vacation-request-management/VacationRequestStatusIcon';
import React from 'react';


interface VacationRequestManagementTableRowProps {
    request: VacationRequest,
    employee: Employee,
    isSelected: boolean,
    onClick: VoidFunction
}

export function VacationRequestManagementTableRow({
                                                      request,
                                                      employee,
                                                      isSelected,
                                                      onClick
                                                  }: VacationRequestManagementTableRowProps) {

    return <>
        <TableRow selected={ isSelected }
                  hover
                  onClick={ onClick }
                  sx={ {
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': {border: 0},
                  } }>
            <TableCell component="th" scope="row">
                { request.id }
            </TableCell>
            <TableCell>
                { employee?.firstName + ' ' + employee?.lastName }
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
