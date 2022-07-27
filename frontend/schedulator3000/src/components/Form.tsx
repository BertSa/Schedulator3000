import React, { PropsWithChildren } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { PropsOf } from '@emotion/react';
import { UseFormProps } from 'react-hook-form/dist/types';

type IFormProps<T> =
  PropsWithChildren<{ onSubmit:SubmitHandler<T>, formProps?: UseFormProps<T> }>
  & Omit<PropsOf<typeof Grid>, 'onSubmit'>;

export default function Form<T>({ children, onSubmit, formProps, ...props }:IFormProps<T>) {
  const methods = useForm<T>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    ...formProps,
  });

  return (
    <FormProvider {...methods}>
      {/* @ts-ignore */}
      <Grid
        {...props}
        container
        component="form"
        spacing={2}
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      >
        {children}
      </Grid>
    </FormProvider>
  );
}

Form.defaultProps = {
  formProps: {},
};
