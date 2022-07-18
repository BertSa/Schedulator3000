import React, { useState } from 'react';
import { Container } from '@mui/material';
import VacationRequestManagementTable from './VacationRequestManagementTable';
import { Employee, Manager } from '../../../models/User';
import { IVacationRequest } from '../../../models/IVacationRequest';
import { useServices } from '../../../hooks/use-services/useServices';
import { useAuth } from '../../../contexts/AuthContext';
import useAsync from '../../../hooks/useAsync';

export default function VacationRequestManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vacationRequests, setVacationRequests] = useState<IVacationRequest[]>([]);
  const { managerService, vacationRequestService } = useServices();
  const manager: Manager = useAuth().getManager();

  const { loading } = useAsync(
    () =>
      new Promise<void>(async (resolve, reject) => {
        await managerService.getEmployees(manager.email).then(setEmployees, reject);
        await vacationRequestService.getAllByManagerEmail(manager.email).then(setVacationRequests, reject);
        resolve();
      }),
    [manager.email],
  );

  return (
    <Container maxWidth="lg">
      <VacationRequestManagementTable
        loading={loading}
        employees={employees}
        vacationRequests={vacationRequests}
        setVacationRequests={setVacationRequests}
      />
    </Container>
  );
}
