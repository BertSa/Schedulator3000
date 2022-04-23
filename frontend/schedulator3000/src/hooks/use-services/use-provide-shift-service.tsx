import { useSnackbar } from 'notistack';
import { useDialog } from '../use-dialog';
import { RequestDtoShiftsFromTo } from '../../models/ShiftsFromTo';
import { Shift, ShiftWithoutId } from '../../models/Shift';
import DialogWarningDelete from '../../components/DialogWarningDelete';
import React from 'react';
import { http } from './use-services';

const PATH = '/shifts';

export interface IShiftService {
    getShiftsManager: (body: RequestDtoShiftsFromTo) => Promise<Shift[]>,
    getShiftsEmployee: (body: RequestDtoShiftsFromTo) => Promise<Shift[]>,
    create: (body: ShiftWithoutId) => Promise<Shift>,
    updateShift: (body: Shift) => Promise<Shift>,
    deleteShift: (id: number) => Promise<void>
}

export function useProvideShiftService(): IShiftService {
    const {enqueueSnackbar} = useSnackbar();
    let [openDialog, closeDialog] = useDialog();

    async function getShifts(userType: string, data: RequestDtoShiftsFromTo): Promise<Shift[]> {
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

    const getShiftsManager = async (body: RequestDtoShiftsFromTo): Promise<Shift[]> => getShifts('manager', body);
    const getShiftsEmployee = async (body: RequestDtoShiftsFromTo): Promise<Shift[]> => getShifts('employee', body);

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
            openDialog(<DialogWarningDelete resolve={ resolve }
                                            closeDialog={ closeDialog }
                                            title={ 'Wait a minute!' }
                                            text={ 'Are you sure you want to delete this shift?' } />);
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
