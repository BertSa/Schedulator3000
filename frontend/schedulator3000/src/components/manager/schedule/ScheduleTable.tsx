import { Box, Button, Collapse, Container, Grid, IconButton, InputAdornment, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { AccountCircle, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Employee } from '../../../models/User';
import { getBeginningOfWeek, getCurrentTimezoneDate, toLocalDateString } from '../../../utilities';
import { Controller, UnpackNestedValue, useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/use-auth';
import { useServices } from '../../../hooks/use-services';
import { ShiftsFromToDto } from '../../../models/ShiftsFromTo';
import { addDays, addWeeks, differenceInDays, differenceInMinutes, format, getDay, hoursToMinutes, minutesToHours, subWeeks } from 'date-fns';
import { Shift, ShiftWithoutId } from '../../../models/Shift';
import { useDialog } from '../../../hooks/use-dialog';
import { TimePicker } from '@mui/lab';
import { SubmitType } from './Schedule';
import { ScheduleTableToolbar } from './ScheduleTableToolbar';


type FormFieldValue = {
    start: Date,
    end: Date,
    employeeId: number,
    shiftId?: number,
}


export function ScheduleTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [curentWeek, setCurrentWeek] = useState<Date>(getBeginningOfWeek(getCurrentTimezoneDate(new Date())));
    const [openDialog, closeDialog] = useDialog();
    const {setValue, getValues, register, handleSubmit, formState: {errors}, reset, control} = useForm<FormFieldValue>({
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

    function openMyDialog(submitType: SubmitType) {
        let id: number;

        function submitCreate({
                                  start,
                                  end,
                                  employeeId
                              }: { start: Date, end: Date, employeeId: number }, event?: React.BaseSyntheticEvent) {
            event?.preventDefault();
            let employee = employees.find(employee => employee.id === employeeId);

            const newShift: ShiftWithoutId = {
                startTime: new Date(new Date(start).toISOString()),
                endTime: new Date(new Date(end).toISOString()),
                emailEmployee: employee?.email ?? '',
                emailManager: user.email ?? '',
            };

            shiftService.create(newShift).then(
                shift => {
                    if (!shift) {
                        return;
                    }
                    setShifts((currentShifts: Shift[]) => [...currentShifts, {
                        ...shift,
                        startTime: getCurrentTimezoneDate(shift.startTime),
                        endTime: getCurrentTimezoneDate(shift.endTime),
                    }]);
                    closeDialog(id);
                    reset();
                }
            );
        }

        function update(data: UnpackNestedValue<FormFieldValue>, event?: any) {
            event?.preventDefault();
            const submitter = event?.nativeEvent.submitter.value;
            const {start, end, employeeId, shiftId} = data;

            if (!shiftId) {
                return;
            }

            if (submitter === 'delete') {
                shiftService.deleteShift(shiftId).then(deleted => {
                        if (deleted) {
                            setShifts(curent => curent.filter(shift => shift.id !== shiftId));
                            closeDialog(id);
                        }
                    }
                );
                return;
            }
            let employee = employees.find(employee => employee.id === employeeId);

            const newShift: Shift = {
                id: shiftId,
                startTime: new Date(new Date(start).toISOString()),
                endTime: new Date(new Date(end).toISOString()),
                emailEmployee: employee?.email ?? '',
                emailManager: user.email ?? ''
            };

            shiftService.updateShift(newShift).then(
                shift => {
                    if (!shift?.id) {
                        return;
                    }

                    closeDialog(id);
                    reset();
                    setShifts((currentShifts: Shift[]) => [...currentShifts.filter(shift => shift.id !== shiftId),
                        {
                            ...shift,
                            startTime: getCurrentTimezoneDate(shift.startTime),
                            endTime: getCurrentTimezoneDate(shift.endTime),
                        }]);
                }
            );
        }

        id = openDialog({
            children: (
                <>
                    <Typography variant="h5"
                                component="h5">{ submitType === SubmitType.CREATE ? 'Create Shift' : 'Modify Shift' }</Typography>
                    <Grid container columnSpacing={ 2 } rowSpacing={ 2 } padding={ 2 } component="form"
                          onSubmit={ handleSubmit(submitType === SubmitType.CREATE ? submitCreate : update) }
                          noValidate>
                        <Grid item xs={ 12 }>
                            <TextField
                                select
                                label="Select"
                                fullWidth
                                defaultValue={ getValues().employeeId ?? '-1' }
                                disabled={ submitType === SubmitType.UPDATE }
                                SelectProps={ {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    )
                                } }
                                { ...register('employeeId', {
                                    required: true,
                                    validate: (value: number) => value !== -1 ? undefined : 'Please select an employee',
                                }) }
                                helperText={ errors.employeeId ?? ' ' }
                                error={ !!errors.employeeId }
                            >
                                <MenuItem hidden aria-hidden value={ -1 } />
                                { employees.map(user => <MenuItem key={ user.id }
                                                                  value={ user.id }>{ user.firstName } { user.lastName }
                                </MenuItem>) }
                            </TextField>
                        </Grid>
                        <Grid item xs={ 6 }>
                            <Controller
                                name="start"
                                control={ control }
                                rules={ {
                                    required: true
                                } }
                                render={ ({fieldState, formState, field}) => (
                                    <TimePicker
                                        label="Start Time"
                                        renderInput={ (props) => <TextField { ...props }
                                                                            helperText={ errors.start ?? ' ' }
                                                                            error={ !!errors.start } /> }
                                        { ...field }
                                        { ...fieldState }
                                        { ...formState }
                                    />
                                ) }
                            />
                        </Grid>
                        <Grid item xs={ 6 }>
                            <Controller
                                name="end"
                                control={ control }
                                rules={ {
                                    required: true,
                                    validate: (value) => {
                                        if (value < getValues().start) {
                                            return 'End time must be after start time';
                                        }
                                    }
                                } }
                                render={ ({fieldState, formState, field}) => (
                                    <TimePicker
                                        label="End Time"
                                        renderInput={ (props) => <TextField helperText={ errors.end?.message ?? ' ' }
                                                                            error={ !!errors.end }
                                                                            { ...props } /> }
                                        { ...field }
                                        { ...fieldState }
                                        { ...formState }
                                    />
                                ) }
                            />
                        </Grid>
                        <Grid item alignSelf={ 'center' } marginX={ 'auto' }>
                            <Stack spacing={ 2 } direction="row">
                                <Button type="submit" color="primary"
                                        variant="contained">{ submitType === SubmitType.CREATE ? 'Submit' : 'Update' }</Button>
                                { submitType === SubmitType.UPDATE &&
                                    <Button value="delete" type="submit" color="error"
                                            variant="contained">Delete</Button> }
                                <Button value="cancel" type="button" color="primary" variant="text" onClick={ () => {
                                    closeDialog(id);
                                } }>Cancel</Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </>
            )
        });
    }


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
                        setShifts(shifts.map(shift => ({
                            ...shift,
                            startTime: getCurrentTimezoneDate(shift.startTime),
                            endTime: getCurrentTimezoneDate(shift.endTime),
                        })));
                    });
            });
    }, [curentWeek, managerService, user.email, shiftService]);

    const getDateOfDay = (day: number) => format(addDays(curentWeek, day), 'yyyy-MM-dd');

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
                        <TableCell key={ key } align="center" sx={ {cursor: 'pointer'} } onClick={ () => {
                            reset();
                            setValue('start', day[0]?.startTime ?? addDays(curentWeek, key));
                            setValue('end', day[0]?.endTime ?? addDays(curentWeek, key));
                            setValue('employeeId', employee.id);
                            if (day[0]) {
                                setValue('shiftId', day[0].id);
                                openMyDialog(SubmitType.UPDATE);
                            } else {
                                openMyDialog(SubmitType.CREATE);
                            }
                        } }>
                            { day[0]?.startTime && getTimeInHourMinutesAMPM(day[0].startTime) } - { day[0]?.endTime && getTimeInHourMinutesAMPM(day[0].endTime) }
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
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    }


    return (
        <Container maxWidth="lg">
            <TableContainer component={ Paper }>
                <ScheduleTableToolbar
                    currentWeek = { getDateOfDay(0) }
                    prev={ () => setCurrentWeek(curentWeek => subWeeks(curentWeek, 1)) }
                    next={ () => setCurrentWeek(curentWeek => addWeeks(curentWeek, 1)) } />
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Employee</TableCell>
                            <TableCell align="center">
                                Sunday<br />
                                <small>{ getDateOfDay(0) }</small>
                            </TableCell>
                            <TableCell align="center">
                                Monday<br />
                                <small>{ getDateOfDay(1) }</small>
                            </TableCell>
                            <TableCell align="center">
                                Tuesday<br />
                                <small>{ getDateOfDay(2) }</small>
                            </TableCell>
                            <TableCell align="center">
                                Wednesday<br />
                                <small>{ getDateOfDay(3) }</small>
                            </TableCell>
                            <TableCell align="center">
                                Thursday<br />
                                <small>{ getDateOfDay(4) }</small>
                            </TableCell>
                            <TableCell align="center">
                                Friday<br />
                                <small>{ getDateOfDay(5) }</small>
                            </TableCell>
                            <TableCell align="center">
                                Saturday<br />
                                <small>{ getDateOfDay(6) }</small>
                            </TableCell>
                            <TableCell align="right">Total</TableCell>
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
        </Container>
    );
}
