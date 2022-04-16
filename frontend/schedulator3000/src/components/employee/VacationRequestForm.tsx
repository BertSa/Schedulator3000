import { DateRangePicker } from '@mui/lab';
import { Box, Button, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import { DateRange, VacationRequest } from '../../models/VacationRequest';
import { startOfToday } from 'date-fns';

export interface VacationRequestFormFieldValue {
    startEnd: DateRange;
    reason: string;
}

interface VacationRequestFormProps {
    onSubmit: any;
    onCancel: any;
    vacationRequest?: VacationRequest;
}

export function VacationRequestForm({onSubmit, onCancel, vacationRequest}: VacationRequestFormProps) {
    const {register, handleSubmit, formState: {errors}, control} = useForm<VacationRequestFormFieldValue>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            startEnd: vacationRequest ? [vacationRequest.startDate, vacationRequest.endDate] : [startOfToday(), startOfToday()],
            reason: vacationRequest?.reason ?? '',
        }
    });


    return <>
        <Grid container
              component="form"
              spacing={ 2 }
              padding={ 2 }
              onSubmit={ handleSubmit(onSubmit) }
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
                <Button
                    type="button"
                    variant="text"
                    color="primary"
                    onClick={ onCancel }
                >
                    Cancel
                </Button>
            </Grid>
        </Grid>
    </>;
}
