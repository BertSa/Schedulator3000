import React, { createContext, PropsWithChildren, useContext } from 'react';
import { IManagerService, useProvideManagerService } from './useProvideManagerService';
import { IVacationRequestService, useProvideVacationRequestService } from './useProvideVacationRequestService';
import { IShiftService, useProvideShiftService } from './useProvideShiftService';
import { IEmployeeService, useProvideEmployeeService } from './useProvideEmployeeService';
import { INoteService, useProvideNoteService } from './useProvideNoteService';
import { IAvailabilitiesService, useProvideAvailabilitiesService } from './useProvideAvailabilitiesService';

export interface IProviderServices {
  managerService: IManagerService;
  employeeService: IEmployeeService;
  shiftService: IShiftService;
  vacationRequestService: IVacationRequestService;
  noteService: INoteService;
  availabilitiesService: IAvailabilitiesService;
}

function useProvideServices(): IProviderServices {
  return {
    managerService: useProvideManagerService(),
    employeeService: useProvideEmployeeService(),
    shiftService: useProvideShiftService(),
    vacationRequestService: useProvideVacationRequestService(),
    noteService: useProvideNoteService(),
    availabilitiesService: useProvideAvailabilitiesService(),
  };
}

const authContext: React.Context<IProviderServices> = createContext({} as IProviderServices);

export const useServices = () => useContext(authContext);

export function ServicesProvider({ children }: PropsWithChildren<{}>) {
  const auth = useProvideServices();
  return React.createElement(authContext.Provider, { value: auth }, children);
}

async function post(path: string, data?: any): Promise<{ response: Response, body: any }> {
  const init: RequestInit = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: data ? JSON.stringify(data) : null,
  };

  const response = await fetch(path, init);
  const body = await response.json();

  return { response, body };
}

async function put(path: string, data?: any): Promise<{ response: Response, body: any }> {
  const init: RequestInit = {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: data ? JSON.stringify(data) : null,
  };

  const response = await fetch(path, init);
  const body = await response.json();

  return { response, body };
}

async function get(path: string): Promise<{ response: Response, body: any }> {
  const init: RequestInit = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  const response = await fetch(path, init);
  const body = await response.json();

  return { response, body };
}

async function del(path: string): Promise<{ response: Response, body: any }> {
  const init: RequestInit = {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  const response = await fetch(path, init);
  const body = await response.json();

  return { response, body };
}

interface ResponseBody {
  response: Response,
  body: any
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
  del,
};
