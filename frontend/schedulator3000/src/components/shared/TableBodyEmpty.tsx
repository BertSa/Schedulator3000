import { TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';

export default function TableBodyEmpty({colSpan, message}: { colSpan: number, message: string }) {
    return <TableBody>
        <TableRow sx={ {'&:last-child td, &:last-child th': {border: 0}} }>
            <TableCell colSpan={ colSpan } align="center">{ message }</TableCell>
        </TableRow>
    </TableBody>;
}
