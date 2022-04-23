import { SubmitHandler } from 'react-hook-form';
import VacationRequestForm, { VacationRequestFormFieldValue } from './VacationRequestForm';
import { VacationRequest, VacationRequestCreate } from '../../../../models/VacationRequest';
import React from 'react';
import { Employee } from '../../../../models/User';
import { IVacationRequestService } from '../../../../hooks/use-services/use-provide-vacation-request-service';


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
        let body: VacationRequestCreate = {
            employeeEmail: employee.email,
            startDate: data.startEnd[0],
            endDate: data.startEnd[1],
            reason: data.reason,
        };

        vacationRequestService.create(body).then(callback);
    };

    return <VacationRequestForm submit={ submit }
                                onCancel={ onCancel } />;
}
