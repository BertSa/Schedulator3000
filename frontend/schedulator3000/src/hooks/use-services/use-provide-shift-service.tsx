import { useSnackbar } from 'notistack';
import { useDialog } from '../use-dialog';
import { ShiftsFromToDto } from '../../models/ShiftsFromTo';
import { Shift, ShiftWithoutId } from '../../models/Shift';
import { DialogWarningDelete } from '../../components/DialogWarningDelete';
import React from 'react';
import { http } from './use-services';

const PATH = '/shifts';

export type IShiftService = {
    getShiftsManager: (body: ShiftsFromToDto) => Promise<Shift[]>,
    getShiftsEmployee: (body: ShiftsFromToDto) => Promise<Shift[]>,
    create: (body: ShiftWithoutId) => Promise<Shift>,
    updateShift: (body: Shift) => Promise<Shift>,
    deleteShift: (id: number) => Promise<void>
}

export function useProvideShiftService(): IShiftService {
    const {enqueueSnackbar} = useSnackbar();
    let [openDialog, closeDialog] = useDialog();

    async function getShifts(userType: string, data: ShiftsFromToDto): Promise<Shift[]> {
        const {response, body} = await http.post(`${ PATH }/${ userType }`, data);

        if (response.ok) {
            return Promise.resolve<Shift[]>(body);
        }
        enqueueSnackbar(body.message, {
            variant: 'error',
            autoHideDuration: 3000
        });
        return Promise.reject(body.message);
    }

    const getShiftsManager = async (body: ShiftsFromToDto): Promise<Shift[]> => getShifts('manager', body);
    const getShiftsEmployee = async (body: ShiftsFromToDto): Promise<Shift[]> => getShifts('employee', body);

    async function create(data: ShiftWithoutId): Promise<Shift> {
        const {response, body} = await http.post(`${ PATH }/manager/create`, data);

        if (response.status === 201) {
            enqueueSnackbar('Shift Created!', {
                variant: 'success',
                autoHideDuration: 3000
            });
            return Promise.resolve<Shift>(body);
        }
        enqueueSnackbar(body.message, {
            variant: 'error',
            autoHideDuration: 3000
        });
        return Promise.reject(body.message);
    }

    async function updateShift(data: Shift): Promise<Shift> {
        const {response, body} = await http.put(`${ PATH }/manager/update`, data);
        if (response.ok) {
            enqueueSnackbar('Shift Updated!', {
                variant: 'success',
                autoHideDuration: 3000
            });
            return Promise.resolve<Shift>(body);
        }
        enqueueSnackbar(body.message, {
            variant: 'error',
            autoHideDuration: 3000
        });
        return Promise.reject(body.message);
    }

    async function deleteShift(id: number): Promise<void> {
        const canceled = await new Promise<boolean>(resolve => {
            openDialog({
                children: <DialogWarningDelete resolve={ resolve }
                                               closeDialog={ closeDialog }
                                               title={ 'Wait a minute!' }
                                               text={ 'Are you sure you want to delete this shift?' } />,
            });
        });

        if (canceled) {
            return Promise.reject('Canceled');
        }

        const {response, body} = await http.del(`${ PATH }/manager/delete/${ id }`);

        if (response.ok) {
            enqueueSnackbar('Shift Deleted!', {
                variant: 'success',
                autoHideDuration: 3000
            });

            return Promise.resolve();
        }
        enqueueSnackbar(body.message, {
            variant: 'error',
            autoHideDuration: 3000
        });

        return Promise.reject(body.message);
    }

    return {
        getShiftsManager,
        getShiftsEmployee,
        create,
        updateShift,
        deleteShift
    };
}
