import { SubmitHandler } from 'react-hook-form';
import { VacationRequestForm, VacationRequestFormFieldValue } from './VacationRequestForm';
import { VacationRequest, VacationRequestUpdate } from '../../../models/VacationRequest';
import React from 'react';
import { IVacationRequestService } from '../../../hooks/use-services/use-provide-vacation-request-service';


interface VacationRequestFormEditProps {
    setVacations: React.Dispatch<React.SetStateAction<VacationRequest[]>>;
    closeMainDialog: VoidFunction;
    vacationRequestService: IVacationRequestService;
    vacationRequest: VacationRequest;
}

export function VacationRequestFormEdit({
                                        setVacations,
                                        closeMainDialog,
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

        vacationRequestService.update(body).then(response => {
            closeMainDialog();
            setVacations(prevState => [...prevState.filter(value => value.id !== response.id), response]);
        });
    };

    return <VacationRequestForm onSubmit={ submit }
                                onCancel={ closeMainDialog }
                                vacationRequest={ vacationRequest }
    />;
}
