import React, { useEffect, useState } from 'react';
import { VacationRequest, VacationRequestUpdateStatus } from '../../../models/VacationRequest';
import { useServices } from '../../../hooks/use-services/use-services';
import { useAuth } from '../../../hooks/use-auth';
import { Employee, Manager } from '../../../models/User';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { VacationRequestManagementTableToolbar } from './VacationRequestManagementTableToolbar';
import { Nullable } from '../../../models/Nullable';
import { VacationRequestManagementTableRow } from './VacationRequestManagementTableRow';


export function VacationRequestManagementTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
    const {managerService, vacationRequestService} = useServices();
    const [selectedVacationRequest, setSelectedVacationRequest] = useState<Nullable<VacationRequest>>(null);
    const manager: Manager = useAuth().getManager();

    useEffect(() => {
        managerService.getEmployees(manager.email).then(
            employees => setEmployees(employees));
        vacationRequestService.getAllByManagerEmail(manager.email).then(
            response => setVacationRequests(response));
    }, [managerService, vacationRequestService, manager.email]);


    function updateRequest(status: VacationRequestUpdateStatus): void {
        if (!selectedVacationRequest) {
            return;
        }
        vacationRequestService.updateStatus(selectedVacationRequest.id, status)
            .then(response => {
                setVacationRequests(current => [...current.filter(v => v.id !== selectedVacationRequest.id), response]);
                setSelectedVacationRequest(response);
            });
    }

    const approveAction = (): void => updateRequest(VacationRequestUpdateStatus.Approve);
    const rejectAction = (): void => updateRequest(VacationRequestUpdateStatus.Reject);

    return <>
        <Container maxWidth="lg">
            <TableContainer component={ Paper }>
                <VacationRequestManagementTableToolbar selectedVacationRequest={ selectedVacationRequest }
                                                       actions={ {
                                                           approve: approveAction,
                                                           reject: rejectAction,
                                                       } } />
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>
                                Employee
                            </TableCell>
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
                        { vacationRequests.map(vacationRequest => {
                            const employee: Employee | undefined = employees.find(value => value.email === vacationRequest.employeeEmail);
                            return employee ?
                                <VacationRequestManagementTableRow key={ vacationRequest.id }
                                                                   vacationRequest={ vacationRequest }
                                                                   employee={ employee }
                                                                   isSelected={ selectedVacationRequest?.id === vacationRequest.id }
                                                                   onClick={ () => setSelectedVacationRequest(selected => selected?.id === vacationRequest.id ? null : vacationRequest) } /> :
                                null;
                        }) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </>;
}


