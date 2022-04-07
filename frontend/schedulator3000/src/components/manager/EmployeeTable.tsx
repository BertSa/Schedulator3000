import { Employee } from '../../models/User';
import { Table, TableHeader, TableRow } from '../shared/Table';
import React from 'react';

export function EmployeeTable(props: { employees: Employee[] }) {
    return <>
        <h3>Employees</h3>
        <Table>
            <TableHeader>
                <th>#</th>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
            </TableHeader>
            { props.employees.map((employee, index) => <TableRow key={ index }>
                <td>{ employee.id ?? 'N/A' }</td>
                <td>{ employee.firstName ?? 'N/A' }</td>
                <td>{ employee.lastName ?? 'N/A' }</td>
                <td>{ employee.email ?? 'N/A' }</td>
                <td>{ employee.phone ?? 'N/A' }</td>
                <td>{ employee.role ?? 'N/A' }</td>
            </TableRow>) }
        </Table>
    </>;
}
