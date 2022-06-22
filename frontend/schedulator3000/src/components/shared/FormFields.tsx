import PropTypes from 'prop-types';

import { TextField } from '@mui/material';
import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

interface IFieldInputProps {
  label: string;
  name: string;
  type: React.InputHTMLAttributes<unknown>['type'];
  autoComplete?: React.InputHTMLAttributes<unknown>['autoComplete'];
  defaultValue?: string;
  register: Function;
  errors: FieldErrors;
  validation: RegisterOptions;
  disabled?: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export function FieldInput(props: IFieldInputProps) {
  const { register, errors, label, name, type, validation, autoComplete, defaultValue, disabled } = props;
  return (
    <TextField
      type={type}
      label={label}
      name={name}
      fullWidth
      autoComplete={autoComplete}
      {...register(name, validation)}
      error={!!errors[name]}
      helperText={errors[name]?.message ?? ' '}
      defaultValue={defaultValue}
      disabled={disabled ?? false}
    />
  );
}

FieldInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  autoComplete: PropTypes.string,
  defaultValue: PropTypes.string,
};

FieldInput.defaultProps = {
  autoComplete: 'auto',
  defaultValue: '',
  disabled: false,
};
