import { SubmitHandler } from 'react-hook-form';
import React from 'react';
import VacationRequestForm, { VacationRequestFormFieldValue } from './VacationRequestForm';
import { VacationRequest, VacationRequestType, VacationRequestUpdate } from '../../../../models/VacationRequest';
import { IVacationRequestService } from '../../../../hooks/use-services/useProvideVacationRequestService';

interface VacationRequestFormEditProps {
  callback: (vacationRequest: VacationRequest) => void;
  onCancel: VoidFunction;
  vacationRequestService: IVacationRequestService;
  vacationRequest: VacationRequest;
}

export default function VacationRequestFormEdit({
  callback,
  onCancel,
  vacationRequestService,
  vacationRequest,
}: VacationRequestFormEditProps) {
  const submit: SubmitHandler<VacationRequestFormFieldValue> = (data, event): void => {
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
