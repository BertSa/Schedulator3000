import {Route, useHistory, useRouteMatch} from 'react-router-dom';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {RequireAdmin, useAuth} from '../hooks/use-auth';
import {Column} from './Colums';
import {FieldInput} from './Form/FormFields';
import {FormGroup} from './Form/FormGroup';
import {regexEmail, regexPhone} from '../utilities';
import {addEmployee, getEmployees} from '../services/ManagerService';
import {Employee} from '../models/user';
import {Table, TableHeader, TableRow} from './Table';
import {Link} from '@mui/material';
import {Schedule} from './Schedule';

export function Dashboards() {
    const {path} = useRouteMatch();
    return <>
        <RequireAdmin>
            <Link href={`${path}/employees`}>Employee Management</Link>
            <Link href={`${path}/schedule`}>Schedule</Link>
            <Route path={`${path}/employees`} component={EmployeeManagement}/>
            <Route path={`${path}/schedule`} component={Schedule}/>
        </RequireAdmin>
    </>;
}

function EmployeeManagement(): React.ReactElement {
    return <>
        <h2 className="text-center">Employee Management</h2>
        <RegisterEmployee/>
        <EmployeeList/>
    </>;
}

function EmployeeList() {
    const [employees, setEmployees] = useState<Employee[]>([])
    let user = useAuth().getManager();
    useEffect(() => {
        let email = user.email ?? '';
        getEmployees(email).then(
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
        {employees.map((employee,index) => <TableRow key={index}>
            <td>{employee.id ?? "N/A"}</td>
            <td>{employee.firstName ?? "N/A"}</td>
            <td>{employee.lastName ?? "N/A"}</td>
            <td>{employee.email ?? "N/A"}</td>
            <td>{employee.phone ?? "N/A"}</td>
            <td>{employee.role ?? "N/A"}</td>

        </TableRow>)}
    </Table>
}

function RegisterEmployee() {
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    });
    let history = useHistory();
    let user = useAuth().getManager();

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
            firstName,
            lastName,
            email,
            phone,
            role
        };
        addEmployee(user.email, employee).then(({ok, body}) => {
            if (ok) {
                user.employees.push(body as Employee);
            }
        });
    };


    return (<>
        <h3>Register New Employee</h3>
        <form className="form-container" onSubmit={handleSubmit(submit)} noValidate>
            <fieldset>
                <FormGroup>
                    <Column col={{lg: 6}}>
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
                    </Column>
                    <Column col={{lg: 6}}>
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
                    </Column>
                    <Column>
                        <FieldInput label="Email"
                                    validation={{
                                        required: 'This field is required!',
                                        pattern: {
                                            value: regexEmail,
                                            message: 'Email invalide!'
                                        }
                                    }}
                                    register={register}
                                    errors={errors}
                                    name="email"
                                    autoComplete="email"
                                    type="email"
                        />
                    </Column>
                    <Column>
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
                    </Column>
                </FormGroup>
                <div className="form-group text-center">
                    <label/>
                    <div className="btn-group">
                        <input className="btn btn-primary" type="submit" name="submit" value="Submit"/>
                    </div>
                </div>
            </fieldset>
        </form>
    </>);
}
