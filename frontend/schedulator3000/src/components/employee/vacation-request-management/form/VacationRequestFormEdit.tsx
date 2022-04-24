import { SubmitHandler } from 'react-hook-form';
import VacationRequestForm, { VacationRequestFormFieldValue } from './VacationRequestForm';
import { VacationRequest, VacationRequestUpdate } from '../../../../models/VacationRequest';
import React from 'react';
import { IVacationRequestService } from '../../../../hooks/use-services/use-provide-vacation-request-service';


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
                                                    vacationRequest
                                                }: VacationRequestFormEditProps) {


    const submit: SubmitHandler<VacationRequestFormFieldValue> = (data, event): void => {
        event?.preventDefault();
        let body: VacationRequestUpdate = {
            id: vacationRequest.id,
            startDate: data.startEnd[0],
            endDate: data.startEnd[1],
            reason: data.reason,
        };

        vacationRequestService.update(body).then(callback);
    };

    return <VacationRequestForm submit={ submit } onCancel={ onCancel } vacationRequest={ vacationRequest } />;
}
