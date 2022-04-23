import { VacationRequest } from '../../../models/VacationRequest';
import { Employee } from '../../../models/User';
import { TableCell, TableRow } from '@mui/material';
import { VacationRequestStatusIcon } from '../../employee/vacation-request-management/VacationRequestStatusIcon';
import React from 'react';


interface VacationRequestManagementTableRowProps {
    vacationRequest: VacationRequest,
    employee: Employee,
    isSelected: boolean,
    onClick: VoidFunction
}

export function VacationRequestManagementTableRow({
                                                      vacationRequest,
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
            <TableCell component="th" scope="row" width="5%">
                { vacationRequest.id }
            </TableCell>
            <TableCell width="15%">
                { employee?.firstName + ' ' + employee?.lastName }
            </TableCell>
            <TableCell width="10%">
                { vacationRequest.startDate }
            </TableCell>
            <TableCell width="10%">
                { vacationRequest.endDate }
            </TableCell>
            <TableCell>
                { vacationRequest.reason }
            </TableCell>
            <TableCell align="center" width="10%">
                <VacationRequestStatusIcon status={ vacationRequest.status } />
            </TableCell>
        </TableRow>
    </>;
}
