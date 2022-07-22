import React from 'react';
import { Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Employee } from '../../../models/User';
import { useDialog } from '../../../hooks/useDialog';
import { useAuth } from '../../../contexts/AuthContext';
import EmployeeTableToolbar from './EmployeeTableToolbar';
import EmployeeFormRegister from './EmployeeForm/EmployeeFormRegister';
import EmployeeFormEdit from './EmployeeForm/EmployeeFormEdit';
import useAsync from '../../../hooks/useAsync';
import EmployeeTableBody from './EmployeeTableBody';
import useSelected from '../../../hooks/useSelected';
import useManagerService from '../../../hooks/use-services/useManagerService';
import useArray from '../../../hooks/useArray';
import { KeyOf } from '../../../models/KeyOf';

export default function EmployeeTable() {
  const employees = useArray<Employee, KeyOf<Employee>>('id');
  const selectedEmployee = useSelected(employees.value, 'id');
  const managerService = useManagerService();
  const [openDialog, closeDialog] = useDialog();
  const manager = useAuth().getManager();

  const { loading } = useAsync(
    () =>
      new Promise<void>(async (resolve, reject) => {
        await managerService.getEmployees(manager.email).then(employees.setValue, reject);
        resolve();
      }),
    [manager.email],
  );

  const createAction = () => {
    const onFinish = (employee: Employee) => {
      employees.add(employee);
      closeDialog();
    };

    openDialog(<EmployeeFormRegister user={manager} onFinish={onFinish} onCancel={closeDialog} />);
  };

  const editAction = () => {
    if (!selectedEmployee) {
      return;
    }

    const onFinish = (employee: Employee) => {
      employees.removeByUniqueIdentifier(employee.id);
      closeDialog();
    };
    const employee = selectedEmployee.value();
    if (!employee) {
      return;
    }
    openDialog(
      <EmployeeFormEdit
        employee={employee}
        onFinish={onFinish}
        onCancel={closeDialog}
      />,
    );
  };

  const fireAction = () => {
    if (selectedEmployee.selected) {
      managerService.fireEmployee(selectedEmployee.selected, manager.email).then(() => {
        employees.removeByUniqueIdentifier(selectedEmployee.selected);
        selectedEmployee.clear();
      });
    }
  };

  return (
    <TableContainer component={Paper}>
      <EmployeeTableToolbar
        selected={selectedEmployee.value()}
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
        <EmployeeTableBody
          loading={loading}
          employees={employees.value}
          selectedEmployee={selectedEmployee}
          onClick={selectedEmployee.select}
        />
      </Table>
    </TableContainer>
  );
}
