import { DateRangePicker } from '@mui/lab';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import React from 'react';
import { parseISO, startOfToday } from 'date-fns';
import { IVacationRequest } from '../models/IVacationRequest';
import { VacationRequestType } from '../../../enums/VacationRequestType';
import { DateRange } from '../../../models/DateRange';
import { OneOf } from '../../../models/OneOf';

export interface IVacationRequestFormFieldValue {
  startEnd: DateRange;
  reason: string;
  type: OneOf<VacationRequestType, string>;
}

interface IVacationRequestFormProps {
  submit: SubmitHandler<IVacationRequestFormFieldValue>;
  onCancel: VoidFunction;
  vacationRequest?: IVacationRequest;
}

export default function VacationRequestForm({ submit, onCancel, vacationRequest }: IVacationRequestFormProps) {
  const { register, handleSubmit, formState: { errors }, control } = useForm<IVacationRequestFormFieldValue>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      startEnd: vacationRequest
        ? [parseISO(vacationRequest.startDate.toString()), parseISO(vacationRequest.endDate.toString())]
        : [startOfToday(), startOfToday()],
      reason: vacationRequest?.reason ?? '',
      type: vacationRequest?.type ?? '',
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
        <TextField
          select
          label="Type"
          error={Boolean(errors.type)}
          autoComplete=""
          fullWidth
          defaultValue={vacationRequest?.type ?? ''}
          helperText={errors.type?.message ?? ' '}
          {...register('type', { required: 'This field is required' })}
        >
          {Object.values(VacationRequestType).map((type) => (
            <MenuItem key={type} value={type} className="cap">
              {type}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
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
          error={Boolean(errors.reason)}
          {...register('reason', {
            required: 'Reason is required',
          })}
        />
      </Grid>
      <Grid item alignSelf="center" marginX="auto">
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
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
