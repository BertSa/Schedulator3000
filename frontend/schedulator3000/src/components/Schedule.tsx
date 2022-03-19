import React, {ComponentType, useEffect, useState} from 'react';
import {
    Calendar,
    CalendarProps,
    dateFnsLocalizer,
    Event,
    Navigate,
    SlotInfo,
    stringOrDate,
    Views
} from 'react-big-calendar';
import withDragAndDrop, {withDragAndDropProps} from 'react-big-calendar/lib/addons/dragAndDrop';
import {addDays, format, getDay, parse, startOfWeek} from 'date-fns';
import enCA from 'date-fns/locale/en-CA';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {Avatar, Button, Grid, InputAdornment, MenuItem, TextField, Typography} from '@mui/material';
import {AccountCircle, ArrowBack, ArrowForward} from '@mui/icons-material';
import {DateTimePicker} from '@mui/lab';
import {Employee} from '../models/user';
import {useAuth} from '../hooks/use-auth';
import {getEmployees} from '../services/ManagerService';
import {create, deleteShift, getWeekOf, updateShift} from '../services/ScheduleService';
import {getBeginningOfWeek, getCurrentTimezoneDate, stringAvatar, stringToColor, toLocalDateString} from '../utilities';
import {useDialog} from '../hooks/use-dialog';
import {Shift} from '../models/Shift';

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
        'en-CA': enCA
    }
});

type Ress = {
    employeeId: number,
}

interface ShiftEvent extends Event {
    resourceId: number,
}

const DnDCalendar = withDragAndDrop<ShiftEvent, Ress>(Calendar as ComponentType<CalendarProps<ShiftEvent, Ress>>);

const preferences = {
    calendar: {
        step: 30,
        timeslots: 2,
        scrollToTime: new Date(1970, 1, 1, 6),
        toolbar: true
    }
};


export const Schedule = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [events, setEvents] = useState<ShiftEvent[]>([]);
    const [curentWeek, setCurrentWeek] = useState<Date>(getBeginningOfWeek(getCurrentTimezoneDate(new Date())));
    const [openDialog, closeDialog] = useDialog();
    const {setValue, getValues, register, handleSubmit, formState: {errors}, reset} = useForm<{
        start: Date,
        end: Date,
        employeeId: number,
        shiftId?: number,
    }>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            start: new Date(),
            end: new Date(),
            employeeId: -1
        }
    });
    const user = useAuth().getManager();

    useEffect(() => {
        let body = {
            managerEmail: user.email,
            from: toLocalDateString(addDays(curentWeek, -7)),
            to: toLocalDateString(addDays(curentWeek, 14))
        };
        getEmployees(user.email ?? '').then(
            list => {
                setEmployees(list);
                getWeekOf(body).then(
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
    }, [curentWeek]);

    if (!user) {
        return null;
    }

    function Toolbar(props: { onView: any, date: any, view: any, onNavigate: any }) {
        useEffect(() => {
            setCurrentWeek(getBeginningOfWeek(props.date));
        }, [props.date]);

        return <>
            <div className="d-inline-block">
                <div>
                    <Button onClick={() => props.onNavigate(Navigate.PREVIOUS)}>
                        <ArrowBack/>
                    </Button>
                    <Button onClick={() => props.onNavigate(Navigate.TODAY)}>
                        Today
                    </Button>
                    <Button onClick={() => props.onNavigate(Navigate.NEXT)}>
                        <ArrowForward/>
                    </Button>
                </div>
                {props.view === Views.DAY && <div>{new Date(props.date).toLocaleDateString()}</div>}
                <div>
                    <Button onClick={() => props.onView(Views.WEEK)}>
                        Week
                    </Button>
                    <Button onClick={() => props.onView(Views.DAY)}>
                        Day
                    </Button>
                </div>
            </div>
        </>;
    }

    function openMyDialog(submit: SubmitHandler<FieldValues>, title: string) {
        // noinspection RequiredAttributes
        openDialog({
            children: (
                <>
                    <Typography variant="h5" component="h5">{title}</Typography>
                    <Grid container columnSpacing={2} rowSpacing={2} padding={2} component="form"
                          onSubmit={handleSubmit(submit)}
                          noValidate>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Select"
                                fullWidth
                                defaultValue={getValues().employeeId ?? '-1'}
                                SelectProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle/>
                                        </InputAdornment>
                                    )
                                }}
                                {...register('employeeId', {
                                    required: true
                                })}
                                helperText={errors.employeeId ?? ' '}
                                error={!!errors.employeeId}
                            >
                                <MenuItem hidden aria-hidden value={-1}/>
                                {employees.map(user => <MenuItem key={user.id}
                                                                 value={user.id}><Avatar {...stringAvatar(user.firstName + ' ' + user.lastName)} /> {user.firstName} {user.lastName}
                                </MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePicker value={getValues().start}
                                            renderInput={(props) => <TextField {...props} />}
                                            label="DateTimePicker"
                                            onChange={(date) => {
                                                setValue('start', date as Date);
                                            }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePicker value={getValues().end}
                                            renderInput={(props) => <TextField {...props} />}
                                            label="DateTimePicker"
                                            onChange={(date) => {
                                                setValue('end', date as Date);
                                            }}
                            />
                        </Grid>
                        <Grid item>
                            <Button type="submit" color="primary" variant="contained">Submit</Button>
                            <Button value={"delete"} type="submit" color="error" variant="contained">Delete</Button>
                        </Grid>
                    </Grid>
                </>
            )
        });
    }

    const update: SubmitHandler<FieldValues> = ({start, end, employeeId, shiftId}, event:any) => {
        event?.preventDefault();
        const submitter = event.nativeEvent.submitter.value

        if (submitter === 'delete') {
            deleteShift(shiftId).then(deleted =>
                deleted && setEvents(curent => curent.filter(shift => shift.resourceId !== shiftId))
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

        updateShift(newShift).then(
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
                closeDialog();
                reset();
                setEvents((currentEvents: ShiftEvent[]) => [...currentEvents.filter(event => event.resourceId !== shiftId), event]);
            }
        );
    };

    function updateEvent(data: { event: ShiftEvent; start: stringOrDate; end: stringOrDate; isAllDay: boolean }) {
        const {start, end, event: {resourceId, resource}} = data;

        setValue('start', start as Date);
        setValue('end', end as Date);
        setValue('employeeId', resource.employeeId);
        setValue('shiftId', resourceId);
        openMyDialog(update, 'Modify shift');
    }

    const onEventResize: withDragAndDropProps<ShiftEvent, any>['onEventResize'] = data => updateEvent(data);
    const onEventDrop: withDragAndDropProps<ShiftEvent, any>['onEventDrop'] = data => updateEvent(data);

    const submitCreate: SubmitHandler<FieldValues> = ({start, end, employeeId}, event) => {
        event?.preventDefault();
        let employee = employees.find(employee => employee.id === employeeId);

        const newShift: Shift = {
            startTime: new Date(new Date(start).toISOString()),
            endTime: new Date(new Date(end).toISOString()),
            emailEmployee: employee?.email ?? '',
            emailManager: user.email ?? ''
        };

        create(newShift).then(
            shift => {
                if (!shift) {
                    return;
                }

                let event: any = {
                    resourceId: shift.id,
                    title: employee?.lastName + ' ' + employee?.firstName,
                    start: getCurrentTimezoneDate(shift.startTime),
                    end: getCurrentTimezoneDate(shift.endTime),
                    resource: {
                        employeeId: employeeId
                    }
                };
                setEvents((currentEvents: any[]) => [...currentEvents, event]);
                closeDialog();
                reset();
            }
        );
    };

    const handleSelect: CalendarProps['onSelectSlot'] = ({start, end}: SlotInfo): void => {
        setValue('start', start as Date);
        setValue('end', end as Date);
        openMyDialog(submitCreate, 'Create shift');
    };

    return (<>
            <DnDCalendar
                defaultView={Views.WEEK}
                defaultDate={getBeginningOfWeek(new Date())}
                views={[Views.WEEK, Views.DAY]}
                events={events}
                localizer={localizer}
                style={{
                    height: 500,
                    colorScheme: 'dark',
                    color: '#fff'
                }}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                step={preferences.calendar.step}
                timeslots={preferences.calendar.timeslots}
                scrollToTime={preferences.calendar.scrollToTime}
                showMultiDayTimes={true}
                allDayAccessor={'allDay'}
                selectable={'ignoreEvents'}
                popup
                toolbar={preferences.calendar.toolbar}
                startAccessor={(event: Event) => new Date(event.start as Date)}
                onSelectEvent={(data, event) => {
                    console.log(event.nativeEvent);
                    setValue('start', data.start as Date);
                    setValue('end', data.end as Date);
                    setValue('employeeId', data.resource.employeeId);
                    setValue('shiftId', data.resourceId);
                    openMyDialog(update, 'Modify shift');
                }}
                onSelectSlot={handleSelect}
                min={new Date('2022-03-19T04:00:00.000Z')}
                max={new Date('2022-03-20T03:59:00.000Z')}
                resizable
                dayLayoutAlgorithm={'overlap'}
                eventPropGetter={(event: Event) => {
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
                }}
                components={
                    {
                        eventWrapper: ({event, children}) => (
                            <div
                                onContextMenu={
                                    e => {
                                        alert(`${event.title} is clicked.`);
                                        e.preventDefault();
                                    }
                                }>

                                {children}
                            </div>
                        ),
                        toolbar: ({date, view, onView, onNavigate}) => (
                            <Toolbar
                                date={date}
                                view={view}
                                onView={onView}
                                onNavigate={onNavigate}
                            />
                        )
                    }
                }
            />
        </>
    );
};
