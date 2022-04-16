import React, { useEffect, useState } from 'react';
import { VacationRequest, VacationRequestStatus, VacationRequestUpdateStatus } from '../../models/VacationRequest';
import { useServices } from '../../hooks/use-services';
import { useAuth } from '../../hooks/use-auth';
import { Employee } from '../../models/User';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { VacationRequestTableToolbar } from './VacationRequestTableToolbar';
import { Cancel, CheckCircle, FlagCircle, Timer } from '@mui/icons-material';


export function VacationRequestTable() {
    const [vacations, setVacations] = useState<VacationRequest[]>([]);
    const {vacationRequestService} = useServices();
    const [selectedVacation, setSelectedVacation] = useState<VacationRequest | null>(null);
    const employee: Employee = useAuth().getEmployee();

    useEffect(() => {
        vacationRequestService.getAllByEmployeeEmail(employee.email)
            .then(response => {
                setVacations(response);
                console.log(response);
            });
    }, [employee.email]);

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
            <TableRow sx={ {'& > *': {borderBottom: 'unset'}} }
                      onClick={ () => {
                          setSelectedVacation(selected => selected?.id === request.id ? null : request);
                      } }>
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

    function cancelRequest(): void {
        if (!selectedVacation) {
            return;
        }
        vacationRequestService.updateStatus(selectedVacation.id, VacationRequestUpdateStatus.Cancel)
            .then(response => {
                if (response) {
                    setVacations(current => [...current.filter(v => v.id !== selectedVacation.id), response]);
                    setSelectedVacation(response);
                }
            });
    }

    return <>
        <Container maxWidth="lg">
            <TableContainer component={ Paper }>
                <VacationRequestTableToolbar selected={ selectedVacation } cancelRequest={ cancelRequest } />
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
                        { vacations.map((value) => {
                            return <Row key={ employee.id } request={ value } />;
                        }) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </>;
}
