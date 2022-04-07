import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useDialog } from '../../hooks/use-dialog';
import { Employee, EmployeeRegister, Manager } from '../../models/User';
import { Button, Grid } from '@mui/material';
import { FieldInput } from '../shared/form/FormFields';
import { regex } from '../../utilities';
import { IManagerService } from '../../hooks/use-services';

type IRegisterEmployeeProps = {
    user: Manager,
    managerService: IManagerService,
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
}

export function RegisterEmployee({user, managerService, setEmployees}: IRegisterEmployeeProps): React.ReactElement {
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    });
    const [createDialog, closeDialog] = useDialog();


    const submit: SubmitHandler<FieldValues> = (data, event) => {
        event?.preventDefault();
        const {
            firstName,
            lastName,
            email,
            phone,
            role
        } = data;

        let employee: EmployeeRegister = {
            firstName,
            lastName,
            email,
            phone,
            role
        };
        managerService.addEmployee(user.email, employee).then(
            employee => {
                if (employee !== undefined) {
                    setEmployees((curentEmployees: Employee[]) => [...curentEmployees, employee]);
                    const defaultMessage = `Hi ${ employee.firstName } ${ employee.lastName } here's your password:`;
                    createDialog({
                        children: <form action={ `mailto:${ employee.email }` } method="post" encType="text/plain">
                            <input type="text" name="template" value={ defaultMessage } />
                            <input type="text" name="code" disabled value={ employee.password }
                                   onClick={ () => navigator.clipboard.writeText(employee.password).then() }
                                   size={ 50 } />
                            <input type={ 'submit' } onClick={ () => closeDialog() } value="Send" />
                        </form>
                    });
                }
            });
    };


    return (<>
            <h3>Register New Employee</h3>
            <Grid container
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
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </>
    );
}
