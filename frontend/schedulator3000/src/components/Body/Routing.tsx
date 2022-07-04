import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SignUpPage from './Authentication/SignUpPage';
import SignInPage from './Authentication/SignInPage';
import NotFoundPage from './NotFoundPage';
import EmployeeManagement from './EmployeeManagement/EmployeeManagement';
import ScheduleCalendarManager from './schedule/ScheduleCalendar/ScheduleCalendarManager';
import ScheduleTable from './schedule/ScheduleTable/ScheduleTable';
import VacationRequestManagementTable from './VacationRequestTable/VacationRequestManagementTable';
import ScheduleCalendarEmployee from './schedule/ScheduleCalendar/ScheduleCalendarEmployee';
import VacationRequestTable from './VacationRequestTable/VacationRequestTable';
import AvailabilitiesTable from './AvailiabilityTable/AvailabilitiesTable';
import NewEmployeePage from './NewEmployeePage/NewEmployeePage';

interface IConditionalRouteProps {
  component: any,
  path: string,
  exact?: boolean,
}

function ConditionalRoute({ condition, redirectPath, component: C, ...rest }:
{ condition:boolean, redirectPath:string } & IConditionalRouteProps) {
  return (
    <Route
      {...rest}
      render={(props) =>
        condition
          ? <C {...props} />
          : (
            <Redirect to={redirectPath} />
          )}
    />
  );
}
ConditionalRoute.defaultProps = {
  exact: false,
};

function RouteAdmin(props: IConditionalRouteProps) {
  const isManager = useAuth().isManager();
  return <ConditionalRoute condition={isManager} redirectPath="/" {...props} />;
}
RouteAdmin.defaultProps = {
  exact: false,
};
function RouteEmployee(props: IConditionalRouteProps) {
  const auth = useAuth();
  const isEmployee = !auth.isNewEmployee() && auth.isEmployee();
  const redirectPath:string = auth.isNewEmployee() ? 'welcome' : '/';

  return <ConditionalRoute condition={isEmployee} redirectPath={redirectPath} {...props} />;
}
RouteEmployee.defaultProps = {
  exact: false,
};

function RouteNewEmployee(props: IConditionalRouteProps) {
  const isEmployee = useAuth().isNewEmployee();
  return <ConditionalRoute condition={isEmployee} redirectPath="/" {...props} />;
}
RouteNewEmployee.defaultProps = {
  exact: false,
};

function RouteUnAuthenticated(props: IConditionalRouteProps) {
  const auth = useAuth();
  const isUnAuthenticated = !auth.isAuthenticated();

  return <ConditionalRoute condition={isUnAuthenticated} redirectPath={auth.isManager() ? '/manager' : '/schedule'} {...props} />;
}
RouteUnAuthenticated.defaultProps = {
  exact: false,
};

export default function Routing() {
  return (
    <>
      <RouteAdmin path="/manager/employees" component={EmployeeManagement} />
      <RouteAdmin path="/manager/schedulev2" component={ScheduleCalendarManager} />
      <RouteAdmin path="/manager/schedule" component={ScheduleTable} />
      <RouteAdmin path="/manager/vacation-requests" component={VacationRequestManagementTable} />
      <RouteAdmin exact path="/manager" component={() => <Redirect to="/manager/employees" />} />

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
