import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import SignUpPage from '../features/authentication/SignUpPage';
import SignInPage from '../features/authentication/SignInPage';
import NotFoundPage from './NotFoundPage';
import EmployeeManagement from '../features/EmployeeManagement';
import ScheduleTable from '../features/schedule/ScheduleTable/ScheduleTable';
import VacationRequestTable from '../features/vacation-request/VacationRequest/VacationRequestTable';
import AvailabilitiesTable from '../features/availiability/AvailabilitiesTable';
import NewEmployeePage from '../features/authentication/NewEmployeePage';
import {
  RouteAdmin,
  RouteEmployee,
  RouteNewEmployee,
  RouteUnAuthenticated,
} from './ConditionalRouting/ConditionalRoute';
import VacationRequestManagement from '../features/vacation-request/VacationRequestManagement';

const ScheduleCalendarEmployee = React.lazy(() => import('../features/schedule/ScheduleCalendar/ScheduleCalendarEmployee'));
const ScheduleCalendarManager = React.lazy(() => import('../features/schedule/ScheduleCalendar/ScheduleCalendarManager'));

export default function Routing() {
  return (
    <>
      <RouteAdmin path="/manager/employees" component={EmployeeManagement} />
      <RouteAdmin path="/manager/schedulev2" component={ScheduleCalendarManager} />
      <RouteAdmin path="/manager/schedule" component={ScheduleTable} />
      <RouteAdmin path="/manager/vacation-requests" component={VacationRequestManagement} />
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
