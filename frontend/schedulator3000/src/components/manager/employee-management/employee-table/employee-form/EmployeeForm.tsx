import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Grid } from '@mui/material';
import { FieldInput } from '../../../../shared/form/FormFields';
import { regex } from '../../../../../utilities';
import React from 'react';
import { Employee, EmployeeFormType } from '../../../../../models/User';

interface EmployeeFormProps {
    submit: SubmitHandler<EmployeeFormType>,
    emailDisabled: boolean,
    onCancel: VoidFunction,
    employee?: Employee,
}

EmployeeForm.defaultProps = {
    emailDisabled: false
};

export function EmployeeForm({submit, emailDisabled, onCancel, employee}: EmployeeFormProps): JSX.Element {
    const {register, handleSubmit, formState: {errors}} = useForm<EmployeeFormType>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            email: employee?.email ?? '',
            firstName: employee?.firstName ?? '',
            lastName: employee?.lastName ?? '',
            phone: employee?.phone ?? '',
            role: employee?.role ?? '',
        }
    });

    return <Grid container
                 component="form"
                 spacing={ 2 }
                 onSubmit={ handleSubmit(submit) }
                 noValidate>
        <Grid item xs={ 12 } sm={ 6 }>
            <FieldInput register={ register }
                        errors={ errors }
                        name="firstName"
                        label="First Name"
                        autoComplete="given-name"
                        type="text"
                        validation={ {
                            required: 'Ce champ est obligatoire!',
                            pattern: {
                                value: /^[a-zA-Z]+$/,
                                message: 'Le prénom doit contenir que des lettres!'
                            }
                        } } />
        </Grid>
        <Grid item xs={ 12 } sm={ 6 }>
            <FieldInput register={ register }
                        errors={ errors }
                        name="lastName"
                        label="Last Name"
                        type="text"
                        autoComplete="family-name"
                        validation={ {
                            required: 'This field is required!',
                            pattern: {
                                value: /^[a-zA-Z]+$/,
                                message: 'The last name must contain only letters!'
                            }
                        } } />
        </Grid>
        <Grid item xs={ 12 }>
            <FieldInput label="Email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        register={ register }
                        errors={ errors }
                        disabled={ emailDisabled }
                        validation={ {
                            required: 'This field is required',
                            pattern: {
                                value: regex.email,
                                message: 'Please enter a valid email address'
                            }
                        } }
            />
        </Grid>
        <Grid item xs={ 12 }>
            <FieldInput register={ register }
                        errors={ errors }
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        autoComplete="tel-country-code"
                        validation={ {
                            required: 'This field is required!',
                            pattern: {
                                value: regex.phone,
                                message: 'Phone number is not valid!'
                            }
                        } } />
        </Grid>
        <Grid item xs={ 12 }>
            <FieldInput register={ register }
                        errors={ errors }
                        name="role"
                        label="Role"
                        type="text"
                        autoComplete="role"
                        validation={ {
                            required: 'This field is required!',
                            pattern: {
                                value: /^[a-zA-Z]+$/,
                                message: 'The role must contain only letters!'
                            }
                        } } />
        </Grid>
        <Grid item xs={ 12 } justifyContent={ 'center' }>
            <Button
                type="submit"
                variant="contained"
                color="primary"
            >
                Submit
            </Button>
            <Button
                type="button"
                variant="text"
                color="primary"
                onClick={ () => onCancel() }
            >
                Cancel
            </Button>
        </Grid>
    </Grid>;
}
