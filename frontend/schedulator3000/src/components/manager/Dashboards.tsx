import { Route, useRouteMatch } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { Employee } from '../../models/User';
import { Container } from '@mui/material';
import { Schedule } from './Schedule';
import { useServices } from '../../hooks/use-services';
import { EmployeeTable } from './EmployeeTable';
import { RegisterEmployee } from './RegisterEmployee';

export function Dashboards(): React.ReactElement {
    const {path} = useRouteMatch();
    return <>
        <Route path={ `${ path }/employees` } component={ EmployeeManagement } />
        <Route path={ `${ path }/schedule` } component={ Schedule } />
    </>;
}

function EmployeeManagement(): React.ReactElement {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const {managerService} = useServices();
    const user = useAuth().getManager();

    useEffect(() => {
        managerService.getEmployees(user.email).then(
            employees => setEmployees(employees));
    }, [managerService, user.email]);

    return <>
        <Container maxWidth="sm"
                   sx={ {
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center'
                   } }>
            <h2 className="text-center">Employee Management</h2>
            <RegisterEmployee user={ user } managerService={ managerService } setEmployees={ setEmployees } />
            <EmployeeTable employees={ employees } />
        </Container>
    </>;
}
