import { SubmitHandler } from 'react-hook-form';
import React from 'react';
import VacationRequestForm, { IVacationRequestFormFieldValue } from './VacationRequestForm';
import { IVacationRequest } from '../models/IVacationRequest';
import { VacationRequestType } from '../../../enums/VacationRequestType';
import { VacationRequestUpdate } from '../models/VacationRequestUpdate';
import { useServices } from '../../../hooks/use-services/useServices';

interface IVacationRequestFormEditProps {
  onFinish: (vacationRequest: IVacationRequest) => void;
  onCancel: VoidFunction;
  vacationRequest: IVacationRequest;
}

export default function VacationRequestFormEdit({
  onFinish,
  onCancel,
  vacationRequest,
}: IVacationRequestFormEditProps) {
  const { vacationRequestService } = useServices();

  const submit: SubmitHandler<IVacationRequestFormFieldValue> = (data, event): void => {
    event?.preventDefault();
    const body: VacationRequestUpdate = {
      id: vacationRequest.id,
      startDate: data.startEnd[0],
      endDate: data.startEnd[1],
      reason: data.reason,
      type: data.type as VacationRequestType,
    };

    vacationRequestService.update(body).then(onFinish);
  };

  return <VacationRequestForm submit={submit} onCancel={onCancel} vacationRequest={vacationRequest} />;
}
