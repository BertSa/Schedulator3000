import React from 'react';
import { Container } from '@mui/material';
import { EmployeeTable } from './employee-table/EmployeeTable';

export function EmployeeManagement(): React.ReactElement {
    return <>
        <Container maxWidth="lg"
                   sx={ {
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center'
                   } }>
            <EmployeeTable />
        </Container>
    </>;
}
