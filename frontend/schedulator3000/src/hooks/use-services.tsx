import React, {createContext, useContext} from 'react';
import {useSnackbar} from 'notistack';
import {Employee} from '../models/User';
import {Shift} from '../models/Shift';
import {useDialog} from './use-dialog';
import {Button, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';

export enum METHODS {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export const requestInit = (method: METHODS, body?: any | string, isString?: boolean) => {
    let value : RequestInit = {
        method: method,
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    if (body && (method === METHODS.POST || method === METHODS.PUT)) {
        value.body = isString ? body : JSON.stringify(body);
    }
    return value;
};

const authContext: React.Context<IProviderServices> = createContext({} as IProviderServices);

export function ServicesProvider({children}: { children: React.ReactNode }) {
    const auth = useProvideServices();
    return React.createElement(authContext.Provider, {value: auth}, children);
}

export const useServices = () => {
    return useContext(authContext);
};

function useProvideManagerService() {
    const {enqueueSnackbar} = useSnackbar();

    async function addEmployee(emailManager: string, employee: Employee): Promise<{ ok: boolean, body: {} }> {
        return await fetch(`/manager/employees/add/${emailManager}`, requestInit(METHODS.POST, employee)).then(
            response =>
                response.json().then(
                    body => {
                        if (response.status === 201) {
                            enqueueSnackbar('Employee added!', {
                                variant: 'success',
                                autoHideDuration: 3000
                            });
                        } else if (response.status === 400) {
                            enqueueSnackbar(body.message, {
                                variant: 'error',
                                autoHideDuration: 3000
                            });
                        }
                        return {ok: response.ok, body};
                    }));
    }

    async function getEmployees(emailManager: string): Promise<Employee[]> {
        return await fetch(`/manager/employees/${emailManager}`, requestInit(METHODS.GET)).then(
            response =>
                response.json().then(
                    body => {
                        if (response.status === 200) {
                            return body as Employee[];
                        }
                        if (response.status === 400) {
                            enqueueSnackbar(body.message, {
                                variant: 'error',
                                autoHideDuration: 3000
                            });
                        }
                        return [];
                    }));
    }

    return {
        addEmployee,
        getEmployees
    };
}

function useProvideShiftService() {
    const {enqueueSnackbar} = useSnackbar();
    let [openDialog, closeDialog] = useDialog();

    async function getShifts(body: any): Promise<Shift[]> {
        return await fetch(`/shifts/manager`, requestInit(METHODS.POST, body)).then(
            response =>
                response.json().then(
                    body => {
                        if (response.status === 200) {
                            return body as Shift[];
                        }
                        if (response.status === 400) {
                            enqueueSnackbar(body.message, {
                                variant: 'error',
                                autoHideDuration: 3000
                            });
                        }
                        return [];
                    }));
    }

    async function create(body: any): Promise<Shift | null> {
        return await fetch(`/shifts/manager/create`, requestInit(METHODS.POST, body)).then(
            response =>
                response.json().then(
                    body => {
                        if (response.status === 201) {
                            enqueueSnackbar('Shift Created!', {
                                variant: 'success',
                                autoHideDuration: 3000
                            });
                            return body as Shift;
                        }
                        if (response.status === 400) {
                            enqueueSnackbar(body.message, {
                                variant: 'error',
                                autoHideDuration: 3000
                            });
                        }
                        return null;
                    }));
    }

    async function updateShift(body: any): Promise<Shift | null> {
        return await fetch(`/shifts/manager/update`, requestInit(METHODS.PUT, body)).then(
            response =>
                response.json().then(
                    body => {
                        if (response.status === 200) {
                            enqueueSnackbar('Shift Updated!', {
                                variant: 'success',
                                autoHideDuration: 3000
                            });
                            return body as Shift;
                        }
                        if (response.status === 400) {
                            enqueueSnackbar(body.message, {
                                variant: 'error',
                                autoHideDuration: 3000
                            });
                        }
                        return null;
                    }));
    }

    async function deleteShift(id: any): Promise<boolean> {
        let canceled = await new Promise<boolean>(resolve => {
            openDialog({
                children: (
                    <>
                        <DialogTitle id="alert-dialog-title">
                            Wait a minute!
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this shift?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                resolve(false);
                                closeDialog();
                            }} variant="contained" autoFocus>
                                Confirm
                            </Button>
                            <Button onClick={() => {
                                resolve(true);
                                closeDialog();
                            }}>Cancel</Button>
                        </DialogActions>
                    </>
                )
            });
        });

        if (canceled) {
            return Promise.resolve(false);
        }

        return await fetch(`/shifts/manager/delete/${id}`, requestInit(METHODS.DELETE)).then(
            response =>
                response.json().then(
                    body => {
                        if (response.status === 200) {
                            enqueueSnackbar('Shift Deleted!', {
                                variant: 'success',
                                autoHideDuration: 3000
                            });
                            return true;
                        }
                        if (response.status === 400) {
                            enqueueSnackbar(body.message, {
                                variant: 'error',
                                autoHideDuration: 3000
                            });
                        }
                        return false;
                    }));
    }

    return {
        getShifts,
        create,
        updateShift,
        deleteShift
    };
}

function useProvideServices(): IProviderServices {
    const managerService = useProvideManagerService();
    const shiftService = useProvideShiftService();

    return {
        managerService,
        shiftService
    };
}

type IProviderServices = {
    managerService: {
        addEmployee: (emailManager: string, employee: Employee) => Promise<{ ok: boolean, body: {} }>,
        getEmployees: (emailManager: string) => Promise<Employee[]>,
    },
    shiftService: {
        getShifts: (body: any) => Promise<Shift[]>,
        create: (body: any) => Promise<Shift | null>,
        updateShift: (body: any) => Promise<Shift | null>,
        deleteShift: (id: any) => Promise<boolean>
    };
};
