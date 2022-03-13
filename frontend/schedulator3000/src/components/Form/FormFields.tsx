import PropTypes from 'prop-types';

import {TextField} from '@mui/material';
import React from 'react';

FieldInput.propTypes = {
    register: PropTypes.func.isRequired,
    errors: PropTypes.object,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    validation: PropTypes.object.isRequired,
    autoComplete: PropTypes.string
};
type FieldInputProps = {
    register: Function,
    errors: any,
    name: string,
    label: string,
    type: React.InputHTMLAttributes<unknown>['type'],
    validation: object,
    autoComplete?: React.InputHTMLAttributes<unknown>['autoComplete'],
    defaultValue?: string
};

export function FieldInput(props: FieldInputProps) {
    const {register, errors, label, name, type, validation, autoComplete, defaultValue} = props;
    return <TextField
        type={type}
        label={label}
        name={name}
        className=""
        autoComplete={autoComplete}
        {...register(name, validation)}
        fullWidth
        error={!!errors[name]}
        helperText={errors[name]?.message ?? ' '}
        defaultValue={defaultValue}
    />;
}
