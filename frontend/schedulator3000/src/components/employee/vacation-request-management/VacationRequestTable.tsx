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
    const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
    const [selectedVacationRequest, setSelectedVacationRequest] = useState<Nullable<VacationRequest>>(null);
    const {vacationRequestService} = useServices();
    const [openDialog, closeDialog] = useDialog();
    const employee: Employee = useAuth().getEmployee();

    useEffect(() => {
        vacationRequestService.getAllByEmployeeEmail(employee.email).then(response => setVacationRequests(response));
    }, [employee.email]);

    function callback(vacationRequest: VacationRequest): void {
        closeDialog();
        setVacationRequests(current => [...current.filter(value => value.id !== vacationRequest.id), vacationRequest]);
    }

    function createAction(): void {
        return openDialog(<VacationRequestFormCreate vacationRequestService={ vacationRequestService }
                                                     callback={ callback }
                                                     onCancel={ closeDialog }
                                                     employee={ employee } />);
    }

    function editAction(): void {
        return openDialog(<VacationRequestFormEdit vacationRequestService={ vacationRequestService }
                                                   callback={ callback }
                                                   onCancel={ closeDialog }
                                                   vacationRequest={ selectedVacationRequest as VacationRequest } />);
    }

    function cancelAction(): void {
        if (!selectedVacationRequest) {
            return;
        }
        vacationRequestService.updateStatus(selectedVacationRequest.id, VacationRequestUpdateStatus.Cancel)
            .then(response => {
                setVacationRequests(current => [...current.filter(v => v.id !== selectedVacationRequest.id), response]);
                setSelectedVacationRequest(response);
            });
    }

    return <>
        <Container maxWidth="lg">
            <TableContainer component={ Paper }>
                <VacationRequestTableToolbar selected={ selectedVacationRequest }
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
                        { vacationRequests.map(request => <VacationRequestTableRow key={ request.id }
                                                                                   request={ request }
                                                                                   isSelected={ selectedVacationRequest?.id === request.id }
                                                                                   onClick={ () => setSelectedVacationRequest(selected => selected?.id === request.id ? null : request) }
                        />) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </>;
}
