import { TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';

interface TableBodyEmptyProps {
  colSpan: number;
  message: string;
}

export default function TableBodyEmpty({ colSpan, message }: TableBodyEmptyProps) {
  return (
    <TableBody>
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell colSpan={colSpan} align="center">
          {message}
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
