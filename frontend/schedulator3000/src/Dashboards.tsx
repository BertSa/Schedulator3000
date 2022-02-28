import {Route, useHistory, useRouteMatch} from 'react-router-dom';
import {SignIn} from './components/SignIn';
import React, {useEffect} from 'react';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {useAuth} from './hooks/use-auth';
import {Column} from './components/Colums';
import {FieldInput} from './components/Form/FormFields';
import {FormGroup} from './components/Form/FormGroup';
import {regexEmail, regexPhone} from './utilities';
import {addEmployee, getEmployees} from './services/ManagerService';
import {Employee} from './models/user';
import {Table, TableHeader, TableRow} from './components/Table';

export function Dashboards() {
    const {path} = useRouteMatch();
    return <>
        <Route exact path={`${path}/signin`} component={SignIn}/>
        <Route path={`${path}/employees`} component={EmployeeManagement}/>
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
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    let {user} = useAuth();

    useEffect(() => {
        let email = user?.email ?? '';
        getEmployees(email).then(
            employees => {
                console.log(employees);
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
            <td>{index}</td>
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
    let {user} = useAuth();

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
        if (!user) {
            return;
        }
        addEmployee(user.email, employee).then(() => {
            history.push('/manager/employees');
        });
    };


    return (<>
        <h3>Register New Employee</h3>
        <form className="form-container" onSubmit={handleSubmit(submit)} noValidate>
            <fieldset>
                <FormGroup>
                    <Column col={{lg: 6}}>
                        <FieldInput register={register}
                                    error={errors.firstName}
                                    name="firstName"
                                    label="First Name"
                                    autoComplete="given-name"
                                    placeholder="First name"
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
                                    error={errors.lastName}
                                    name="lastName"
                                    label="Last Name"
                                    placeholder="Last Name"
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
                                    error={errors.email}
                                    name="email"
                                    autoComplete="email"
                                    placeholder="Email"
                                    type="email"
                        />
                    </Column>
                    <Column>
                        <FieldInput register={register}
                                    error={errors.phone}
                                    name="phone"
                                    label="Phone Number"
                                    placeholder="000 000 000"
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
                                    error={errors.role}
                                    name="role"
                                    label="Role"
                                    placeholder="HR"
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
