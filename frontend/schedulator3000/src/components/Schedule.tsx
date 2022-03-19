import {Calendar, CalendarProps, dateFnsLocalizer, Event, SlotInfo, stringOrDate, Views} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enCA from 'date-fns/locale/en-CA';
import React, {ComponentType, useEffect, useState} from 'react';
import withDragAndDrop, {withDragAndDropProps} from 'react-big-calendar/lib/addons/dragAndDrop';
import addHours from 'date-fns/addHours';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {Avatar, Button, Dialog, Grid, InputAdornment, MenuItem, TextField} from '@mui/material';
import {DateTimePicker} from '@mui/lab';
import {AccountCircle} from '@mui/icons-material';
import {Employee} from '../models/user';
import {useAuth} from '../hooks/use-auth';
import {getEmployees} from '../services/ManagerService';
import {addShift, getWeekOf} from '../services/ScheduleService';
import {stringAvatar, stringToColor} from '../utilities';

const locales = {
    'en-CA': enCA
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});
const DnDCalendar = withDragAndDrop(Calendar as ComponentType<CalendarProps<any>>);
const customSlotPropGetter = (date: Date) => {
    if (date.getDate() === 6 || date.getDate() === 15)
        return {
            className: 'special-day',
            onEventDrop: null,
            onEventResize: null
        };
    else return {};
};

const preferences = {
    calendar: {
        step: 15,
        timeslots: 2,
        scrollToTime: new Date(1970, 1, 1, 6)
    }
};


export const Schedule = () => {
    const user = useAuth().getManager();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        function getCurrentWeek(weekFirstDay: string, employees: Employee[]) {
            getWeekOf(weekFirstDay).then(
                week => {
                    if (!week) {
                        setEvents([]);
                        return;
                    }
                    let events = week.shifts.map(shift => {
                        let employee1 = employees.find(employee => employee.id === shift.idEmployee);

                        let event: Event = {
                            title: employee1?.lastName + ' ' + employee1?.firstName,
                            start: new Date(new Date(shift.startTime).getTime() - new Date(shift.startTime).getTimezoneOffset() * 60000),
                            end: new Date(new Date(shift.endTime).getTime() - new Date(shift.endTime).getTimezoneOffset() * 60000),
                            resource: {
                                id: shift.id,
                                employeeId: shift.idEmployee
                            }
                        };
                        return event;
                    });
                    setEvents(events);
                });
        }

        if (user) {
            getEmployees(user.email ?? '').then(
                employees => {
                    setEmployees(employees);

                    let weekFirstDay = new Date().toLocaleDateString('en-CA', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                    });
                    getCurrentWeek(weekFirstDay, employees);
                });
        }
    }, []);

    if (!user) {
        return null;
    }

    const {setValue, getValues, register, handleSubmit, formState: {errors}} = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            start: new Date(),
            end: new Date(),
            employeeId: -1
        }
    });


    function updateEvent(data: { event: Event; start: stringOrDate; end: stringOrDate; isAllDay: boolean }) {
        const {start, end, isAllDay, event} = data;
        const {resource, title, allDay} = event;

        setEvents((currentEvents: Event[]) => {
            const modifiedEvent: Event = {
                title: title,
                start: new Date(start),
                end: allDay === isAllDay ? new Date(end) : addHours(new Date(start), 1),
                allDay: isAllDay,
                resource: resource
            };
            return [...currentEvents.filter(event => event.resource.id !== resource.id), modifiedEvent];
        });
    }

    const onEventResize: withDragAndDropProps['onEventResize'] = data => updateEvent(data);
    const onEventDrop: withDragAndDropProps['onEventDrop'] = data => updateEvent(data);

    const handleSelect: CalendarProps['onSelectSlot'] = ({start, end}: SlotInfo): void => {
        setValue('start', start as Date);
        setValue('end', end as Date);
        setDialogOpen(true);
    };

    const submit: SubmitHandler<FieldValues> = ({start, end, employeeId}, event) => {
        event?.preventDefault();
        const newShift: any = {
            startTime: new Date(new Date(start).toISOString()),
            endTime: new Date(new Date(end).toISOString()),
            idEmployee: employeeId
        };

        addShift(newShift).then(
            shift => {
                if (!shift){
                    return;
                }

                let employee1 = employees.find(employee => employee.id === shift.idEmployee);
                let event: Event = {
                    title: employee1?.lastName + ' ' + employee1?.firstName,
                    start: new Date(shift.startTime),
                    end: new Date(shift.endTime),
                    resource: {
                        id: shift.id,
                        employeeId: shift.idEmployee
                    }
                };
                setEvents((currentEvents: Event[]) => [...currentEvents, event]);
                setDialogOpen(false);
            }
        );
    };

    // noinspection RequiredAttributes

    return (<>
            <DnDCalendar
                defaultView={Views.WEEK}
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
                selectable
                popup
                toolbar={false}
                startAccessor={(event: Event) => new Date(event.start as Date)}
                onSelectEvent={data => alert(data)}
                onSelectSlot={handleSelect}
                dayPropGetter={customSlotPropGetter}
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
                onSelecting={() => true}
            />
            <Dialog open={dialogOpen} title="dadad" onClose={() => setDialogOpen(false)}>
                <Grid container columnSpacing={2} rowSpacing={2} padding={2} component="form"
                      onSubmit={handleSubmit(submit)}
                      noValidate>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Select"
                            fullWidth
                            defaultValue={'-1'}
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
                    </Grid>
                </Grid>
            </Dialog>
        </>
    );
};
