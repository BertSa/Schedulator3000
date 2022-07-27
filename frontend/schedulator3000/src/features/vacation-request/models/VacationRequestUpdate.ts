import { IVacationRequest } from './IVacationRequest';

export type VacationRequestUpdate = Omit<IVacationRequest, 'status' | 'employeeEmail'>;
