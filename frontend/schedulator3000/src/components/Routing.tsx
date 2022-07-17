import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import SignUpPage from '../features/authentication/SignUpPage';
import SignInPage from '../features/authentication/SignInPage';
import NotFoundPage from './NotFoundPage';
import EmployeeManagement from '../features/EmployeeManagement';
import ScheduleCalendarManager from '../features/schedule/ScheduleCalendar/ScheduleCalendarManager';
import ScheduleTable from '../features/schedule/ScheduleTable/ScheduleTable';
import VacationRequestManagementTable from '../features/vacation-request/VacationRequestManagementTable';
import ScheduleCalendarEmployee from '../features/schedule/ScheduleCalendar/ScheduleCalendarEmployee';
import VacationRequestTable from '../features/vacation-request/VacationRequestTable';
import AvailabilitiesTable from '../features/availiability/AvailabilitiesTable';
import NewEmployeePage from '../features/authentication/NewEmployeePage';
import {
  RouteAdmin,
  RouteEmployee,
  RouteNewEmployee,
  RouteUnAuthenticated,
} from './ConditionalRouting/ConditionalRoute';

export default function Routing() {
  return (
    <>
      <RouteAdmin path="/manager/employees" component={EmployeeManagement} />
      <RouteAdmin path="/manager/schedulev2" component={ScheduleCalendarManager} />
      <RouteAdmin path="/manager/schedule" component={ScheduleTable} />
      <RouteAdmin path="/manager/vacation-requests" component={VacationRequestManagementTable} />
      <RouteAdmin exact path="/manager" component={() => <Redirect to="/manager/vacation-requests" />} />

      <RouteEmployee path="/schedule" component={ScheduleCalendarEmployee} />
      <RouteEmployee path="/vacation-requests" component={VacationRequestTable} />
      <RouteEmployee path="/availabilities" component={AvailabilitiesTable} />

      <RouteNewEmployee path="/welcome" component={NewEmployeePage} />

      <RouteUnAuthenticated path="/register" component={SignUpPage} />
      <RouteUnAuthenticated exact path="/" component={SignInPage} />

      <Route path="/404" component={NotFoundPage} />
    </>
  );
}
