import { useSnackbar } from 'notistack';
import { useDialog } from '../use-dialog';
import { Employee, EmployeeFormType } from '../../models/User';
import { DialogWarningDelete } from '../../components/DialogWarningDelete';
import React from 'react';
import { http } from './use-services';

export interface IManagerService {
    addEmployee: (emailManager: string, employee: EmployeeFormType) => Promise<Employee>,
    getEmployees: (emailManager: string) => Promise<Employee[]>,
    fireEmployee: (idEmployee: number, emailManager: string) => Promise<Employee>,
}

export function useProvideManagerService(): IManagerService {
    const {enqueueSnackbar} = useSnackbar();
    let [openDialog, closeDialog] = useDialog();


    async function addEmployee(emailManager: string, employee: EmployeeFormType): Promise<Employee> {
        const {response, body} = await http.post(`/manager/${ emailManager }/employees/create`, employee);

        if (response.ok) {
            enqueueSnackbar('Employee added!', {
                variant: 'success',
                autoHideDuration: 3000
            });
            return Promise.resolve<Employee>(body);
        }

        enqueueSnackbar(body.message, {
            variant: 'error',
            autoHideDuration: 3000
        });
        return Promise.reject(body.message);
    }

    async function fireEmployee(idEmployee: number, emailManager: string): Promise<Employee> {
        const canceled = await new Promise<boolean>(resolve => {
            openDialog(<DialogWarningDelete resolve={ resolve } closeDialog={ closeDialog }
                                            title={ 'Wait a minute!' }
                                            text={ 'Are you sure you want to fire this employee?' } />);
        });

        if (canceled) {
            return Promise.reject('Canceled');
        }

        const {response, body} = await http.put(`/manager/${ emailManager }/employees/${ idEmployee }/fire`);

        if (response.ok) {
            enqueueSnackbar('Employee fired', {
                variant: 'success',
                autoHideDuration: 3000
            });
            return Promise.resolve<Employee>(body);
        }
        enqueueSnackbar(body.message, {
            variant: 'error',
            autoHideDuration: 3000
        });

        return Promise.reject(body.message);
    }

    async function getEmployees(emailManager: string): Promise<Employee[]> {
        const {response, body} = await http.get(`/manager/${ emailManager }/employees`);

        if (response.ok) {
            return Promise.resolve<Employee[]>(body);
        }

        return Promise.reject(body.message);
    }

    return {
        addEmployee,
        getEmployees,
        fireEmployee,
    };
}
