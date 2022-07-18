import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Typography } from '@mui/material';
import { Employee, EmployeeFormType, Manager } from '../../../../models/User';
import EmployeeForm from './EmployeeForm';
import { useServices } from '../../../../hooks/use-services/useServices';

interface IEmployeeFormRegisterProps {
  user: Manager;
  onFinish: (employee: Employee) => void;
  onCancel: VoidFunction;
}

export default function EmployeeFormRegister({ user, onFinish, onCancel }: IEmployeeFormRegisterProps): React.ReactElement {
  const { managerService } = useServices();

  const submit: SubmitHandler<EmployeeFormType> = (data, event) => {
    event?.preventDefault();
    managerService.addEmployee(user.email, data).then(onFinish);
  };

  return (
    <>
      <Typography
        variant="h5"
        component="h5"
        alignSelf="center"
        sx={{ marginTop: 2, marginBottom: 3 }}
      >
        Register New Employee
      </Typography>
      <EmployeeForm submit={submit} onCancel={onCancel} />
    </>
  );
}
