import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

interface IFieldInputProps {
  label: string;
  name: string;
  type: React.InputHTMLAttributes<unknown>['type'];
  autoComplete?: React.InputHTMLAttributes<unknown>['autoComplete'];
  defaultValue?: string;
  validation: RegisterOptions | ((getValues: Function) => RegisterOptions);
  disabled?: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export function FieldInput(props: IFieldInputProps) {
  const { label, name, type, autoComplete, defaultValue, disabled } = props;
  let { validation } = props;
  const { register, formState: { errors }, getValues } = useFormContext();

  if (typeof validation === 'function') {
    validation = validation(getValues) as RegisterOptions;
  }

  return (
    <TextField
      type={type}
      label={label}
      fullWidth
      autoComplete={autoComplete}
      {...register(name, validation)}
      error={Boolean(errors[name])}
      helperText={errors[name]?.message ?? ' '}
      defaultValue={defaultValue}
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
