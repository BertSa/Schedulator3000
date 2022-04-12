import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Employee } from '../../../models/User';
import { getBeginningOfWeek, getCurrentTimezoneDate, toLocalDateString } from '../../../utilities';
import { FieldValues, useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/use-auth';
import { useServices } from '../../../hooks/use-services';
import { ShiftsFromToDto } from '../../../models/ShiftsFromTo';
import { addDays, differenceInDays, differenceInMinutes, format, getDay, hoursToMinutes, minutesToHours } from 'date-fns';
import { Shift } from '../../../models/Shift';


function Row({employee, shifts}: { employee: Employee, shifts: Shift[][] }) {
    const [open, setOpen] = useState(false);

    const getTimeInHourMinutesAMPM = (date: Date) => format(new Date(date), 'h:mma');

    function getTotal(): string {
        const number: number = shifts.reduce((acc, curr) => {
            return acc + curr.reduce((acc, curr) => {
                return acc + differenceInMinutes(new Date(curr.endTime), new Date(curr.startTime));
            }, 0);
        }, 0);
        const hours: number = minutesToHours(number);
        const minutes: number = number - hoursToMinutes(hours);

        return `${ hours }:${ minutes < 10 ? `0${ minutes }` : minutes }`;
    }

    return (
        <>
            <TableRow sx={ {'& > *': {borderBottom: 'unset'}} }>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={ () => setOpen(!open) }
                    >
                        { open ? <KeyboardArrowUp /> : <KeyboardArrowDown /> }
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    { employee.firstName } { employee.lastName }
                </TableCell>
                { shifts.map((day, key) =>
                    <TableCell key={ key } align="center">
                        { day[0]?.startTime && getTimeInHourMinutesAMPM(getCurrentTimezoneDate(day[0].startTime)) } - { day[0]?.endTime && getTimeInHourMinutesAMPM(getCurrentTimezoneDate(day[0].endTime)) }
                    </TableCell>) }
                <TableCell align="right">{ getTotal() }</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={ {paddingBottom: 0, paddingTop: 0} } colSpan={ 6 }>
                    <Collapse in={ open } timeout="auto" unmountOnExit>
                        <Box sx={ {margin: 1} }>
                            <Typography variant="h6" gutterBottom component="div">
                                Preferences and Notes
                            </Typography>
                            {/*<Table size="small" aria-label="purchases">*/ }
                            {/*    <TableHead>*/ }
                            {/*        <TableRow>*/ }
                            {/*            <TableCell>Date</TableCell>*/ }
                            {/*            <TableCell>Customer</TableCell>*/ }
                            {/*            <TableCell align="right">Amount</TableCell>*/ }
                            {/*            <TableCell align="right">Total price ($)</TableCell>*/ }
                            {/*        </TableRow>*/ }
                            {/*    </TableHead>*/ }
                            {/*    <TableBody>*/ }
                            {/*        {row.history.map((historyRow) => (*/ }
                            {/*            <TableRow key={historyRow.date}>*/ }
                            {/*                <TableCell component="th" scope="row">*/ }
                            {/*                    {historyRow.date}*/ }
                            {/*                </TableCell>*/ }
                            {/*                <TableCell>{historyRow.customerId}</TableCell>*/ }
                            {/*                <TableCell align="right">{historyRow.amount}</TableCell>*/ }
                            {/*                <TableCell align="right">*/ }
                            {/*                    {Math.round(historyRow.amount * row.price * 100) / 100}*/ }
                            {/*                </TableCell>*/ }
                            {/*            </TableRow>*/ }
                            {/*        ))}*/ }
                            {/*    </TableBody>*/ }
                            {/*</Table>*/ }
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}


export function ScheduleTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [curentWeek, setCurrentWeek] = useState<Date>(getBeginningOfWeek(getCurrentTimezoneDate(new Date())));
    const {setValue, getValues, register, handleSubmit, formState: {errors}, reset, control} = useForm<FieldValues>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            start: new Date(),
            end: new Date(),
            employeeId: -1
        }
    });
    const user = useAuth().getManager();
    const {managerService, shiftService} = useServices();

    useEffect(() => {
        let body: ShiftsFromToDto = {
            userEmail: user.email,
            from: toLocalDateString(addDays(curentWeek, -7)),
            to: toLocalDateString(addDays(curentWeek, 14))
        };
        managerService.getEmployees(user.email ?? '').then(
            list => {
                setEmployees(list);
                shiftService.getShiftsManager(body).then(
                    shifts => {
                        if (shifts.length === 0) {
                            setShifts([]);
                            return;
                        }
                        setShifts(shifts);
                    });
            });
    }, [curentWeek, managerService, user.email, shiftService]);


    return (
        <>
            <TableContainer component={ Paper }>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Employee</TableCell>
                            <TableCell align="center">Sunday</TableCell>
                            <TableCell align="center">Monday</TableCell>
                            <TableCell align="center">Tuesday</TableCell>
                            <TableCell align="center">Wednesday</TableCell>
                            <TableCell align="center">Thursday</TableCell>
                            <TableCell align="center">Friday</TableCell>
                            <TableCell align="center">Saturday</TableCell>
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { employees.map((employee) => {
                            const weekShift: Shift[][] = new Array(7);
                            const filter: Shift[] = shifts.filter(value => {
                                const number: number = differenceInDays(new Date(value.startTime), curentWeek);
                                return number >= 0 && number < 7 && value.emailEmployee === employee.email;
                            });

                            for (let i = 0; i < 7; i++) {
                                const found: Shift | undefined = filter.find(shift => getDay(new Date(shift.startTime)) === i);
                                weekShift[i] = found ? [found] : [];
                            }

                            return <Row key={ employee.id } employee={ employee } shifts={ weekShift } />;
                        }) }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
