import { useSnackbar } from 'notistack';
import { Employee, EmployeeFormType } from '../../models/User';
import { http } from './use-services';

export interface IEmployeeService {
    updateEmployee: (body: EmployeeFormType) => Promise<Employee>;
}

export function useProvideEmployeeService(): IEmployeeService {
    const {enqueueSnackbar} = useSnackbar();

    async function updateEmployee(data: EmployeeFormType): Promise<Employee> {
        const {response, body} = await http.put('/employees', data);

        if (response.ok) {
            enqueueSnackbar('Employee Updated!', {
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


    return {
        updateEmployee,
    };
}
