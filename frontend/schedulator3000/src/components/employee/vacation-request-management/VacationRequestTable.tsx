import React, { useState } from 'react';
import { VacationRequest, VacationRequestUpdateStatus } from '../../../models/VacationRequest';
import { useServices } from '../../../hooks/use-services/use-services';
import { useAuth } from '../../../hooks/use-auth';
import { Employee } from '../../../models/User';
import { Container, Icon, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import VacationRequestTableToolbar from './VacationRequestTableToolbar';
import { useDialog } from '../../../hooks/use-dialog';
import VacationRequestFormCreate from './form/VacationRequestFormCreate';
import VacationRequestFormEdit from './form/VacationRequestFormEdit';
import { Nullable } from '../../../models/Nullable';
import VacationRequestTableRow from './VacationRequestTableRow';
import useAsync from '../../../hooks/use-async';
import TableBodyEmpty from '../../shared/TableBodyEmpty';


export default function VacationRequestTable() {
    const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
    const [selectedVacationRequest, setSelectedVacationRequest] = useState<Nullable<VacationRequest>>(null);
    const {vacationRequestService} = useServices();
    const [openDialog, closeDialog] = useDialog();
    const employee: Employee = useAuth().getEmployee();

    const {loading} = useAsync(() => {
        return new Promise<void>(async (resolve, reject) => {
            await vacationRequestService.getAllByEmployeeEmail(employee.email).then(setVacationRequests, reject);
            resolve();
        });
    }, [employee.email]);


    function callback(vacationRequest: VacationRequest): void {
        closeDialog();
        setVacationRequests(current => [...current.filter(value => value.id !== vacationRequest.id), vacationRequest]);
    }

    function createAction(): void {
        return openDialog(
            <VacationRequestFormCreate
                vacationRequestService={ vacationRequestService }
                callback={ callback }
                onCancel={ closeDialog }
                employee={ employee }
            />
        );
    }

    function editAction(): void {
        if (!selectedVacationRequest) {
            return;
        }

        return openDialog(
            <VacationRequestFormEdit
                vacationRequestService={ vacationRequestService }
                callback={ callback }
                onCancel={ closeDialog }
                vacationRequest={ selectedVacationRequest }
            />
        );
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


    function VacationRequestTableBody() {
        if (loading) {
            return <VacationRequestTableRowSkeleton />;
        }

        if (vacationRequests.length === 0) {
            return <TableBodyEmpty colSpan={ 5 } message="No vacation requests" />;
        }

        function handleRowClick(vacationRequest: VacationRequest): void {
            setSelectedVacationRequest(selected => selected?.id === vacationRequest.id ? null : vacationRequest);
        }

        return <TableBody>
            { vacationRequests.map(request => (
                <VacationRequestTableRow
                    key={ request.id }
                    request={ request }
                    isSelected={ selectedVacationRequest?.id === request.id }
                    onClick={ () => handleRowClick(request) }
                />
            )) }
        </TableBody>;
    }


    return <>
        <Container maxWidth="lg">
            <TableContainer component={ Paper }>
                <VacationRequestTableToolbar
                    selected={ selectedVacationRequest }
                    actions={ {
                        create: createAction,
                        edit: editAction,
                        cancel: cancelAction,
                    } }
                />
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell width="5%">#</TableCell>
                            <TableCell width="10%">
                                Start Date
                            </TableCell>
                            <TableCell width="10%">
                                End Date
                            </TableCell>
                            <TableCell>
                                Reason
                            </TableCell>
                            <TableCell align="center" width="10%">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <VacationRequestTableBody />
                </Table>
            </TableContainer>
        </Container>
    </>;
}

function VacationRequestTableRowSkeleton() {
    return (
        <TableBody>
            <TableRow sx={ {'&:last-child td, &:last-child th': {border: 0}} }>
                <TableCell component="th" scope="row" width="5%"><Skeleton /></TableCell>
                <TableCell width="10%"><Skeleton /></TableCell>
                <TableCell width="10%"><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell align="center" width="10%"><Icon><Skeleton variant="circular" /></Icon></TableCell>
            </TableRow>
        </TableBody>
    );
}
