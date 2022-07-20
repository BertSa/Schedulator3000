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

export function useServices(): IProviderServices {
  return {
    managerService: useProvideManagerService(),
    employeeService: useProvideEmployeeService(),
    shiftService: useProvideShiftService(),
    vacationRequestService: useProvideVacationRequestService(),
    noteService: useProvideNoteService(),
    availabilitiesService: useProvideAvailabilitiesService(),
  };
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

interface IResponseBody {
  response: Response,
  body: any
}

export const http: {
  post: (path: string, data?: any) => Promise<IResponseBody>,
  put: (path: string, data?: any) => Promise<IResponseBody>,
  get: (path: string) => Promise<IResponseBody>,
  del: (path: string) => Promise<IResponseBody>,
} = {
  post,
  put,
  get,
  del,
};
