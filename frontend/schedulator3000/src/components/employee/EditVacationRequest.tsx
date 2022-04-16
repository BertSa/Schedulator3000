import { SubmitHandler } from 'react-hook-form';
import { VacationRequestForm, VacationRequestFormFieldValue } from './VacationRequestForm';
import { VacationRequest, VacationRequestUpdate } from '../../models/VacationRequest';
import React from 'react';
import { IVacationRequestService } from '../../hooks/use-services';


interface CreateVacationRequestProps {
    setVacations: React.Dispatch<React.SetStateAction<VacationRequest[]>>;
    closeMainDialog: VoidFunction;
    vacationRequestService: IVacationRequestService;
    vacationRequest: VacationRequest;
}

export function EditVacationRequest({
                                          setVacations,
                                          closeMainDialog,
                                          vacationRequestService,
                                          vacationRequest
                                      }: CreateVacationRequestProps) {


    const submit: SubmitHandler<VacationRequestFormFieldValue> = (data, event): void => {
        event?.preventDefault();
        let body: VacationRequestUpdate = {
            id: vacationRequest.id,
            startDate: data.startEnd[0],
            endDate: data.startEnd[1],
            reason: data.reason,
        };

        vacationRequestService.update(body).then(response => {
            if (response) {
                closeMainDialog();
                setVacations(prevState => [...prevState.filter(value => value.id !== response.id), response]);
            }
        });
    };

    return <VacationRequestForm onSubmit={ submit }
                                onCancel={ closeMainDialog }
                                vacationRequest={vacationRequest}
    />;
}