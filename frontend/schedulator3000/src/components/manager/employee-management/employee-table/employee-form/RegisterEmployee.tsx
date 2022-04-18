import React from 'react';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useDialog } from '../../../../../hooks/use-dialog';
import { Employee, EmployeeFormType, Manager } from '../../../../../models/User';
import { EmployeeForm } from './EmployeeForm';
import { IManagerService } from '../../../../../hooks/use-services/use-provide-manager-service';

type IRegisterEmployeeProps = {
    user: Manager,
    managerService: IManagerService,
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>,
    closeMainDialog: VoidFunction,
}

export function RegisterEmployee({
                                     user,
                                     managerService,
                                     setEmployees,
                                     closeMainDialog
                                 }: IRegisterEmployeeProps): React.ReactElement {
    const [createDialog, closeDialog] = useDialog();


    const submit: SubmitHandler<FieldValues> = (data, event) => {
        event?.preventDefault();
        const employee = data as EmployeeFormType;

        managerService.addEmployee(user.email, employee).then(
            employee => {
                setEmployees((curentEmployees: Employee[]) => [...curentEmployees, employee]);
                closeMainDialog();
                const defaultMessage = `Hi ${ employee.firstName } ${ employee.lastName } here's your password:`;
                createDialog({
                    children: <form action={ `mailto:${ employee.email }` } method="post" encType="text/plain">
                        <input type="text" name="template" value={ defaultMessage } />
                        <input type="text" name="code" disabled value={ employee.password }
                               onClick={ () => navigator.clipboard.writeText(employee.password).then() }
                               size={ 50 } />
                        <input type={ 'submit' } onClick={ () => closeDialog() } value="Send" />
                    </form>
                });
            });
    };


    return (<>
            <h3>Register New Employee</h3>
            <EmployeeForm submit={ submit } onCancel={ () => closeMainDialog() } />
        </>
    );
}
