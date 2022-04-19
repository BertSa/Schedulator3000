import { useServices } from '../../hooks/use-services/use-services';
import React, { useEffect, useState } from 'react';
import { ShiftsFromToDto } from '../../models/ShiftsFromTo';
import { localizer, preferences, toLocalDateString } from '../../utilities';
import { startOfWeek } from 'date-fns';
import { ShiftEvent } from '../../models/ShiftEvent';
import { Calendar, Event, Views } from 'react-big-calendar';
import { useAuth } from '../../hooks/use-auth';
import useCurrentWeek from '../../hooks/use-currentWeek';
import { zonedTimeToUtc } from 'date-fns-tz';

export function ScheduleEmployee() {
    const {shiftService} = useServices();
    const user = useAuth().getEmployee();
    const currentWeek = useCurrentWeek();
    const [events, setEvents] = useState<ShiftEvent[]>([]);

    useEffect(() => {
        let body: ShiftsFromToDto = {
            userEmail: user.email,
            from: toLocalDateString(currentWeek.getPreviousWeek()),
            to: toLocalDateString(currentWeek.getNextWeek())
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
                        start: zonedTimeToUtc(shift.startTime, 'UTC'),
                        end: zonedTimeToUtc(shift.endTime, 'UTC'),
                        resource: {}
                    };

                    return event;
                });
                setEvents(shiftEvents);
            });
    }, [user.email, shiftService]);

    return (
        <>
            <h1>Schedule Employee</h1>
            <Calendar
                defaultView={ Views.WEEK }
                defaultDate={ startOfWeek(new Date()) }
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
                    // setCurrentWeek(date);

                } }
                components={
                    {
                        eventWrapper: ({children}) => (
                            <div onContextMenu={ e => {/* handleContextMenu(e, event);*/
                            } }>
                                { children }
                            </div>
                        ),
                        dayColumnWrapper: ({children}) => (
                            <div onContextMenu={ e => {/* handleContextMenu(e, event);*/
                            } }>
                                { children }
                            </div>
                        ),
                        eventContainerWrapper: ({children}) => (
                            <div onContextMenu={ e => {/* handleContextMenu(e, event);*/
                            } }>
                                { children }
                            </div>
                        ),
                        dateCellWrapper: ({children}) => (
                            <div onContextMenu={ e => {/* handleContextMenu(e, event);*/
                            } }>
                                { children }
                            </div>
                        ),


                    }
                }
            />
        </>
    );
}
