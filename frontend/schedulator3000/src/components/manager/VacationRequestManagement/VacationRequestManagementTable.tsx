import React, { useEffect, useState } from 'react';
import { VacationRequest, VacationRequestStatus, VacationRequestUpdateStatus } from '../../../models/VacationRequest';
import { useServices } from '../../../hooks/use-services';
import { useAuth } from '../../../hooks/use-auth';
import { Employee, Manager } from '../../../models/User';
import { alpha, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { Cancel, CheckCircle, FlagCircle, Timer } from '@mui/icons-material';
import { VacationRequestManagementTableToolbar } from './VacationRequestManagementTableToolbar';


export function VacationRequestManagementTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [vacations, setVacations] = useState<VacationRequest[]>([]);
    const {managerService, vacationRequestService} = useServices();
    const [selectedVacation, setSelectedVacation] = useState<VacationRequest | null>(null);
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
            <TableRow sx={ {
                '&:last-child td, &:last-child th': {border: 0},
                ...(selectedVacation?.id === request.id && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
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
                if (response !== null) {
                    setVacations(current => [...current.filter(v => v.id !== selectedVacation.id), response]);
                    setSelectedVacation(response);
                }
            });
    }

    const approveRequest = (): void => updateRequest(VacationRequestUpdateStatus.Approve);
    const rejectRequest = (): void => updateRequest(VacationRequestUpdateStatus.Reject);

    return <>
        <Container maxWidth="lg">
            <TableContainer component={ Paper }>
                <VacationRequestManagementTableToolbar selected={ selectedVacation } approveRequest={ approveRequest }
                                                       rejectRequest={ rejectRequest } />
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
