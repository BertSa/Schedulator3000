import { Route, useRouteMatch } from 'react-router-dom';
import React from 'react';
import { Schedule } from './Schedule';
import { EmployeeManagement } from './EmployeeManagement/EmployeeManagement';

export function Dashboards(): React.ReactElement {
    const {path} = useRouteMatch();
    return <>
        <Route path={ `${ path }/employees` } component={ EmployeeManagement } />
        <Route path={ `${ path }/schedule` } component={ Schedule } />
    </>;
}

