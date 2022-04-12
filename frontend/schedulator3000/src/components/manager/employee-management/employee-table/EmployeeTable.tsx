import { Employee } from '../../../../models/User';
import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDialog } from '../../../../hooks/use-dialog';
import { useServices } from '../../../../hooks/use-services';
import { useAuth } from '../../../../hooks/use-auth';
import { EmployeeTableToolbar } from './EmployeeTableToolbar';
import { RegisterEmployee } from './employee-form/RegisterEmployee';
import { EditEmployee } from './employee-form/EditEmployee';


export function EmployeeTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const {managerService, employeeService} = useServices();
    const [openDialog, closeDialog] = useDialog();
    const user = useAuth().getManager();
    const [selected, setSelected] = useState<Employee | null>(null);

    useEffect(() => {
        managerService.getEmployees(user.email).then(
            employees => setEmployees(employees));
    }, [managerService, user.email]);


    const handleClick = (event: React.MouseEvent<unknown>, employee: Employee) => setSelected(selected => selected?.id === employee.id ? null : employee);

    const createEmployee = () =>
        openDialog({
            children: <RegisterEmployee user={ user }
                                        setEmployees={ setEmployees }
                                        managerService={ managerService }
                                        closeMainDialog={ closeDialog } />
        });

    const editEmployee = () =>
        openDialog({
            children: <EditEmployee employee={ selected as Employee }
                                    setEmployees={ setEmployees }
                                    employeeService={ employeeService }
                                    closeMainDialog={ closeDialog } />
        });


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
            <EmployeeTableToolbar selected={ selected } addEmployee={ createEmployee } fireEmployee={ fireEmployee }
                                  editEmployee={ editEmployee } />
            <Table sx={ {minWidth: 650} } aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align="center">First Name</TableCell>
                        <TableCell align="center">Last Name</TableCell>
                        <TableCell align="center">Email</TableCell>
                        <TableCell align="center">Phone</TableCell>
                        <TableCell align="center">Role</TableCell>
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
                            <TableCell align="center">{ employee.firstName ?? 'N/A' }</TableCell>
                            <TableCell align="center">{ employee.lastName ?? 'N/A' }</TableCell>
                            <TableCell align="center">{ employee.email ?? 'N/A' }</TableCell>
                            <TableCell align="center">{ employee.phone ?? 'N/A' }</TableCell>
                            <TableCell align="center">{ employee.role ?? 'N/A' }</TableCell>
                        </TableRow>
                    )) }
                </TableBody>
            </Table>
        </TableContainer>
    </>;
}
