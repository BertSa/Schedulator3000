import { SubmitHandler } from 'react-hook-form';
import React from 'react';
import VacationRequestForm, { IVacationRequestFormFieldValue } from './VacationRequestForm';
import { IVacationRequest } from '../../../../models/IVacationRequest';
import { Employee } from '../../../../models/User';
import { IVacationRequestService } from '../../../../hooks/use-services/useProvideVacationRequestService';
import { VacationRequestType } from '../../../../enums/VacationRequestType';
import { VacationRequestCreate } from '../../../../models/VacationRequestCreate';

interface IVacationRequestFormCreateProps {
  vacationRequestService: IVacationRequestService;
  callback: (vacationRequest: IVacationRequest) => void;
  onCancel: VoidFunction;
  employee: Employee;
}

export default function VacationRequestFormCreate({
  vacationRequestService,
  onCancel,
  callback,
  employee,
}: IVacationRequestFormCreateProps) {
  const submit: SubmitHandler<IVacationRequestFormFieldValue> = (data, event): void => {
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
