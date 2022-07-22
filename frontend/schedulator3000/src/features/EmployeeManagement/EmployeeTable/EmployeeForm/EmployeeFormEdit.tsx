import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Typography } from '@mui/material';
import { Employee, EmployeeFormType } from '../../../../models/User';
import EmployeeForm from './EmployeeForm';
import useEmployeeService from '../../../../hooks/use-services/useEmployeeService';

interface IEmployeeFormEditProps {
  onFinish: (employee: Employee) => void;
  onCancel: VoidFunction;
  employee: Employee;
}

export default function EmployeeFormEdit({ onFinish, onCancel, employee }: IEmployeeFormEditProps): React.ReactElement {
  const employeeService = useEmployeeService();

  const submit: SubmitHandler<EmployeeFormType> = (data, event) => {
    event?.preventDefault();
    employeeService.updateEmployee(data).then(onFinish);
  };

  return (
    <>
      <Typography
        variant="h5"
        component="h5"
        alignSelf="center"
        sx={{ marginTop: 2, marginBottom: 3 }}
      >
        Modify Employee
      </Typography>
      <EmployeeForm
        submit={submit}
        onCancel={onCancel}
        employee={employee}
        emailDisabled
      />
    </>
  );
}
