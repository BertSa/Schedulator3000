import React, { useEffect, useState } from 'react';
import { VacationRequest, VacationRequestUpdateStatus } from '../../../models/VacationRequest';
import { useServices } from '../../../hooks/use-services/use-services';
import { useAuth } from '../../../hooks/use-auth';
import { Employee } from '../../../models/User';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { VacationRequestTableToolbar } from './VacationRequestTableToolbar';
import { useDialog } from '../../../hooks/use-dialog';
import { VacationRequestFormCreate } from './form/VacationRequestFormCreate';
import { VacationRequestFormEdit } from './form/VacationRequestFormEdit';
import { Nullable } from '../../../models/Nullable';
import { VacationRequestTableRow } from './VacationRequestTableRow';


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
                        { vacations.map(request => <VacationRequestTableRow key={ request.id }
                                                                            request={ request }
                                                                            isSelected={ selectedVacation?.id === request.id}
                                                                            onClick={ () => setSelectedVacation(selected => selected?.id === request.id ? null : request) }
                        />) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </>;
}
