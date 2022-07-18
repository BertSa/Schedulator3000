import { Icon, Skeleton, TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';

export default function VacationRequestManagementTableBodySkeleton() {
  return (
    <TableBody>
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component="th" scope="row" width="5%">
          <Skeleton />
        </TableCell>
        <TableCell width="15%">
          <Skeleton />
        </TableCell>
        <TableCell width="10%">
          <Skeleton />
        </TableCell>
        <TableCell width="10%">
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell align="center" width="10%">
          <Icon>
            <Skeleton variant="circular" />
          </Icon>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
