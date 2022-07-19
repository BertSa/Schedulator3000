import { IVacationRequest } from './IVacationRequest';

export type VacationRequestCreate = Omit<IVacationRequest, 'status' | 'id'>;
