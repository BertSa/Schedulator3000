import { Employee } from '../../../../models/User';
import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDialog } from '../../../../hooks/use-dialog';
import { useServices } from '../../../../hooks/use-services';
import { useAuth } from '../../../../hooks/use-auth';
import { TableToolbar } from './TableToolbar';
import { RegisterEmployee } from './RegisterEmployee';


export function EmployeeTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const {managerService} = useServices();
    const [openDialog, closeDialog] = useDialog();
    const user = useAuth().getManager();
    const [selected, setSelected] = useState<Employee | null>(null);

    useEffect(() => {
        managerService.getEmployees(user.email).then(
            employees => setEmployees(employees));
    }, [managerService, user.email]);


    const handleClick = (event: React.MouseEvent<unknown>, employee: Employee) => setSelected(selected => selected?.id === employee.id ? null : employee);

    const createEmployee = () => {
        openDialog({
            children: <RegisterEmployee user={ user } managerService={ managerService } setEmployees={ setEmployees }
                                        closeMainDialog={ closeDialog } />
        });
    };

    const fireEmployee = () => {
        if (selected) {
            managerService.fireEmployee(selected.id, user.email).then(
                (emp) => {
                    if (emp) {
                        setEmployees(employees.filter(employee => employee.id !== selected.id));
                        setSelected(null);
                    }
                });
        }
    };


    return <>
        <TableContainer component={ Paper }>
            <TableToolbar selected={ selected } addEmployee={ createEmployee } fireEmployee={ fireEmployee } />
            <Table sx={ {minWidth: 650} } aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align="right">First Name</TableCell>
                        <TableCell align="right">Last Name</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Phone</TableCell>
                        <TableCell align="right">Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { employees.map((employee) => (
                        <TableRow
                            key={ employee.id }
                            sx={ {'&:last-child td, &:last-child th': {border: 0}} }
                            onClick={ (event) => handleClick(event, employee) }
                        >
                            <TableCell component="th" scope="row">
                                { employee.id }
                            </TableCell>
                            <TableCell align="right">{ employee.firstName ?? 'N/A' }</TableCell>
                            <TableCell align="right">{ employee.lastName ?? 'N/A' }</TableCell>
                            <TableCell align="right">{ employee.email ?? 'N/A' }</TableCell>
                            <TableCell align="right">{ employee.phone ?? 'N/A' }</TableCell>
                            <TableCell align="right">{ employee.role ?? 'N/A' }</TableCell>
                        </TableRow>
                    )) }
                </TableBody>
            </Table>
        </TableContainer>
    </>;
}
