import { Route, useRouteMatch } from 'react-router-dom';
import React from 'react';
import { Schedule } from './Schedule/Schedule';
import { EmployeeManagement } from './EmployeeManagement/EmployeeManagement';
import { ScheduleTable } from './Schedule/ScheduleTable';

export function Dashboards(): React.ReactElement {
    const {path} = useRouteMatch();
    return <>
        <Route path={ `${ path }/employees` } component={ EmployeeManagement } />
        <Route path={ `${ path }/schedulev2` } component={ Schedule } />
        <Route path={ `${ path }/schedule` } component={ ScheduleTable } />
    </>;
}

