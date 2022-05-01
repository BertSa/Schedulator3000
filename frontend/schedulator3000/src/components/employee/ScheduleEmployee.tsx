import React, { useEffect, useState } from 'react';
import { format, startOfWeek } from 'date-fns';
import { Calendar, Views } from 'react-big-calendar';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useTheme } from '@mui/material';
import { useServices } from '../../hooks/use-services/use-services';
import { RequestDtoShiftsFromTo } from '../../models/ShiftsFromTo';
import { localizer, preferences } from '../../utilities/DateUtilities';
import { ShiftEvent } from '../../models/ShiftEvent';
import { useAuth } from '../../hooks/use-auth';
import useCurrentWeek from '../../hooks/use-currentWeek';

export default function ScheduleEmployee() {
  // eslint-disable-next-line no-console
  const backup = console.error;
  // eslint-disable-next-line no-console
  console.error = function filter(msg) {
    const supressedWarnings = ['Warning: Using UNSAFE_component', 'Warning: %s is deprecated in StrictMode'];

    if (!supressedWarnings.some((entry) => msg.includes(entry))) {
      backup.apply(console, [msg]);
    }
  };
  const { shiftService } = useServices();
  const user = useAuth().getEmployee();
  const currentWeek = useCurrentWeek();
  const [events, setEvents] = useState<ShiftEvent[]>([]);
  const { palette: { warning, grey } } = useTheme();

  useEffect(() => {
    const body: RequestDtoShiftsFromTo = {
      userEmail: user.email,
      from: format(currentWeek.getPreviousWeek(), 'yyyy-MM-dd'),
      to: format(currentWeek.getNextWeek(), 'yyyy-MM-dd'),
    };
    shiftService.getShiftsEmployee(body).then((shifts) =>
      setEvents(
        shifts.length === 0
          ? []
          : shifts.map((shift) => ({
            resourceId: shift.id,
            title: '',
            start: zonedTimeToUtc(shift.startTime, 'UTC'),
            end: zonedTimeToUtc(shift.endTime, 'UTC'),
            resource: {},
          })),
      ),
    );
  }, [user.email, shiftService]);

  return (
    <>
      <h1>Schedule Employee</h1>
      <Calendar
        defaultView={Views.WEEK}
        defaultDate={startOfWeek(new Date())}
        views={[Views.WEEK, Views.WORK_WEEK]}
        events={events}
        localizer={localizer}
        showAllEvents={false}
        showMultiDayTimes={false}
        toolbar={preferences.calendar.toolbar}
        step={preferences.calendar.step}
        timeslots={preferences.calendar.timeslots}
        min={new Date('2022-03-19T04:00:00.000Z')}
        max={new Date('2022-03-20T03:59:00.000Z')}
        slotPropGetter={() => ({ style: {
          border: '0.5px',
        } })}
        style={{
          colorScheme: 'dark',
        }}
        dayPropGetter={(date) => {
          const day = date.getDay();

          // @ts-ignore
          // eslint-disable-next-line no-constant-condition
          if (1 === 3) {
            return {
              color: '#FFF',
              style: {
                backgroundColor: warning.main + 80,
                border: '0.5px',
              },
            };
          }

          if (day === 0 || day === 6) {
            return {
              color: '#FFF',
              style: {
                backgroundColor: grey['800'] + 55,
                border: '0.5px',
              },
            };
          }
          return {
            color: '#FFF',
          };
        }}
        onNavigate={(date, view, action) => {
          if (action === 'PREV') {
            currentWeek.previous();
          } else if (action === 'NEXT') {
            currentWeek.next();
          } else if (action === 'TODAY') {
            currentWeek.thisWeek();
          }
        }}
      />
    </>
  );
}
