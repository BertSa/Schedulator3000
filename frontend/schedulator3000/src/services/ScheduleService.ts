import {METHODS, requestInit} from '../serviceUtils';
import {toastError} from '../utilities';
import {Shift} from '../models/Shift';
import {Schedule} from '../models/Schedule';

export async function getWeekOf(weekFirstDay: any): Promise<Schedule|null> {
    return await fetch(`/schedule/weekof/${weekFirstDay}`, requestInit(METHODS.GET)).then(
        response =>
            response.json().then(
                body => {
                    if (response.status === 200) {
                        return body as Schedule;
                    }
                    if (response.status === 400) {
                        toastError.fire({title: body.message});
                        console.log(body.message);
                    }
                    return null;
                }));
}

export async function addShift(body: any): Promise<Shift|null> {
    return await fetch(`/schedule/shift/add`, requestInit(METHODS.POST, body)).then(
        response =>
            response.json().then(
                body => {
                    if (response.status === 200) {
                        console.log(body);
                        return body as Shift;
                    }
                    if (response.status === 400) {
                        toastError.fire({title: body.message});
                        console.log(body.message);
                    }
                    return null;
                }));
}
