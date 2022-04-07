import { useServices } from '../../hooks/use-services';
import React, { useEffect, useState } from 'react';
import { ShiftsFromToDto } from '../../models/ShiftsFromTo';
import { getBeginningOfWeek, getCurrentTimezoneDate, localizer, preferences, toLocalDateString } from '../../utilities';
import { addDays } from 'date-fns';
import { ShiftEvent } from '../../models/ShiftEvent';
import { Calendar, Event, Views } from 'react-big-calendar';
import { useAuth } from '../../hooks/use-auth';

export function ScheduleEmployee() {
    const {shiftService} = useServices();
    const user = useAuth().getEmployee();
    const [curentWeek, setCurrentWeek] = useState<Date>(getBeginningOfWeek(getCurrentTimezoneDate(new Date())));
    const [events, setEvents] = useState<ShiftEvent[]>([]);

    useEffect(() => {
        let body: ShiftsFromToDto = {
            userEmail: user.email,
            from: toLocalDateString(addDays(curentWeek, -7)),
            to: toLocalDateString(addDays(curentWeek, 14))
        };
        shiftService.getShiftsEmployee(body).then(
            shifts => {
                if (shifts.length === 0) {
                    setEvents([]);
                    return;
                }
                let shiftEvents: ShiftEvent[] = shifts.map(shift => {
                    if (!shift?.id) {
                        return {} as ShiftEvent;
                    }

                    let event: ShiftEvent = {
                        resourceId: shift.id,
                        title: 'Title',
                        start: getCurrentTimezoneDate(shift.startTime),
                        end: getCurrentTimezoneDate(shift.endTime),
                        resource: {}
                    };

                    return event;
                });
                setEvents(shiftEvents);
            });
    }, [user.email, curentWeek, shiftService]);

    return (
        <>
            <h1>Schedule Employee</h1>
            <Calendar
                defaultView={ Views.WEEK }
                defaultDate={ getBeginningOfWeek(new Date()) }
                views={ [Views.WEEK, Views.WORK_WEEK, Views.DAY] }
                events={ events }
                localizer={ localizer }
                style={ {
                    height: 500,
                    colorScheme: 'dark',
                    color: '#fff'
                } }
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
                    // setValue('start', data.start as Date);
                    // setValue('end', data.end as Date);
                    // setValue('employeeId', data.resource.employeeId);
                    // setValue('shiftId', data.resourceId);
                    // openMyDialog(SubmitType.UPDATE);
                } }
                min={ new Date('2022-03-19T04:00:00.000Z') }
                max={ new Date('2022-03-20T03:59:00.000Z') }
                dayLayoutAlgorithm={ 'overlap' }
                onNavigate={ (date: Date) => {
                    setCurrentWeek(date);
                } }
                components={
                    {
                        eventWrapper: ({children}) => (
                            <div onContextMenu={ e => {/* handleContextMenu(e, event);*/
                            } }>
                                { children }
                            </div>
                        )
                    }
                }
            />
        </>
    );
}
