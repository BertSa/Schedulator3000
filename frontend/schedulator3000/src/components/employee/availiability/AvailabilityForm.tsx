import { Button, Grid, Stack, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DesktopTimePicker, TimePicker } from '@mui/lab';
import React from 'react';
import { startOfToday } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { preferences } from '../../../utilities/DateUtilities';
import { AvailabilityDay } from '../../../models/Availabilities';

export interface AvailabilityFormFieldValue {
  start: Date;
  end: Date;
}

interface ScheduleTableAvailabilityFormProps {
  submit: SubmitHandler<AvailabilityFormFieldValue>;
  onClose: VoidFunction;
  availability?: AvailabilityDay;
}

export default function AvailabilityForm({ submit, onClose, availability }: ScheduleTableAvailabilityFormProps) {
  const {
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AvailabilityFormFieldValue>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      start: availability?.start ? zonedTimeToUtc(availability?.start, 'utc') : startOfToday(),
      end: availability?.end ? zonedTimeToUtc(availability?.end, 'utc') : startOfToday(),
    },
  });

  return (
    <Grid
      container
      columnSpacing={2}
      rowSpacing={2}
      padding={2}
      component="form"
      onSubmit={handleSubmit(submit)}
      noValidate
    >
      <Grid
        item
        xs={6}
      >
        <Controller
          name="start"
          control={control}
          rules={{
            required: true,
          }}
          render={({ fieldState, formState, field }) => (
            <TimePicker
              label="Start Time"
              minutesStep={preferences.calendar.step}
              showToolbar
              shouldDisableTime={(timeValue, clockType) => clockType === 'minutes' && timeValue % preferences.calendar.step !== 0}
              renderInput={(props) => <TextField {...props} helperText={errors.start ?? ' '} error={!!errors.start} />}
              {...field}
              {...fieldState}
              {...formState}
            />
          )}
        />
      </Grid>
      <Grid
        item
        xs={6}
      >
        <Controller
          name="end"
          control={control}
          rules={{
            required: true,
            validate: (value) => value > getValues().start || 'End time must be after start time',
          }}
          render={({ fieldState, formState, field }) => (
            <DesktopTimePicker
              label="End Time"
              minutesStep={preferences.calendar.step}
              showToolbar
              shouldDisableTime={(timeValue, clockType) => clockType === 'minutes' && timeValue % preferences.calendar.step !== 0}
              renderInput={(props) => (
                <TextField
                  helperText={errors.end?.message ?? ' '}
                  error={!!errors.end}
                  {...props}
                />
              )}
              {...field}
              {...fieldState}
              {...formState}
            />
          )}
        />
      </Grid>
      <Grid item alignSelf="center" marginX="auto">
        <Stack spacing={2} direction="row">
          <Button type="submit" color="primary" variant="contained">
            Submit
          </Button>
          <Button value="cancel" type="button" color="primary" variant="text" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

AvailabilityForm.defaultProps = {
  availability: undefined,
};
