import PropTypes from 'prop-types';

import { TextField } from '@mui/material';
import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

FieldInput.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    autoComplete: PropTypes.string,
    defaultValue: PropTypes.string,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    validation: PropTypes.object.isRequired,
};

interface FieldInputProps {
    label: string,
    name: string,
    type: React.InputHTMLAttributes<unknown>['type'],
    autoComplete?: React.InputHTMLAttributes<unknown>['autoComplete'],
    defaultValue?: string
    register: Function,
    errors: FieldErrors,
    validation: RegisterOptions,
    disabled?: boolean
}

export function FieldInput(props: FieldInputProps) {
    const {register, errors, label, name, type, validation, autoComplete, defaultValue, disabled} = props;
    return <TextField
        type={ type }
        label={ label }
        name={ name }
        autoComplete={ autoComplete }
        { ...register(name, validation) }
        fullWidth
        error={ !!errors[name] }
        helperText={ errors[name]?.message ?? ' ' }
        defaultValue={ defaultValue }
        disabled={ disabled ?? false }
    />;
}
