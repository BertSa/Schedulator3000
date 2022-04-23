import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Employee, EmployeeFormType, Manager } from '../../../../../models/User';
import EmployeeForm from './EmployeeForm';
import { IManagerService } from '../../../../../hooks/use-services/use-provide-manager-service';

interface EmployeeFormRegisterProps {
    user: Manager;
    managerService: IManagerService;
    callback: (employee: Employee) => void;
    onCancel: VoidFunction;
}

export default function EmployeeFormRegister({
                                         user,
                                         managerService,
                                         callback,
                                         onCancel
                                     }: EmployeeFormRegisterProps): React.ReactElement {


    const submit: SubmitHandler<EmployeeFormType> = (data, event) => {
        event?.preventDefault();
        managerService.addEmployee(user.email, data).then(callback);
    };


    return (<>
            <h3>Register New Employee</h3>
            <EmployeeForm submit={ submit } onCancel={ onCancel } />
        </>
    );
}
