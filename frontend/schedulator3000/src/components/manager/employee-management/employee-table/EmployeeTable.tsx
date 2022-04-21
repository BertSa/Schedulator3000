import { Employee } from '../../../../models/User';
import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDialog } from '../../../../hooks/use-dialog';
import { useServices } from '../../../../hooks/use-services/use-services';
import { useAuth } from '../../../../hooks/use-auth';
import { EmployeeTableToolbar } from './EmployeeTableToolbar';
import { EmployeeFormRegister } from './employee-form/EmployeeFormRegister';
import { EmployeeFormEdit } from './employee-form/EmployeeFormEdit';
import { Nullable } from '../../../../models/Nullable';


export function EmployeeTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Nullable<Employee>>(null);
    const {managerService, employeeService} = useServices();
    const [openDialog, closeDialog] = useDialog();
    const user = useAuth().getManager();

    useEffect(() => {
        managerService.getEmployees(user.email).then(
            employees => setEmployees(employees));
    }, [managerService, user.email]);


    const handleClick = (event: React.MouseEvent<unknown>, employee: Employee) => setSelectedEmployee(selected => selected?.id === employee.id ? null : employee);

    function createAction() {
        function callback(employee: Employee) {
            setEmployees(current => [...current, employee]);
            closeDialog();
        }

        openDialog(<EmployeeFormRegister user={ user }
                                         callback={ callback }
                                         managerService={ managerService }
                                         onCancel={ closeDialog } />);
    }

    function editAction() {
        if (!selectedEmployee) {
            return;
        }

        function callback(employee: Employee) {
            setEmployees(current => [...current.filter(emp => emp.id !== employee.id), employee]);
            closeDialog();
        }

        openDialog(<EmployeeFormEdit employee={ selectedEmployee }
                                     callback={ callback }
                                     employeeService={ employeeService }
                                     onCancel={ closeDialog } />);
    }


    function fireAction() {
        if (selectedEmployee) {
            managerService.fireEmployee(selectedEmployee.id, user.email).then(
                () => {
                    setEmployees(employees.filter(employee => employee.id !== selectedEmployee.id));
                    setSelectedEmployee(null);
                });
        }
    }


    return <>
        <TableContainer component={ Paper }>
            <EmployeeTableToolbar selected={ selectedEmployee }
                                  actions={ {
                                      create: createAction,
                                      edit: editAction,
                                      fire: fireAction
                                  } } />
            <Table sx={ {minWidth: 650} } aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { employees.map((employee) => (
                        <TableRow
                            key={ employee.id }
                            hover
                            selected={ selectedEmployee?.id === employee.id }
                            onClick={ (event) => handleClick(event, employee) }
                            sx={ {
                                cursor: 'pointer',
                                '&:last-child td, &:last-child th': {border: 0},
                            } }>
                            <TableCell component="th" scope="row">
                                { employee.id }
                            </TableCell>
                            <TableCell>{ employee.firstName ?? 'N/A' }</TableCell>
                            <TableCell>{ employee.lastName ?? 'N/A' }</TableCell>
                            <TableCell>{ employee.email ?? 'N/A' }</TableCell>
                            <TableCell>{ employee.phone ?? 'N/A' }</TableCell>
                            <TableCell>{ employee.role ?? 'N/A' }</TableCell>
                        </TableRow>
                    )) }
                </TableBody>
            </Table>
        </TableContainer>
    </>;
}
