import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { FieldErrors } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import { FieldValues } from 'react-hook-form/dist/types';
import { UseFormRegister } from 'react-hook-form/dist/types/form';
import { IFieldInputWithFormContextProps } from './FormFields';

export type IFieldInputProps<TFieldValues extends FieldValues> = Omit<IFieldInputWithFormContextProps, 'validation'> & {
  validation: RegisterOptions;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  disabled?: boolean;
};

export default function FieldInput<TFieldValues extends FieldValues>(
  { name, disabled, validation, register, errors, ...props }: IFieldInputProps<TFieldValues>) {
  return (
    <TextField
      {...props}
      fullWidth
      {...register(name as any, validation)}
      error={Boolean(errors[name])}
      helperText={errors[name]?.message ?? ' '}
      disabled={Boolean(disabled)}
    />
  );
}

FieldInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  autoComplete: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
};

FieldInput.defaultProps = {
  autoComplete: 'auto',
  defaultValue: '',
  disabled: false,
};
