import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Employee, EmployeeFormType } from '../../../../../models/User';
import { EmployeeForm } from './EmployeeForm';
import { IEmployeeService } from '../../../../../hooks/use-services/use-provide-employee-service';

interface EmployeeFormEditProps {
    employeeService: IEmployeeService,
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>,
    closeMainDialog: VoidFunction,
    employee: Employee,
}

export function EmployeeFormEdit({
                                 employeeService,
                                 setEmployees,
                                 closeMainDialog,
                                 employee
                             }: EmployeeFormEditProps): React.ReactElement {

    const submit: SubmitHandler<EmployeeFormType> = (data, event) => {
        event?.preventDefault();
        employeeService.updateEmployee(data).then(
            employee => {
                setEmployees((curentEmployees: Employee[]) => [...curentEmployees.filter(emp => emp.id !== employee.id), employee]);
                closeMainDialog();
            });
    };

    return (<>
            <h3>Modify Employee</h3>
            <EmployeeForm submit={ submit } emailDisabled onCancel={ () => closeMainDialog() } employee={ employee } />
        </>
    );
}