import { SubmitHandler } from 'react-hook-form';
import { VacationRequestForm, VacationRequestFormFieldValue } from './VacationRequestForm';
import { VacationRequest, VacationRequestSubmit } from '../../models/VacationRequest';
import React from 'react';
import { Employee } from '../../models/User';
import { IVacationRequestService } from '../../hooks/use-services/use-provide-vacation-request-service';


interface CreateVacationRequestProps {
    setVacations: React.Dispatch<React.SetStateAction<VacationRequest[]>>;
    closeMainDialog: VoidFunction;
    employee: Employee;
    vacationRequestService: IVacationRequestService;
}

export function CreateVacationRequest({
                                          setVacations,
                                          employee,
                                          closeMainDialog,
                                          vacationRequestService
                                      }: CreateVacationRequestProps) {


    const submit: SubmitHandler<VacationRequestFormFieldValue> = (data, event): void => {
        event?.preventDefault();
        let body: VacationRequestSubmit = {
            employeeEmail: employee.email,
            startDate: data.startEnd[0],
            endDate: data.startEnd[1],
            reason: data.reason,
        };

        vacationRequestService.create(body).then(response => {
            closeMainDialog();
            setVacations(prevState => [...prevState.filter(value => value.id !== response.id), response]);
        });
    };

    return <VacationRequestForm onSubmit={ submit }
                                onCancel={ closeMainDialog }
    />;
}
