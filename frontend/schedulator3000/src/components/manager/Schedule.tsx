import React, { ComponentType, useEffect, useState } from 'react';
import { Calendar, CalendarProps, Event, Navigate, SlotInfo, stringOrDate, View, Views } from 'react-big-calendar';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { addDays } from 'date-fns';
import { Controller, UnpackNestedValue, useForm } from 'react-hook-form';
import { Avatar, Button, Grid, InputAdornment, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { AccountCircle, ArrowBack, ArrowForward, ContentCopy, Delete, Edit } from '@mui/icons-material';
import { DateTimePicker } from '@mui/lab';
import { Employee } from '../../models/User';
import { useAuth } from '../../hooks/use-auth';
import { getBeginningOfWeek, getCurrentTimezoneDate, localizer, preferences, stringAvatar, stringToColor, toLocalDateString } from '../../utilities';
import { useDialog } from '../../hooks/use-dialog';
import { Shift, ShiftWithoutId } from '../../models/Shift';
import { useServices } from '../../hooks/use-services';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ShiftsFromToDto } from '../../models/ShiftsFromTo';
import { ShiftEvent } from '../../models/ShiftEvent';

enum SubmitType {
    CREATE,
    UPDATE
}

type Ress = {
    employeeId: number,
}

const DnDCalendar = withDragAndDrop<ShiftEvent, Ress>(Calendar as ComponentType<CalendarProps<ShiftEvent, Ress>>);

type ContextMenuStates = {
    mouseX: number;
    mouseY: number;
    shiftEvent: ShiftEvent;
}

type FormFieldValue = {
    start: Date,
    end: Date,
    employeeId: number,
    shiftId?: number,
}

export const Schedule = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [events, setEvents] = useState<ShiftEvent[]>([]);
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
    const [contextMenu, setContextMenu] = React.useState<ContextMenuStates | null>(null);
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
                            setEvents([]);
                            return;
                        }
                        let map: ShiftEvent[] = shifts.map(shift => {
                            if (!shift?.id) {
                                return {} as ShiftEvent;
                            }
                            let employee = list.find(employee => employee.email === shift.emailEmployee);

                            let event: ShiftEvent = {
                                resourceId: shift.id,
                                title: employee?.lastName + ' ' + employee?.firstName,
                                start: getCurrentTimezoneDate(shift.startTime),
                                end: getCurrentTimezoneDate(shift.endTime),
                                resource: {
                                    employeeId: employee?.id
                                }
                            };
                            return event;
                        });
                        setEvents(map);
                    });
            });
    }, [curentWeek, managerService, user.email, shiftService]);

    function ToolbarCalendar(props: { onView: Function, date: stringOrDate, view: View, onNavigate: Function }) {
        useEffect(() => {
            setCurrentWeek(getBeginningOfWeek(props.date));
        }, [props.date]);

        return <>
            <div className="d-inline-block">
                <div>
                    <Button onClick={ () => props.onNavigate(Navigate.PREVIOUS) }>
                        <ArrowBack />
                    </Button>
                    <Button onClick={ () => props.onNavigate(Navigate.TODAY) }>
                        Today
                    </Button>
                    <Button onClick={ () => props.onNavigate(Navigate.NEXT) }>
                        <ArrowForward />
                    </Button>
                </div>
                { props.view === Views.DAY && <div>{ new Date(props.date).toLocaleDateString() }</div> }
                <div>
                    <Button onClick={ () => props.onView(Views.WEEK) }>
                        Week
                    </Button>
                    <Button onClick={ () => props.onView(Views.DAY) }>
                        Day
                    </Button>
                </div>
            </div>
        </>;
    }


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
                emailManager: user.email ?? ''
            };

            shiftService.create(newShift).then(
                shift => {
                    if (!shift) {
                        return;
                    }

                    let event: ShiftEvent = {
                        resourceId: shift.id,
                        title: employee?.lastName + ' ' + employee?.firstName,
                        start: getCurrentTimezoneDate(shift.startTime),
                        end: getCurrentTimezoneDate(shift.endTime),
                        resource: {
                            employeeId: employeeId
                        }
                    };
                    setEvents((currentEvents: ShiftEvent[]) => [...currentEvents, event]);
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
                            setEvents(curent => curent.filter(shift => shift.resourceId !== shiftId));
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

                    let event: ShiftEvent = {
                        resourceId: shift.id,
                        title: employee?.lastName + ' ' + employee?.firstName,
                        start: getCurrentTimezoneDate(shift.startTime),
                        end: getCurrentTimezoneDate(shift.endTime),
                        resource: {
                            employeeId: employeeId
                        }
                    };
                    closeDialog(id);
                    reset();
                    setEvents((currentEvents: ShiftEvent[]) => [...currentEvents.filter(event => event.resourceId !== shiftId), event]);
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
                                                                  value={ user.id }><Avatar { ...stringAvatar(user.firstName + ' ' + user.lastName) } /> { user.firstName } { user.lastName }
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
                                    <DateTimePicker
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
                                    <DateTimePicker
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
                                    reset();
                                } }>Cancel</Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </>
            )
        });
    }

    function updateEvent(data: { event: ShiftEvent; start: stringOrDate; end: stringOrDate; isAllDay: boolean }) {
        const {start, end, event: {resourceId, resource}} = data;

        setValue('start', start as Date);
        setValue('end', end as Date);
        setValue('employeeId', resource.employeeId);
        setValue('shiftId', resourceId);
        openMyDialog(SubmitType.UPDATE);
    }

    const onEventResize: withDragAndDropProps<ShiftEvent, Ress>['onEventResize'] = data => updateEvent(data);
    const onEventDrop: withDragAndDropProps<ShiftEvent, Ress>['onEventDrop'] = data => updateEvent(data);


    const handleSelect: CalendarProps['onSelectSlot'] = ({start, end}: SlotInfo): void => {
        setValue('start', start as Date);
        setValue('end', end as Date);
        openMyDialog(SubmitType.CREATE);
    };


    const handleContextMenu = (event: React.MouseEvent, shiftEvent: ShiftEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX - 2,
                    mouseY: event.clientY - 4,
                    shiftEvent: shiftEvent
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };


    return (<>
            <DnDCalendar
                defaultView={ Views.WEEK }
                defaultDate={ getBeginningOfWeek(new Date()) }
                views={ [Views.WEEK, Views.DAY] }
                events={ events }
                localizer={ localizer }
                style={ {
                    height: 500,
                    colorScheme: 'dark',
                    color: '#fff'
                } }
                onEventDrop={ onEventDrop }
                onEventResize={ onEventResize }
                step={ preferences.calendar.step }
                timeslots={ preferences.calendar.timeslots }
                scrollToTime={ preferences.calendar.scrollToTime }
                showMultiDayTimes={ true }
                allDayAccessor={ 'allDay' }
                selectable={ 'ignoreEvents' }
                popup
                toolbar={ preferences.calendar.toolbar }
                startAccessor={ (event: Event) => new Date(event.start as Date) }
                onSelectEvent={ (data) => {
                    setValue('start', data.start as Date);
                    setValue('end', data.end as Date);
                    setValue('employeeId', data.resource.employeeId);
                    setValue('shiftId', data.resourceId);
                    openMyDialog(SubmitType.UPDATE);
                } }
                onSelectSlot={ handleSelect }
                min={ new Date('2022-03-19T04:00:00.000Z') }
                max={ new Date('2022-03-20T03:59:00.000Z') }
                resizable
                dayLayoutAlgorithm={ 'overlap' }
                eventPropGetter={ (event: Event) => {
                    let employee = employees.find(employee => employee.id === event.resource.employeeId);
                    let fullName = employee?.lastName + ' ' + employee?.firstName;
                    let eventProps = {
                        style: {
                            backgroundColor: stringToColor(fullName),
                            color: '#fff',
                            border: 'none'
                        }
                    };
                    if (event.start?.getDay() === 6 || event.start?.getDay() === 15) {
                        eventProps.style.backgroundColor = '#f44336';
                        eventProps.style.color = '#fff';
                    }

                    return eventProps;
                } }
                components={
                    {
                        eventWrapper: ({event, children}) => (
                            <div onContextMenu={ e => handleContextMenu(e, event) }>
                                { children }
                            </div>
                        ),
                        toolbar: ({date, view, onView, onNavigate}) => (
                            <ToolbarCalendar
                                date={ date }
                                view={ view }
                                onView={ onView }
                                onNavigate={ onNavigate }
                            />
                        )
                    }
                }
            />
            <Menu
                open={ contextMenu !== null }
                onClose={ handleClose }
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null ?
                        {top: contextMenu.mouseY, left: contextMenu.mouseX} :
                        undefined
                }
            >
                <MenuItem onClick={ () => {
                    if (contextMenu !== null) {
                        let shiftEvent = contextMenu.shiftEvent;
                        setValue('start', shiftEvent.start as Date);
                        setValue('end', shiftEvent.end as Date);
                        setValue('employeeId', shiftEvent.resource.employeeId);
                        setValue('shiftId', shiftEvent.resourceId);
                        openMyDialog(SubmitType.UPDATE);
                    }
                    handleClose();
                } }>
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={ () => {
                    if (contextMenu !== null) {
                        let shiftEvent = contextMenu.shiftEvent;
                        setValue('start', shiftEvent.start as Date);
                        setValue('end', shiftEvent.end as Date);
                        setValue('employeeId', shiftEvent.resource.employeeId);
                        openMyDialog(SubmitType.CREATE);
                    }
                    handleClose();
                } }>
                    <ListItemIcon>
                        <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Duplicate</ListItemText>
                </MenuItem>
                <MenuItem sx={ {alignContent: 'center'} } onClick={ () => {
                    shiftService.deleteShift(contextMenu?.shiftEvent.resourceId as number).then(deleted =>
                        deleted && setEvents(curent => curent.filter(shift => shift.resourceId !== contextMenu?.shiftEvent.resourceId))
                    );
                    handleClose();
                } }>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};


