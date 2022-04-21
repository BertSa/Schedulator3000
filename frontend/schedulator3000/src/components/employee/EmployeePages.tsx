import React from 'react';
import { Route } from 'react-router-dom';
import { ScheduleEmployee } from './ScheduleEmployee';
import { VacationRequestTable } from './vacation-request-management/VacationRequestTable';

export function EmployeePages(): React.ReactElement {
    return <>
        <Route path={ `/schedule` } component={ ScheduleEmployee } />
        <Route path={ `/vacation-requests` } component={ VacationRequestTable } />
    </>;
}
