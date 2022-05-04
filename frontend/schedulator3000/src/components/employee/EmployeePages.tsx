import React from 'react';
import { Route } from 'react-router-dom';
import ScheduleEmployee from './ScheduleEmployee';
import VacationRequestTable from './vacation-request-management/VacationRequestTable';
import AvailabilitiesTable from './availiability/AvailabilitiesTable';

export default function EmployeePages(): React.ReactElement {
  return (
    <>
      <Route path="/schedule" component={ScheduleEmployee} />
      <Route path="/vacation-requests" component={VacationRequestTable} />
      <AvailabilitiesTable />
    </>
  );
}
