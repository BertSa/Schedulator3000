import { Box, Collapse, IconButton, Skeleton, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import React from 'react';

export default function ScheduleTableBodySkeleton() {
  return (
    <TableBody>
      <TableRow className="myRow">
        <TableCell width="6.5%">
          <IconButton aria-label="expand row" size="small">
            <KeyboardArrowDown />
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" width="15%">
          <Skeleton />
        </TableCell>
        <TableCell align="center" width="">
          <br />
          <Skeleton />
          <br />
        </TableCell>
        <TableCell align="center">
          <Skeleton />
          -
          <Skeleton />
        </TableCell>
        <TableCell align="center">
          <Skeleton />
          -
          <Skeleton />
        </TableCell>
        <TableCell align="center">
          <Skeleton />
          -
          <Skeleton />
        </TableCell>
        <TableCell align="center">
          <Skeleton />
          -
          <Skeleton />
        </TableCell>
        <TableCell align="center">
          <Skeleton />
          -
          <Skeleton />
        </TableCell>
        <TableCell align="center">
          <Skeleton />
          -
          <Skeleton />
        </TableCell>
        <TableCell align="right" width="7%">
          <Skeleton />
        </TableCell>
      </TableRow>
      <TableRow className="myRow">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={false} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Preferences and Notes
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={false} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Skeleton />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
