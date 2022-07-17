import React, { PropsWithChildren } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { PropsOf } from '@emotion/react';
import { UseFormProps } from 'react-hook-form/dist/types';

export default function Form<T>({ children, onSubmit, formProps, ...props }:
PropsWithChildren<{ onSubmit:SubmitHandler<T> }> & Omit<PropsOf<typeof Grid>, 'onSubmit'> & { formProps?: UseFormProps<T> }) {
  const methods = useForm<T>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    ...formProps,
  });

  return (
    <FormProvider {...methods}>
      {/* @ts-ignore */}
      <Grid container component="form" spacing={2} onSubmit={methods.handleSubmit(onSubmit)} noValidate {...props}>
        {children}
      </Grid>
    </FormProvider>
  );
}

Form.defaultProps = {
  formProps: {},
};
