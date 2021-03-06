import React from 'react';
import { Container } from '@mui/material';
import EmployeeTable from './EmployeeTable/EmployeeTable';

export default function EmployeeManagement(): React.ReactElement {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <EmployeeTable />
    </Container>
  );
}
