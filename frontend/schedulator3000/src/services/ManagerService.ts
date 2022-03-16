import {Employee} from '../models/user';
import {METHODS, requestInit} from '../serviceUtils';
import {toastError, toastSuccess} from '../utilities';

export async function addEmployee(emailManager: string, employee: Employee) {
    return await fetch(`/manager/employees/add/${emailManager}`, requestInit(METHODS.POST, employee)).then(
        response =>
            response.json().then(
                body => {
                    if (response.status === 201) {
                        toastSuccess.fire({title: 'Employee added!'});
                    } else if (response.status === 400) {
                        toastError.fire({title: body.message});
                    }
                    return {ok: response.ok, body};
                }));
}

export async function getEmployees(emailManager: string): Promise<Employee[]> {
    return await fetch(`/manager/employees/${emailManager}`, requestInit(METHODS.GET)).then(
        response =>
            response.json().then(
                body => {
                    if (response.status === 200) {
                        return body as Employee[];
                    }
                    if (response.status === 400) {
                        toastError.fire({title: body.message});
                    }
                    return [];
                }));
}
