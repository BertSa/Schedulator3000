import {Calendar, CalendarProps, dateFnsLocalizer, Event, SlotInfo, stringOrDate, Views} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import React, {ComponentType, useState} from 'react';
import withDragAndDrop, {withDragAndDropProps} from 'react-big-calendar/lib/addons/dragAndDrop';
import addHours from 'date-fns/addHours';
import startOfHour from 'date-fns/startOfHour';
import {FieldInput} from './Form/FormFields';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {Button, Dialog, Grid, InputAdornment, MenuItem, TextField} from '@mui/material';
import {DateTimePicker} from '@mui/lab';
import {AccountCircle} from '@mui/icons-material';


let users = [
    {
        id: 1,
        name: 'John Doe'
    },
    {
        id: 2,
        name: 'Jane Doe'
    },
    {
        id: 3,
        name: 'Jack Doe'
    },
    {
        id: 4,
        name: 'Jill Doe'
    },
    {
        id: 5,
        name: 'Joe Doe'
    },
    {
        id: 6,
        name: 'Jenny Doe'
    },
    {
        id: 7,
        name: 'Dill Doe'
    }
];
const locales = {
    'en-US': enUS
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});
const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1);
const now = new Date();
const start = endOfHour(now);
const end = addHours(start, 1);
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


export const Schedule = (props: any) => {
    const {setValue, register, handleSubmit, formState: {errors}} = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    });
    let [start, setStart] = useState<any>('2018-01-01T00:00:00.000');
    let [end, setEnd] = useState<any>('2018-01-01T00:00:00.000');
    let [opene, setOpene] = useState<boolean>(false);


    const [events, setEvents] = useState<Event[]>([
        {
            title: 'Learn cool stuff',
            start,
            end,
            resource: {
                id: 1,
                user:users[0].id
            }
        },
        {
            title: 'Learn cool stuff',
            start,
            end,
            resource: {
                id: 2,
                user:users[0].id
            }
        },
        {
            title: 'Learn cool stuff',
            start,
            end,
            resource: {
                id: 3,
                user:users[2].id
            }
        },
        {
            title: 'Learn cool stuff',
            start,
            end,
            resource: {
                id: 4,
                user:users[6].id
            }
        },
        {
            title: 'Learn cool stuff',
            start,
            end,
            resource: {
                id: 5,
                user:users[4].id
            }
        },
        {
            title: 'Learn cool stuff',
            start,
            end,
            resource: {
                id: 6,
                user:users[3].id
            }
        }
    ]);

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

    const handleSelect: CalendarProps['onSelectSlot'] = (slotInfo: SlotInfo) => {
        setValue('start', slotInfo.start);
        setValue('end', slotInfo.end);
        setStart(slotInfo.start);
        setEnd(slotInfo.end);
        setOpene(true);
    };

    const submit: SubmitHandler<FieldValues> = (data, event) => {
        event?.preventDefault();
        console.log(data);
        const {
            start,
            end,
            title,
            user,
        } = data;
        const newEvent: Event = {
            title,
            start: new Date(start),
            end: new Date(end),
            resource: {id:(Math.random() * 100), user: user}
        };
        setEvents([...events, newEvent]);
        setOpene(false);
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
                    let eee = {
                        style: {
                            backgroundColor: event.resource.user % 6 === 0 ? '#f44336' : event.resource.user % 5 === 0 ? '#2196f3' : event.resource.user % 4 === 0 ? '#4caf50' : event.resource.user % 3 === 0 ? '#ff9800' : event.resource.user % 2 === 0 ? '#ffeb3b' : '#9c27b0',
                            color: '#fff',
                            border: 'none'
                        }
                    };
                    if (event.start?.getDay() === 6 || event.start?.getDay() === 15) {
                        eee.style.backgroundColor = '#f44336';
                        eee.style.color = '#fff';
                    }

                    return eee;
                }}
                onSelecting={() => true}
            />
            <Dialog open={opene} title="dadad" onClose={() => setOpene(false)}>
                <Grid container columnSpacing={2} padding={2} component="form" onSubmit={handleSubmit(submit)}
                      noValidate>
                    <Grid item xs={6}>
                        <FieldInput label="title"
                                    validation={{
                                        required: 'Ce champ est obligatoire!',
                                        pattern: {
                                            value: /^[a-zA-Z ]{5,35}$/,
                                            message: 'Le prénom doit contenir que des lettres!'
                                        }
                                    }}
                                    name="title"
                                    register={register}
                                    errors={errors}
                                    type="text"
                                    defaultValue={''}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Select"
                            defaultValue="0"
                            fullWidth
                            SelectProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle/>
                                    </InputAdornment>
                                )
                            }}
                            {...register("user")}
                        >
                            <MenuItem hidden value="0">Choisir un utilisateur</MenuItem>
                            {users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <DateTimePicker value={start}
                                        renderInput={(props) => <TextField {...props} />}
                                        label="DateTimePicker"
                                        onChange={(date) => {
                                            setStart(date);
                                            setValue('start', date);
                                        }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DateTimePicker value={end}
                                        renderInput={(props) => <TextField {...props} />}
                                        label="DateTimePicker"
                                        onChange={(date) => {
                                            setEnd(end);
                                            setValue('end', date);
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

