import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Typography } from '@mui/material';
import { Employee, EmployeeFormType } from '../../../../models/User';
import EmployeeForm from './EmployeeForm';
import { IEmployeeService } from '../../../../hooks/use-services/useProvideEmployeeService';

interface IEmployeeFormEditProps {
  employeeService: IEmployeeService;
  callback: (employee: Employee) => void;
  onCancel: VoidFunction;
  employee: Employee;
}

export default function EmployeeFormEdit({ employeeService, callback, onCancel, employee }: IEmployeeFormEditProps): React.ReactElement {
  const submit: SubmitHandler<EmployeeFormType> = (data, event) => {
    event?.preventDefault();
    employeeService.updateEmployee(data).then(callback);
  };

  return (
    <>
      <Typography variant="h5" component="h5" sx={{ marginTop: 2, marginBottom: 3 }} alignSelf="center">Modify Employee</Typography>
      <EmployeeForm submit={submit} emailDisabled onCancel={onCancel} employee={employee} />
    </>
  );
}
