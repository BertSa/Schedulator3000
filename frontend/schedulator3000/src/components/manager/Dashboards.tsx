import {Route, useRouteMatch} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {useAuth} from '../../hooks/use-auth';
import {FieldInput} from '../shared/form/FormFields';
import {regexEmail, regexPhone} from '../../utilities';
import {Employee} from '../../models/User';
import {Table, TableHeader, TableRow} from '../shared/Table';
import {Button, Container, Grid, Link} from '@mui/material';
import {Schedule} from './Schedule';
import {useServices} from '../../hooks/use-services';

export function Dashboards(): React.ReactElement {
    const {path} = useRouteMatch();
    return <>
        <Link href={`${path}/employees`}>Employee Management</Link>
        <Link href={`${path}/schedule`}>Schedule</Link>
        <Route path={`${path}/employees`} component={EmployeeManagement}/>
        <Route path={`${path}/schedule`} component={Schedule}/>
    </>;
}

function EmployeeManagement(): React.ReactElement {
    return <Container maxWidth="sm"
                      sx={{
                          marginTop: 8,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                      }}>
        <h2 className="text-center">Employee Management</h2>
        <RegisterEmployee/>
        <EmployeeList/>
    </Container>;
}

function EmployeeList() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const {managerService} = useServices();
    let user = useAuth().getManager();
    useEffect(() => {
        let email = user.email ?? '';
        managerService.getEmployees(email).then(
            employees => {
                user.employees = employees;
                setEmployees(employees);
            });
    }, []);

    return <Table>
        <TableHeader>
            <th>#</th>
            <th>FirstName</th>
            <th>LastName</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
        </TableHeader>
        {employees.map((employee, index) => <TableRow key={index}>
            <td>{employee.id ?? 'N/A'}</td>
            <td>{employee.firstName ?? 'N/A'}</td>
            <td>{employee.lastName ?? 'N/A'}</td>
            <td>{employee.email ?? 'N/A'}</td>
            <td>{employee.phone ?? 'N/A'}</td>
            <td>{employee.role ?? 'N/A'}</td>

        </TableRow>)}
    </Table>;
}

function RegisterEmployee() {
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    });
    const user = useAuth().getManager();
    const {managerService} = useServices();

    const submit: SubmitHandler<FieldValues> = (data, event) => {
        event?.preventDefault();
        const {
            firstName,
            lastName,
            email,
            phone,
            role
        } = data;

        let employee: Employee = {
            id: 0,
            firstName,
            lastName,
            email,
            phone,
            role
        };
        managerService.addEmployee(user.email, employee).then(({ok, body}) => {
            if (ok) {
                user.employees.push(body as Employee);
            }
        });
    };


    return (<>
            <h3>Register New Employee</h3>
            <Grid container
                  component="form"
                  spacing={2}
                  onSubmit={handleSubmit(submit)}
                  noValidate>
                <Grid item xs={12} sm={6}>
                    <FieldInput register={register}
                                errors={errors}
                                name="firstName"
                                label="First Name"
                                autoComplete="given-name"
                                type="text"
                                validation={{
                                    required: 'Ce champ est obligatoire!',
                                    pattern: {
                                        value: /^[a-zA-Z]+$/,
                                        message: 'Le prénom doit contenir que des lettres!'
                                    }
                                }}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FieldInput register={register}
                                errors={errors}
                                name="lastName"
                                label="Last Name"
                                type="text"
                                autoComplete="family-name"
                                validation={{
                                    required: 'This field is required!',
                                    pattern: {
                                        value: /^[a-zA-Z]+$/,
                                        message: 'The last name must contain only letters!'
                                    }
                                }}/>
                </Grid>
                <Grid item xs={12}>
                    <FieldInput label="Email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                register={register}
                                errors={errors}
                                validation={{
                                    required: 'This field is required',
                                    pattern: {
                                        value: regexEmail,
                                        message: 'Please enter a valid email address'
                                    }
                                }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FieldInput register={register}
                                errors={errors}
                                name="phone"
                                label="Phone Number"
                                type="tel"
                                autoComplete="tel-country-code"
                                validation={{
                                    required: 'This field is required!',
                                    pattern: {
                                        value: regexPhone,
                                        message: 'Phone number is not valid!'
                                    }
                                }}/>
                </Grid>
                <Grid item xs={12}>
                    <FieldInput register={register}
                                errors={errors}
                                name="role"
                                label="Role"
                                type="text"
                                autoComplete="role"
                                validation={{
                                    required: 'This field is required!',
                                    pattern: {
                                        value: /^[a-zA-Z]+$/,
                                        message: 'The role must contain only letters!'
                                    }
                                }}/>
                </Grid>
                <Grid item xs={12} justifyContent={'center'}>
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
