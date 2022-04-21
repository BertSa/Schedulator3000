import React, { useEffect, useState } from 'react';
import { VacationRequest, VacationRequestStatus, VacationRequestUpdateStatus } from '../../../models/VacationRequest';
import { useServices } from '../../../hooks/use-services/use-services';
import { useAuth } from '../../../hooks/use-auth';
import { Employee, Manager } from '../../../models/User';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { Cancel, CheckCircle, FlagCircle, Timer } from '@mui/icons-material';
import { VacationRequestManagementTableToolbar } from './VacationRequestManagementTableToolbar';
import { Nullable } from '../../../models/Nullable';


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


    function Row({request, employee}: { request: VacationRequest, employee: Employee }) {

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
            <TableRow selected={ selectedVacation?.id === request.id }
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
                    { status }
                </TableCell>
            </TableRow>
        </>;
    }

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
                                return <Row key={ request.id } request={ request } employee={ employee } />;
                            }

                            return null;
                        }) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </>;
}
