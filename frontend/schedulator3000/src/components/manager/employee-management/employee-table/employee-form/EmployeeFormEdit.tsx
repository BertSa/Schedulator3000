import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Employee, EmployeeFormType } from '../../../../../models/User';
import EmployeeForm from './EmployeeForm';
import { IEmployeeService } from '../../../../../hooks/use-services/use-provide-employee-service';

interface EmployeeFormEditProps {
    employeeService: IEmployeeService,
    callback: (employee: Employee) => void,
    onCancel: VoidFunction,
    employee: Employee,
}

export default function EmployeeFormEdit({
                                             employeeService,
                                             callback,
                                             onCancel,
                                             employee
                                         }: EmployeeFormEditProps): React.ReactElement {

    const submit: SubmitHandler<EmployeeFormType> = (data, event) => {
        event?.preventDefault();
        employeeService.updateEmployee(data).then(callback);
    };

    return (
        <>
            <h3>Modify Employee</h3>
            <EmployeeForm submit={ submit } emailDisabled onCancel={ onCancel } employee={ employee } />
        </>
    );
}
