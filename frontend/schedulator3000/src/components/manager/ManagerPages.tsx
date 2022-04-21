import { Route, useRouteMatch } from 'react-router-dom';
import React from 'react';
import { Schedule } from './schedule/Schedule';
import { EmployeeManagement } from './employee-management/EmployeeManagement';
import { ScheduleTable } from './schedule/ScheduleTable';
import { VacationRequestManagementTable } from './vacation-request-management/VacationRequestManagementTable';

export function ManagerPages(): React.ReactElement {
    const {path} = useRouteMatch();
    return <>
        <Route path={ `${ path }/employees` } component={ EmployeeManagement } />
        <Route path={ `${ path }/schedulev2` } component={ Schedule } />
        <Route path={ `${ path }/schedule` } component={ ScheduleTable } />
        <Route path={ `${ path }/vacation-requests` } component={ VacationRequestManagementTable } />
    </>;
}

