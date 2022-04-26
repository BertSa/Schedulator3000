import { DateRangePicker } from '@mui/lab';
import { Box, Button, Grid, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import React from 'react';
import { parseISO, startOfToday } from 'date-fns';
import { DateRange, VacationRequest } from '../../../../models/VacationRequest';

export interface VacationRequestFormFieldValue {
  startEnd: DateRange;
  reason: string;
}

interface VacationRequestFormProps {
  submit: SubmitHandler<VacationRequestFormFieldValue>;
  onCancel: VoidFunction;
  vacationRequest?: VacationRequest;
}

export default function VacationRequestForm({ submit, onCancel, vacationRequest }: VacationRequestFormProps) {
  const { register, handleSubmit, formState: { errors }, control } = useForm<VacationRequestFormFieldValue>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      startEnd: vacationRequest
        ? [parseISO(vacationRequest.startDate.toString()), parseISO(vacationRequest.endDate.toString())]
        : [startOfToday(), startOfToday()],
      reason: vacationRequest?.reason ?? '',
    },
  });

  return (
    <Grid
      container
      component="form"
      spacing={2}
      padding={2}
      onSubmit={handleSubmit(submit)}
      noValidate
    >
      <Grid item xs={12}>
        <Controller
          name="startEnd"
          control={control}
          rules={{
            required: 'Start and end date are required',
          }}
          render={({ fieldState, formState, field }) => (
            <DateRangePicker
              calendars={1}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} />
                </>
              )}
              {...field}
              {...fieldState}
              {...formState}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          multiline
          label="Reason"
          autoComplete=""
          fullWidth
          helperText={errors.reason?.message ?? ' '}
          error={!!errors.reason}
          {...register('reason', {
            required: 'Reason is required',
          })}
        />
      </Grid>
      <Grid item alignSelf="center" marginX="auto">
        <Button type="submit" color="primary" variant="contained">Submit</Button>
        <Button
          type="button"
          variant="text"
          color="primary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
}

VacationRequestForm.defaultProps = {
  vacationRequest: undefined,
};
