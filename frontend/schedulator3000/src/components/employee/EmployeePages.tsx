import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import ScheduleEmployee from './ScheduleEmployee';
import VacationRequestTable from './vacation-request-management/VacationRequestTable';
import AvailabilitiesTable from './availiability/AvailabilitiesTable';

export default function EmployeePages(): React.ReactElement {
  return (
    <>
      <Route exact path="/" component={() => <Redirect to="/schedule" />} />
      <Route path="/schedule" component={ScheduleEmployee} />
      <Route path="/vacation-requests" component={VacationRequestTable} />
      <Route path="/availabilities" component={AvailabilitiesTable} />
    </>
  );
}
