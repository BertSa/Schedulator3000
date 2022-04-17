import { alpha, Box, Button, Collapse, Container, Grid, IconButton, InputAdornment, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Theme, Typography } from '@mui/material';
import { AccountCircle, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Employee } from '../../../models/User';
import { getBeginningOfWeek, getCurrentTimezoneDate, isBetween, toLocalDateString } from '../../../utilities';
import { Controller, UnpackNestedValue, useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/use-auth';
import { useServices } from '../../../hooks/use-services';
import { ShiftsFromToDto } from '../../../models/ShiftsFromTo';
import { addDays, addWeeks, differenceInMinutes, format, getDay, hoursToMinutes, minutesToHours, subWeeks } from 'date-fns';
import { Shift, ShiftWithoutId } from '../../../models/Shift';
import { useDialog } from '../../../hooks/use-dialog';
import { TimePicker } from '@mui/lab';
import { SubmitType } from './Schedule';
import { ScheduleTableToolbar } from './ScheduleTableToolbar';
import { VacationRequest, VacationRequestStatus } from '../../../models/VacationRequest';

type FormFieldValue = {
    start: Date,
    end: Date,
    employeeId: number,
    shiftId?: number,
}


function getColor(vacations: VacationRequest[], getDateOfDay: (day: number) => string, key: number, theme: Theme): string {
    const vacationRequest: VacationRequest | undefined = vacations.find(vacation => isBetween(new Date(getDateOfDay(key)), new Date(vacation.startDate), new Date(vacation.endDate)));
    let color: string;
    switch (vacationRequest?.status) {
        case VacationRequestStatus.Pending:
            color = theme.palette.warning.main;
            break;
        case VacationRequestStatus.Approved:
            color = theme.palette.grey[500];
            break;
        default:
            color = theme.palette.primary.main;
            break;
    }
    return color;
}

export function ScheduleTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [vacations, setVacations] = useState<VacationRequest[]>([]);
    const [curentWeek, setCurrentWeek] = useState<Date>(getBeginningOfWeek(getCurrentTimezoneDate(new Date())));
    const [selected, setSelected] = useState<null | { employee: Employee, day: number, shift: Shift | undefined }>(null);
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
    const manager = useAuth().getManager();
    const {managerService, shiftService, vacationRequestService} = useServices();

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
                emailManager: manager.email ?? '',
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
                            setSelected(null);
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
                emailManager: manager.email ?? ''
            };

            shiftService.updateShift(newShift).then(
                shift => {
                    if (!shift?.id) {
                        return;
                    }

                    closeDialog(id);
                    setShifts((currentShifts: Shift[]) => [...currentShifts.filter(v => v.id !== shiftId),
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
            ),
            onExited: () => reset()
        });
    }


    useEffect(() => {
        let body: ShiftsFromToDto = {
            userEmail: manager.email,
            from: toLocalDateString(addDays(curentWeek, -7)),
            to: toLocalDateString(addDays(curentWeek, 14))
        };
        managerService.getEmployees(manager.email ?? '').then(
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

        vacationRequestService.getAllByManagerEmail(manager.email).then(
            response => setVacations(response));
    }, [curentWeek, managerService, vacationRequestService, manager.email, shiftService]);

    const getDateOfDay = (day: number) => format(addDays(curentWeek, day), 'yyyy-MM-dd');

    const createAction = () => {
        if (selected === null) {
            return;
        }

        setValue('start', selected.shift?.startTime ?? addDays(curentWeek, selected.day));
        setValue('end', selected.shift?.endTime ?? addDays(curentWeek, selected.day));
        setValue('employeeId', selected.employee.id);
        openMyDialog(SubmitType.CREATE);
    };

    const editAction = () => {
        if (!selected?.shift) {
            return;
        }

        setValue('start', selected.shift.startTime);
        setValue('end', selected.shift.endTime);
        setValue('employeeId', selected.employee.id);
        setValue('shiftId', selected.shift.id);
        openMyDialog(SubmitType.UPDATE);
    };

    const removeAction = () => {
        if (!selected?.shift?.id) {
            return;
        }

        shiftService.deleteShift(selected.shift.id).then(deleted => {
                if (deleted && selected?.shift?.id) {
                    setShifts(curent => curent.filter(shift => shift.id !== selected?.shift?.id));
                    setSelected(null);
                }
            }
        );
    };


    const getTimeInHourMinutesAMPM = (date: Date) => format(new Date(date), 'h:mma');

    function Row({
                     employee,
                     shifts,
                     vacations
                 }: { employee: Employee, shifts: (Shift | undefined)[], vacations: VacationRequest[] }) {
        const [open, setOpen] = useState(false);


        function getTotal(): string {
            const number: number = shifts.reduce((acc, curr) => acc + (curr ? differenceInMinutes(new Date(curr.endTime), new Date(curr.startTime)) : 0), 0);
            const hours: number = minutesToHours(number);
            const minutes: number = number - hoursToMinutes(hours);

            return `${ hours }:${ minutes < 10 ? `0${ minutes }` : minutes }`;
        }


        return (
            <>
                <TableRow className="myRow">
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
                    { shifts.map((shift, key) =>
                        <TableCell key={ key }
                                   align="center"
                                   onClick={ () => {
                                       setSelected(current => current?.day === key && current?.employee.id === employee.id ?
                                           null : {
                                               employee: employee,
                                               day: key,
                                               shift: shift
                                           });
                                   } }
                                   sx={ {
                                       cursor: 'pointer',
                                       ...({
                                           bgcolor: (theme) => {
                                               const vacationRequest: VacationRequest | undefined = vacations.find(vacation => isBetween(new Date(getDateOfDay(key)), new Date(vacation.startDate), new Date(vacation.endDate)));
                                               const opacity: number = selected?.day === key && selected?.employee.id === employee.id ? theme.palette.action.selectedOpacity : theme.palette.action.disabledOpacity;

                                               switch (vacationRequest?.status) {
                                                   case VacationRequestStatus.Pending:
                                                       return alpha(theme.palette.warning.main, opacity);
                                                   case VacationRequestStatus.Approved:
                                                       return alpha(theme.palette.grey[500], opacity);
                                                   default:
                                                       return opacity === theme.palette.action.selectedOpacity ? alpha(theme.palette.primary.main, opacity) : 'unset';
                                               }
                                           }
                                       }),
                                       '&:hover': {
                                           bgcolor: (theme) => {
                                               let color = getColor(vacations, getDateOfDay, key, theme);

                                               return alpha(color, theme.palette.action.hoverOpacity);
                                           }
                                       },
                                       '&:active': {
                                           bgcolor: (theme) => {
                                               let color = getColor(vacations, getDateOfDay, key, theme);

                                               return alpha(color, theme.palette.action.activatedOpacity);
                                           }
                                       },
                                   } }>
                            { shift ? `${ shift?.startTime && getTimeInHourMinutesAMPM(shift.startTime) } - ${ shift?.endTime && getTimeInHourMinutesAMPM(shift.endTime) }` : '-' }
                        </TableCell>) }
                    <TableCell align="right">{ getTotal() }</TableCell>
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


    return (
        <Container maxWidth="lg">
            <TableContainer component={ Paper }>
                <ScheduleTableToolbar
                    currentWeek={ curentWeek }
                    prev={ () => setCurrentWeek(curentWeek => subWeeks(curentWeek, 1)) }
                    next={ () => setCurrentWeek(curentWeek => addWeeks(curentWeek, 1)) }
                    selected={ selected }
                    actions={ {
                        create: createAction,
                        edit: editAction,
                        remove: removeAction,
                    } }
                />
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
                            const weekShift: (Shift | undefined)[] = new Array(7);
                            const filter: Shift[] = shifts.filter(value => isBetween(new Date(value.startTime), curentWeek, addWeeks(curentWeek, 1)) && value.emailEmployee === employee.email);
                            for (let i = 0; i < 7; i++) {
                                weekShift[i] = filter.find(shift => getDay(new Date(shift.startTime)) === i);
                            }
                            const requests: VacationRequest[] = vacations.filter(value => value.employeeEmail === employee.email);

                            return <Row key={ employee.id } employee={ employee } shifts={ weekShift }
                                        vacations={ requests } />;
                        }) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
