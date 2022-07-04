import React, { useState } from 'react';
import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Employee } from '../../../../models/User';
import { useDialog } from '../../../../hooks/useDialog';
import { useServices } from '../../../../hooks/use-services/useServices';
import { useAuth } from '../../../../contexts/AuthContext';
import EmployeeTableToolbar from './EmployeeTableToolbar';
import EmployeeFormRegister from './EmployeeForm/EmployeeFormRegister';
import EmployeeFormEdit from './EmployeeForm/EmployeeFormEdit';
import { Nullable } from '../../../../models/Nullable';
import useAsync from '../../../../hooks/useAsync';
import TableBodyEmpty from '../../../shared/TableBodyEmpty';
import useNullableState from '../../../../hooks/useNullableState';

function EmployeeTableBodySkeleton() {
  return (
    <TableBody>
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component="th" scope="row" width="5%">
          <Skeleton />
        </TableCell>
        <TableCell width="10%">
          <Skeleton />
        </TableCell>
        <TableCell width="10%">
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell width="15%">
          <Skeleton />
        </TableCell>
        <TableCell width="10%">
          <Skeleton />
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

function ActiveMessage({ isActive }: { isActive: Nullable<boolean> }) {
  if (isActive === null) {
    return <span>Never logged in before</span>;
  }

  // Will probably be removed in the future
  if (!isActive) {
    return <span>Fired</span>;
  }

  return <span>Active</span>;
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useNullableState<Employee>();
  const { managerService, employeeService } = useServices();
  const [openDialog, closeDialog] = useDialog();
  const manager = useAuth().getManager();

  const { loading } = useAsync(
    () =>
      new Promise<void>(async (resolve, reject) => {
        await managerService.getEmployees(manager.email).then(setEmployees, reject);
        resolve();
      }),
    [manager.email],
  );

  const handleClick = (event: React.MouseEvent<unknown>, employee: Employee) =>
    setSelectedEmployee((selected) => (selected?.id === employee.id ? null : employee));

  const createAction = () => {
    const callback = (employee: Employee) => {
      setEmployees((current) => [...current, employee]);
      closeDialog();
    };

    openDialog(<EmployeeFormRegister user={manager} callback={callback} managerService={managerService} onCancel={closeDialog} />);
  };

  const editAction = () => {
    if (!selectedEmployee) {
      return;
    }

    const callback = (employee: Employee) => {
      setEmployees((current) => [...current.filter((emp) => emp.id !== employee.id), employee]);
      closeDialog();
    };

    openDialog(
      <EmployeeFormEdit
        employee={selectedEmployee}
        callback={callback}
        employeeService={employeeService}
        onCancel={closeDialog}
      />,
    );
  };

  const fireAction = () => {
    if (selectedEmployee) {
      managerService.fireEmployee(selectedEmployee.id, manager.email).then(() => {
        setEmployees(employees.filter((employee) => employee.id !== selectedEmployee.id));
        setSelectedEmployee(null);
      });
    }
  };

  function EmployeeTableBody() {
    if (loading) {
      return <EmployeeTableBodySkeleton />;
    }

    if (employees.length === 0) {
      return <TableBodyEmpty colSpan={6} message="No employees" />;
    }

    return (
      <TableBody>
        {employees.map((employee) => (
          <TableRow
            key={employee.id}
            hover
            selected={selectedEmployee?.id === employee.id}
            onClick={(event) => handleClick(event, employee)}
            sx={{
              cursor: 'pointer',
              '&:last-child td, &:last-child th': { border: 0 },
            }}
          >
            <TableCell component="th" scope="row" width="5%">
              {employee.id}
            </TableCell>
            <TableCell width="10%">{employee.firstName}</TableCell>
            <TableCell width="10%">{employee.lastName}</TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell width="15%">{employee.phone}</TableCell>
            <TableCell width="10%">{employee.role}</TableCell>
            <TableCell width="10%"><ActiveMessage isActive={employee.active} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <TableContainer component={Paper}>
      <EmployeeTableToolbar
        selected={selectedEmployee}
        actions={{
          create: createAction,
          edit: editAction,
          fire: fireAction,
        }}
      />
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width="5%">#</TableCell>
            <TableCell width="10%">First Name</TableCell>
            <TableCell width="10%">Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell width="15%">Phone</TableCell>
            <TableCell width="10%">Role</TableCell>
            <TableCell width="10%">Active</TableCell>
          </TableRow>
        </TableHead>
        <EmployeeTableBody />
      </Table>
    </TableContainer>
  );
}
