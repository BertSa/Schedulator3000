import React, { createContext, PropsWithChildren, useContext } from 'react';
import { IManagerService, useProvideManagerService } from './use-provide-manager-service';
import { IVacationRequestService, useProvideVacationRequestService } from './use-provide-vacation-request-service';
import { IShiftService, useProvideShiftService } from './use-provide-shift-service';
import { IEmployeeService, useProvideEmployeeService } from './use-provide-employee-service';

export interface IProviderServices {
    managerService: IManagerService,
    employeeService: IEmployeeService,
    shiftService: IShiftService,
    vacationRequestService: IVacationRequestService
}

function useProvideServices(): IProviderServices {
    return {
        managerService: useProvideManagerService(),
        employeeService: useProvideEmployeeService(),
        shiftService: useProvideShiftService(),
        vacationRequestService: useProvideVacationRequestService(),
    };
}

const authContext: React.Context<IProviderServices> = createContext({} as IProviderServices);

export const useServices = () => useContext(authContext);

export function ServicesProvider({children}: PropsWithChildren<{}>) {
    const auth = useProvideServices();
    return React.createElement(authContext.Provider, {value: auth}, children);
}

async function post(path: string, data?: any): Promise<{ response: Response, body: any }> {
    const init: RequestInit = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: data ? JSON.stringify(data) : null
    };

    const response = await fetch(path, init);
    const body = await response.json();

    return {response, body};
}

async function put(path: string, data?: any): Promise<{ response: Response, body: any }> {
    const init: RequestInit = {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: data ? JSON.stringify(data) : null
    };

    const response = await fetch(path, init);
    const body = await response.json();

    return {response, body};
}

async function get(path: string): Promise<{ response: Response, body: any }> {
    const init: RequestInit = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    };

    const response = await fetch(path, init);
    const body = await response.json();

    return {response, body};
}

async function del(path: string): Promise<{ response: Response, body: any }> {
    const init: RequestInit = {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    };

    const response = await fetch(path, init);
    const body = await response.json();

    return {response, body};
}

export const http: {
    post: (path: string, data?: any) => Promise<ResponseBody>,
    put: (path: string, data?: any) => Promise<ResponseBody>,
    get: (path: string) => Promise<ResponseBody>,
    del: (path: string) => Promise<ResponseBody>,
} = {
    post,
    put,
    get,
    del
};

interface ResponseBody {
    response: Response,
    body: any
}
