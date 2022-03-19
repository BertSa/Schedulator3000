import {METHODS, requestInit} from '../serviceUtils';
import {toastError, toastSuccess} from '../utilities';
import {Shift} from '../models/Shift';

export async function getWeekOf(body: any): Promise<Shift[]> {
    return await fetch(`/shifts/manager`, requestInit(METHODS.POST, body)).then(
        response =>
            response.json().then(
                body => {
                    if (response.status === 200) {
                        return body as Shift[];
                    }
                    if (response.status === 400) {
                        toastError.fire({title: body.message});
                        console.log(body.message);
                    }
                    return [];
                }));
}

export async function create(body: any): Promise<Shift|null> {
    return await fetch(`/shifts/manager/create`, requestInit(METHODS.POST, body)).then(
        response =>
            response.json().then(
                body => {
                    if (response.status === 201) {
                        toastSuccess.fire({title: 'Shift created'});
                        return body as Shift;
                    }
                    if (response.status === 400) {
                        toastError.fire({title: body.message});
                    }
                    return null;
                }));
}

export async function updateShift(body: any): Promise<Shift|null> {
    return await fetch(`/shifts/manager/update`, requestInit(METHODS.PUT, body)).then(
        response =>
            response.json().then(
                body => {
                    if (response.status === 200) {
                        toastSuccess.fire({title: 'Shift updated'});
                        return body as Shift;
                    }
                    if (response.status === 400) {
                        toastError.fire({title: body.message});
                    }
                    return null;
                }));
}
export async function deleteShift(id: any): Promise<boolean> {
    return await fetch(`/shifts/manager/delete/${id}`, requestInit(METHODS.DELETE)).then(
        response =>
            response.json().then(
                body => {
                    if (response.status === 200) {
                        toastSuccess.fire({title: 'Shift deleted'});
                        return true;
                    }
                    if (response.status === 400) {
                        toastError.fire({title: body.message});
                    }
                    return false;
                }));
}
