import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

interface IFieldInputProps {
  label: string;
  name: string;
  type: React.InputHTMLAttributes<unknown>['type'];
  validation: RegisterOptions | ((getValues: Function) => RegisterOptions);
  autoComplete?: React.InputHTMLAttributes<unknown>['autoComplete'];
  defaultValue?: string;
  disabled?: boolean;
}

export default function FieldInput({ name, disabled, validation, ...props }: IFieldInputProps) {
  const { register, formState: { errors }, getValues } = useFormContext();
  const val = typeof validation === 'function' ? validation(getValues) as RegisterOptions : validation;

  return (
    <TextField
      {...props}
      fullWidth
      {...register(name, val)}
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
};

FieldInput.defaultProps = {
  autoComplete: 'auto',
  defaultValue: '',
  disabled: false,
};
