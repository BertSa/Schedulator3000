import { Button, Grid, Stack, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DesktopTimePicker, TimePicker } from '@mui/lab';
import React from 'react';
import { getDay, parseISO, startOfToday } from 'date-fns';
import { preferences } from '../../utilities/DateUtilities';
import { IAvailabilities } from './models/IAvailabilities';
import ToggleDays from './ToggleDays';
import FieldInput from '../../components/FormInput';

export interface IAvailabilityFormFieldValue {
  startTime: Date;
  endTime: Date;
  daysOfWeek: number[];
  nbOfOccurrence: number;
}

interface IScheduleTableAvailabilityFormProps {
  submit: SubmitHandler<IAvailabilityFormFieldValue>;
  onClose: VoidFunction;
  availability?: IAvailabilities;
}

export default function AvailabilityForm({ submit, onClose, availability }: IScheduleTableAvailabilityFormProps) {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IAvailabilityFormFieldValue>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      startTime: availability?.startTime ? new Date(availability.startTime) : startOfToday(),
      endTime: availability?.endTime ? new Date(availability.endTime) : startOfToday(),
      daysOfWeek: availability?.startingDate ? [getDay(parseISO(availability.startingDate))] : [],
      nbOfOccurrence: 1,
    },
  });

  if (!availability) {
    onClose();
    return null;
  }

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
          name="startTime"
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
              renderInput={(props) => <TextField {...props} helperText={errors.startTime ?? ' '} error={Boolean(errors.startTime)} />}
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
          name="endTime"
          control={control}
          rules={{
            required: true,
            validate: (value) => value > getValues().startTime || 'End time must be after start time',
          }}
          render={({ fieldState, formState, field }) => (
            <DesktopTimePicker
              label="End Time"
              minutesStep={preferences.calendar.step}
              showToolbar
              shouldDisableTime={(timeValue, clockType) => clockType === 'minutes' && timeValue % preferences.calendar.step !== 0}
              renderInput={(props) => (
                <TextField
                  helperText={errors.endTime?.message ?? ' '}
                  error={Boolean(errors.endTime)}
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
      <Grid
        item
        xs={6}
      >
        <Controller
          name="daysOfWeek"
          control={control}
          render={({ field }) => <ToggleDays {...field} />}
        />
      </Grid>
      <Grid
        item
        xs={6}
      >
        <FieldInput
          name="nbOfOccurrence"
          label="Number of Occurrence"
          type="number"
          errors={errors}
          register={register}
          validation={{ required: 'This field is Required' }}
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
