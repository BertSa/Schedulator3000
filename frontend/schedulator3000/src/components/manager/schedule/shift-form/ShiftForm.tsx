import { Button, Grid, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TimePicker } from '@mui/lab';
import React from 'react';
import { Employee } from '../../../../models/User';
import { ShiftFormFieldValue } from '../table/ScheduleTable';


export interface ShiftFormType {
    id?: number,
    employeeId?: number;
    startTime: Date;
    endTime: Date;
}


interface ScheduleTableShiftFormProps {
    submit: SubmitHandler<ShiftFormFieldValue>,
    onClose: VoidFunction,
    employees: Employee[],
    selected: ShiftFormType,
}

export function ShiftForm({submit, employees, onClose, selected}: ScheduleTableShiftFormProps) {
    const {getValues, register, handleSubmit, formState: {errors}, control} = useForm<ShiftFormFieldValue>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            start: selected.startTime,
            end: selected.endTime,
            employeeId: selected.employeeId ?? -1,
            shiftId: selected.id ?? -1,
        }
    });


    return <Grid container columnSpacing={ 2 } rowSpacing={ 2 } padding={ 2 } component="form"
                 onSubmit={ handleSubmit(submit) }
                 noValidate>
        <Grid item xs={ 12 }>
            <TextField
                select
                label="Select"
                fullWidth
                defaultValue={ getValues().employeeId ?? '-1' }
                disabled={ selected.id !== undefined }
                SelectProps={ {
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    )
                } }
                { ...register('employeeId', {
                    required: true,
                    validate: (value: number) => value !== -1 ? undefined : 'Please select an employee',
                }) }
                helperText={ errors.employeeId ?? ' ' }
                error={ !!errors.employeeId }
            >
                <MenuItem hidden aria-hidden value={ -1 } />
                { employees.map(user => <MenuItem key={ user.id }
                                                  value={ user.id }>{ user.firstName } { user.lastName }
                </MenuItem>) }
            </TextField>
        </Grid>
        <Grid item xs={ 6 }>
            <Controller
                name="start"
                control={ control }
                rules={ {
                    required: true
                } }
                render={ ({fieldState, formState, field}) => (
                    <TimePicker
                        label="Start Time"
                        renderInput={ (props) => <TextField { ...props }
                                                            helperText={ errors.start ?? ' ' }
                                                            error={ !!errors.start } /> }
                        { ...field }
                        { ...fieldState }
                        { ...formState }
                    />
                ) }
            />
        </Grid>
        <Grid item xs={ 6 }>
            <Controller
                name="end"
                control={ control }
                rules={ {
                    required: true,
                    validate: (value) => value > getValues().start || 'End time must be after start time'
                } }
                render={ ({fieldState, formState, field}) => (
                    <TimePicker
                        label="End Time"
                        renderInput={ (props) => <TextField helperText={ errors.end?.message ?? ' ' }
                                                            error={ !!errors.end }
                                                            { ...props } /> }
                        { ...field }
                        { ...fieldState }
                        { ...formState }
                    />
                ) }
            />
        </Grid>
        <Grid item alignSelf={ 'center' } marginX={ 'auto' }>
            <Stack spacing={ 2 } direction="row">
                <Button type="submit" color="primary"
                        variant="contained">Submit</Button>
                { selected.id &&
                    <Button value="delete" type="submit" color="error"
                            variant="contained">Delete</Button> }
                <Button value="cancel" type="button" color="primary" variant="text" onClick={ onClose }>Cancel</Button>
            </Stack>
        </Grid>
    </Grid>;
}
