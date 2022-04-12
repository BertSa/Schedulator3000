import React from 'react';
import { Container } from '@mui/material';
import { EmployeeTable } from './employee-table/EmployeeTable';

export function EmployeeManagement(): React.ReactElement {
    return <>
        <Container maxWidth="md"
                   sx={ {
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center'
                   } }>
            <h2 className="text-center">Employee Management</h2>
            <EmployeeTable />
        </Container>
    </>;
}
