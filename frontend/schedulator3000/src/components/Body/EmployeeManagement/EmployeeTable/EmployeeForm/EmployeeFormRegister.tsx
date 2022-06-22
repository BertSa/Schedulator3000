import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Typography } from '@mui/material';
import { Employee, EmployeeFormType, Manager } from '../../../../../models/User';
import EmployeeForm from './EmployeeForm';
import { IManagerService } from '../../../../../hooks/use-services/useProvideManagerService';

interface IEmployeeFormRegisterProps {
  user: Manager;
  managerService: IManagerService;
  callback: (employee: Employee) => void;
  onCancel: VoidFunction;
}

export default function EmployeeFormRegister({ user, managerService, callback, onCancel }: IEmployeeFormRegisterProps): React.ReactElement {
  const submit: SubmitHandler<EmployeeFormType> = (data, event) => {
    event?.preventDefault();
    managerService.addEmployee(user.email, data).then(callback);
  };

  return (
    <>
      <Typography variant="h5" component="h5" sx={{ marginTop: 2, marginBottom: 3 }} alignSelf="center">Register New Employee</Typography>
      <EmployeeForm submit={submit} onCancel={onCancel} />
    </>
  );
}
