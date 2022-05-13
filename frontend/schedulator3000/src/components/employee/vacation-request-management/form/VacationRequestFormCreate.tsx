import { SubmitHandler } from 'react-hook-form';
import React from 'react';
import VacationRequestForm, { VacationRequestFormFieldValue } from './VacationRequestForm';
import { VacationRequest, VacationRequestCreate, VacationRequestType } from '../../../../models/VacationRequest';
import { Employee } from '../../../../models/User';
import { IVacationRequestService } from '../../../../hooks/use-services/useProvideVacationRequestService';

interface VacationRequestFormCreateProps {
  vacationRequestService: IVacationRequestService;
  callback: (vacationRequest: VacationRequest) => void;
  onCancel: VoidFunction;
  employee: Employee;
}

export default function VacationRequestFormCreate({
  vacationRequestService,
  onCancel,
  callback,
  employee,
}: VacationRequestFormCreateProps) {
  const submit: SubmitHandler<VacationRequestFormFieldValue> = (data, event): void => {
    event?.preventDefault();
    const body: VacationRequestCreate = {
      employeeEmail: employee.email,
      startDate: data.startEnd[0],
      endDate: data.startEnd[1],
      reason: data.reason,
      type: data.type as VacationRequestType,
    };

    vacationRequestService.create(body).then(callback);
  };

  return <VacationRequestForm submit={submit} onCancel={onCancel} />;
}
