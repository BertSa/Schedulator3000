import React, { useEffect, useState } from 'react';
import { VacationRequest, VacationRequestStatus, VacationRequestUpdateStatus } from '../../../models/VacationRequest';
import { useServices } from '../../../hooks/use-services/use-services';
import { useAuth } from '../../../hooks/use-auth';
import { Employee } from '../../../models/User';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { VacationRequestTableToolbar } from './VacationRequestTableToolbar';
import { Cancel, CheckCircle, FlagCircle, Timer } from '@mui/icons-material';
import { useDialog } from '../../../hooks/use-dialog';
import { VacationRequestFormCreate } from './VacationRequestFormCreate';
import { VacationRequestFormEdit } from './VacationRequestFormEdit';
import { Nullable } from '../../../models/Nullable';


export function VacationRequestTable() {
    const [vacations, setVacations] = useState<VacationRequest[]>([]);
    const [selectedVacation, setSelectedVacation] = useState<Nullable<VacationRequest>>(null);
    const {vacationRequestService} = useServices();
    const [openDialog, closeDialog] = useDialog();
    const employee: Employee = useAuth().getEmployee();

    useEffect(() => {
        vacationRequestService.getAllByEmployeeEmail(employee.email).then(response => setVacations(response));
    }, [employee.email]);

    function createAction() {
        return openDialog(<VacationRequestFormCreate setVacations={ setVacations }
                                                     employee={ employee }
                                                     closeMainDialog={ closeDialog }
                                                     vacationRequestService={ vacationRequestService } />);
    }

    function editAction() {
        return openDialog(<VacationRequestFormEdit setVacations={ setVacations }
                                                   closeMainDialog={ closeDialog }
                                                   vacationRequestService={ vacationRequestService }
                                                   vacationRequest={ selectedVacation as VacationRequest } />);
    }


    function Row({request}: { request: VacationRequest }) {

        let status: any = null;
        switch (request.status.toUpperCase()) {
            case VacationRequestStatus.Rejected:
                status = <Tooltip title="Rejected"><FlagCircle color="error" /></Tooltip>;
                break;
            case VacationRequestStatus.Approved:
                status = <Tooltip title="Approved"><CheckCircle color="success" /></Tooltip>;
                break;
            case VacationRequestStatus.Cancelled:
                status = <Tooltip title="Cancelled"><Cancel color="warning" /></Tooltip>;
                break;
            case VacationRequestStatus.Pending:
                status = <Tooltip title="Pending"><Timer color="info" /></Tooltip>;
                break;
        }

        return <>
            <TableRow
                selected={ selectedVacation?.id === request.id }
                hover
                sx={ {
                    cursor: 'pointer',
                    '&:last-child td, &:last-child th': {border: 0},
                } }
                onClick={ () => setSelectedVacation(selected => selected?.id === request.id ? null : request) }>
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
                    { status }
                </TableCell>
            </TableRow>
        </>;
    }

    function cancelAction(): void {
        if (!selectedVacation) {
            return;
        }
        vacationRequestService.updateStatus(selectedVacation.id, VacationRequestUpdateStatus.Cancel)
            .then(response => {
                setVacations(current => [...current.filter(v => v.id !== selectedVacation.id), response]);
                setSelectedVacation(response);
            });
    }

    return <>
        <Container maxWidth="lg">
            <TableContainer component={ Paper }>
                <VacationRequestTableToolbar selected={ selectedVacation }
                                             actions={ {
                                                 create: createAction,
                                                 edit: editAction,
                                                 cancel: cancelAction,
                                             } } />
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>
                                Start Date
                            </TableCell>
                            <TableCell>
                                End Date
                            </TableCell>
                            <TableCell>
                                Reason
                            </TableCell>
                            <TableCell align="center">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { vacations.map((value) => <Row key={ value.id } request={ value } />) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </>;
}
