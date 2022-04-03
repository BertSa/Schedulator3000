import {Route, useRouteMatch} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {useAuth} from '../../hooks/use-auth';
import {FieldInput} from '../shared/form/FormFields';
import {regex} from '../../utilities';
import {Employee, Manager} from '../../models/User';
import {Table, TableHeader, TableRow} from '../shared/Table';
import {Button, Container, Grid} from '@mui/material';
import {Schedule} from './Schedule';
import {IManagerService, useServices} from '../../hooks/use-services';
import {useDialog} from '../../hooks/use-dialog';

export function Dashboards(): React.ReactElement {
    const {path} = useRouteMatch();
    return <>
        <Route path={`${path}/employees`} component={EmployeeManagement}/>
        <Route path={`${path}/schedule`} component={Schedule}/>
    </>;
}

function EmployeeManagement(): React.ReactElement {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const {managerService} = useServices();
    let user = useAuth().getManager();
    useEffect(() => {
        let email = user.email ?? '';
        managerService.getEmployees(email).then(
            employees => setEmployees(employees));
    }, [managerService, user.email]);

    return <>
        <Container maxWidth="sm"
                   sx={{
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center'
                   }}>
            <h2 className="text-center">Employee Management</h2>
            <RegisterEmployee user={user} managerService={managerService} setEmployees={setEmployees}/>
            <EmployeeTable employees={employees}/>
        </Container>
    </>;
}

function EmployeeTable(props: { employees: Employee[] }) {
    return <>
        <h3>Employees</h3>
        <Table>
            <TableHeader>
                <th>#</th>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
            </TableHeader>
            {props.employees.map((employee, index) => <TableRow key={index}>
                <td>{employee.id ?? 'N/A'}</td>
                <td>{employee.firstName ?? 'N/A'}</td>
                <td>{employee.lastName ?? 'N/A'}</td>
                <td>{employee.email ?? 'N/A'}</td>
                <td>{employee.phone ?? 'N/A'}</td>
                <td>{employee.role ?? 'N/A'}</td>
            </TableRow>)}
        </Table>
    </>;
}

type IRegisterEmployeeProps = {
    user: Manager,
    managerService: IManagerService,
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
}

function RegisterEmployee({user, managerService, setEmployees}: IRegisterEmployeeProps): React.ReactElement {
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

        let employee: Employee = {
            id: 0,
            firstName,
            lastName,
            email,
            phone,
            role
        };
        managerService.addEmployee(user.email, employee).then(employee => {
            if (employee !== undefined) {
                setEmployees((curentEmployees: Employee[]) => [...curentEmployees, employee]);
                const defaultMessage = `Hi ${employee.firstName} ${employee.lastName} here's your password:`;
                createDialog({
                    children: <form action={`mailto:${employee.email}`} method="post" encType="text/plain">
                        <input type="text" name="template" value={defaultMessage}/>
                        <input type="text" name="code" disabled value={employee.password} size={50}/>
                        <input type={'submit'} onClick={() => closeDialog()} value="Send"/>
                    </form>
                });
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
                                        value: regex.email,
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
                                        value: regex.phone,
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
