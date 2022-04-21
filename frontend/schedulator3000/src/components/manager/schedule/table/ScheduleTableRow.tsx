import { Employee } from '../../../../models/User';
import { Shift } from '../../../../models/Shift';
import { VacationRequest } from '../../../../models/VacationRequest';
import useToggle from '../../../../hooks/use-toggle';
import { differenceInMinutes, hoursToMinutes, minutesToHours } from 'date-fns';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React from 'react';
import { SelectedType } from './ScheduleTable';
import { ScheduleTableColumnWeek } from './ScheduleTableColumnWeek';
import { Nullable } from '../../../../models/Nullable';


interface EmployeeWeekRowProps {
    selected: SelectedType,
    employee: Employee,
    shifts: Nullable<Shift>[],
    vacations: VacationRequest[],
    currentWeek: any,
    setSelected: React.Dispatch<React.SetStateAction<SelectedType>>,
}


export function ScheduleTableRow({
                                                 selected,
                                                 employee,
                                                 shifts,
                                                 vacations,
                                                 currentWeek,
                                                 setSelected,
                                             }: EmployeeWeekRowProps) {
    const [open, toggle] = useToggle();


    function TotalTime(): JSX.Element {
        const number: number = shifts.reduce((acc, curr) => acc + (curr ? differenceInMinutes(new Date(curr.endTime), new Date(curr.startTime)) : 0), 0);
        const hours: number = minutesToHours(number);
        const minutes: number = number - hoursToMinutes(hours);

        const total: string = `${ hours }:${ minutes < 10 ? `0${ minutes }` : minutes }h`;

        return <>{ total }</>;
    }

    return (
        <>
            <TableRow className="myRow">
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={ toggle }>
                        { open ? <KeyboardArrowUp /> : <KeyboardArrowDown /> }
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{ employee.firstName } { employee.lastName }</TableCell>
                { shifts.map((shift, key) =>
                    <ScheduleTableColumnWeek key={ key }
                                             index={ key }
                                             isSelected={ selected?.day === key && selected?.employee.id === employee.id }
                                             shift={ shift }
                                             vacations={ vacations }
                                             currentWeek={ currentWeek }
                                             onClick={ () => {
                                                         setSelected(current => current?.day === key && current?.employee.id === employee.id ?
                                                             null : {
                                                                 employee: employee,
                                                                 day: key,
                                                                 shift: shift
                                                             });
                                                     } }
                    />) }
                <TableCell align="right"><TotalTime /></TableCell>
            </TableRow>
            <TableRow className="myRow">
                <TableCell style={ {paddingBottom: 0, paddingTop: 0} } colSpan={ 6 }>
                    <Collapse in={ open } timeout="auto" unmountOnExit>
                        <Box sx={ {margin: 1} }>
                            <Typography variant="h6" gutterBottom component="div">
                                Preferences and Notes
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
                <TableCell style={ {paddingBottom: 0, paddingTop: 0} } colSpan={ 6 }>
                    <Collapse in={ open } timeout="auto" unmountOnExit>
                        <Box sx={ {margin: 1} }>
                            <Table>
                                <TableBody>
                                    { vacations.map((value, key) =>
                                        <TableRow key={ key }>
                                            <TableCell component="th" scope="row">
                                                { value.reason }
                                            </TableCell>
                                            <TableCell align="right">{ value.status }</TableCell>
                                        </TableRow>) }
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}