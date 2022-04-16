import { DateRangePicker } from '@mui/lab';
import { Box, Button, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import { useServices } from '../../hooks/use-services';
import { useAuth } from '../../hooks/use-auth';
import { Employee } from '../../models/User';
import { DateRange, VacationRequestSubmit } from '../../models/VacationRequest';
import { startOfToday } from 'date-fns';

interface FormFieldValue {
    startEnd: DateRange;
    reason: string;
}

export function VacationRequestForm() {
    const {register, handleSubmit, formState: {errors}, reset, control} = useForm<FormFieldValue>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            startEnd: [startOfToday(), startOfToday()],
            reason: '',
        }
    });
    const {vacationRequestService} = useServices();
    const employee: Employee = useAuth().getEmployee();


    function submit(data: FormFieldValue, event?: any): void {
        event?.preventDefault();
        let body:VacationRequestSubmit = {
            employeeEmail: employee.email,
            startDate: data.startEnd[0],
            endDate: data.startEnd[1],
            reason: data.reason,
        }
        vacationRequestService.create(body).then(ok => {
            if (ok) {
                reset();
            }
        });
    }

    return <>
        <Grid container
              component="form"
              spacing={ 2 }
              padding={ 2 }
              onSubmit={ handleSubmit(submit) }
              noValidate>
            <Grid item xs={ 12 }>
                <Controller
                    name="startEnd"
                    control={ control }
                    rules={ {
                        required: true,
                    } }
                    render={ ({fieldState, formState, field}) => (
                        <DateRangePicker
                            calendars={ 1 }
                            renderInput={ (startProps, endProps) => (
                                <>
                                    <TextField { ...startProps } />
                                    <Box sx={ {mx: 2} }> to </Box>
                                    <TextField { ...endProps } />
                                </>
                            ) }
                            { ...field }
                            { ...fieldState }
                            { ...formState }
                        />
                    ) }
                />
            </Grid>
            <Grid item xs={ 12 }>
                <TextField
                    multiline
                    label="Reason"
                    autoComplete=""
                    { ...register('reason', {}) }
                    fullWidth
                    error={ !!errors.reason }
                    helperText={ errors.reason?.message ?? ' ' }
                />
            </Grid>
            <Grid item alignSelf={ 'center' } marginX={ 'auto' }>
                <Button type="submit" color="primary" variant="contained">Submit</Button>
            </Grid>
        </Grid>
    </>;
}
