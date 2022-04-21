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
    const [vacations, setVacations] = useState<VacationRequest[]>([]);
    const {managerService, vacationRequestService} = useServices();
    const [selectedVacation, setSelectedVacation] = useState<Nullable<VacationRequest>>(null);
    const manager: Manager = useAuth().getManager();

    useEffect(() => {
        managerService.getEmployees(manager.email).then(
            employees => setEmployees(employees));
        vacationRequestService.getAllByManagerEmail(manager.email).then(
            response => setVacations(response));
    }, [managerService, vacationRequestService, manager.email]);


    function updateRequest(status: VacationRequestUpdateStatus): void {
        if (!selectedVacation) {
            return;
        }
        vacationRequestService.updateStatus(selectedVacation.id, status)
            .then(response => {
                setVacations(current => [...current.filter(v => v.id !== selectedVacation.id), response]);
                setSelectedVacation(response);
            });
    }

    const approveAction = (): void => updateRequest(VacationRequestUpdateStatus.Approve);
    const rejectAction = (): void => updateRequest(VacationRequestUpdateStatus.Reject);

    return <>
        <Container maxWidth="lg">
            <TableContainer component={ Paper }>
                <VacationRequestManagementTableToolbar selected={ selectedVacation }
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
                        { vacations.map((request) => {
                            const employee: Employee | undefined = employees.find(value => value.email === request.employeeEmail);

                            if (employee) {
                                return <VacationRequestManagementTableRow key={ request.id }
                                                                          request={ request }
                                                                          employee={ employee }
                                                                          isSelected={ selectedVacation?.id === request.id }
                                                                          onClick={ () => setSelectedVacation(selected => selected?.id === request.id ? null : request) } />;
                            }

                            return null;
                        }) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </>;
}


