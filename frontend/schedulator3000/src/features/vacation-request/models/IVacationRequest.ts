import { VacationRequestStatus } from '../../../enums/VacationRequestStatus';
import { VacationRequestType } from '../../../enums/VacationRequestType';

export interface IVacationRequest {
  id: number;
  employeeEmail: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  type: VacationRequestType;
  status: VacationRequestStatus;
}
