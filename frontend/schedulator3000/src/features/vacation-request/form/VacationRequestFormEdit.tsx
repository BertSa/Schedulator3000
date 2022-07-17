import { SubmitHandler } from 'react-hook-form';
import React from 'react';
import VacationRequestForm, { IVacationRequestFormFieldValue } from './VacationRequestForm';
import { IVacationRequest } from '../../../models/IVacationRequest';
import { IVacationRequestService } from '../../../hooks/use-services/useProvideVacationRequestService';
import { VacationRequestType } from '../../../enums/VacationRequestType';
import { VacationRequestUpdate } from '../../../models/VacationRequestUpdate';

interface IVacationRequestFormEditProps {
  callback: (vacationRequest: IVacationRequest) => void;
  onCancel: VoidFunction;
  vacationRequestService: IVacationRequestService;
  vacationRequest: IVacationRequest;
}

export default function VacationRequestFormEdit({
  callback,
  onCancel,
  vacationRequestService,
  vacationRequest,
}: IVacationRequestFormEditProps) {
  const submit: SubmitHandler<IVacationRequestFormFieldValue> = (data, event): void => {
    event?.preventDefault();
    const body: VacationRequestUpdate = {
      id: vacationRequest.id,
      startDate: data.startEnd[0],
      endDate: data.startEnd[1],
      reason: data.reason,
      type: data.type as VacationRequestType,
    };

    vacationRequestService.update(body).then(callback);
  };

  return <VacationRequestForm submit={submit} onCancel={onCancel} vacationRequest={vacationRequest} />;
}
