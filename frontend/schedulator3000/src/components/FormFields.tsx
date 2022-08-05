import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import FieldInput from './FormInput';

export interface IFieldInputWithFormContextProps {
  label: string;
  name: string;
  type: React.InputHTMLAttributes<unknown>['type'];
  validation: RegisterOptions | ((getValues: Function) => RegisterOptions);
  autoComplete?: React.InputHTMLAttributes<unknown>['autoComplete'];
  defaultValue?: string;
  disabled?: boolean;
}

export default function FieldInputWithFormContext({ validation, ...props }: IFieldInputWithFormContextProps) {
  const { register, formState: { errors }, getValues } = useFormContext();
  const val = typeof validation === 'function' ? validation(getValues) as RegisterOptions : validation;

  return (
    <FieldInput
      {...props}
      errors={errors}
      register={register}
      validation={val}
    />
  );
}

FieldInputWithFormContext.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  autoComplete: PropTypes.string,
  defaultValue: PropTypes.string,
};

FieldInputWithFormContext.defaultProps = {
  autoComplete: 'auto',
  defaultValue: '',
};
