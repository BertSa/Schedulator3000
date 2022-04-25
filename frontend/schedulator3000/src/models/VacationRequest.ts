/* eslint-disable no-shadow */
export enum VacationRequestStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Cancelled = 'CANCELLED',
}

export enum VacationRequestUpdateStatus {
  Approve = 'approve',
  Reject = 'reject',
  Cancel = 'cancel',
}

export interface VacationRequest {
  id: number;
  employeeEmail: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  status: VacationRequestStatus;
}
export type VacationRequestCreate = Omit<VacationRequest, 'status' | 'id'>;

export type VacationRequestUpdate = Omit<VacationRequest, 'status' | 'employeeEmail'>;

export type DateRange = [Date, Date];
