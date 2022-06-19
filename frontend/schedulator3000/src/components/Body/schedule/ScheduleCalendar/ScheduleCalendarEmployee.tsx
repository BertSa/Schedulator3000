import React, { useEffect, useState } from 'react';
import { addDays, format, isToday, parseISO, startOfWeek } from 'date-fns';
import { Calendar, Views } from 'react-big-calendar';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Container, Paper, useTheme } from '@mui/material';
import { useServices } from '../../../../hooks/use-services/useServices';
import { IRequestDtoShiftsFromTo } from '../../../../models/IRequestDtoShiftsFromTo';
import { isBetween, localizer, preferences } from '../../../../utilities/DateUtilities';
import { IShiftEvent } from '../../../../models/IShiftEvent';
import { useAuth } from '../../../../contexts/AuthContext';
import useCurrentWeek from '../../../../hooks/useCurrentWeek';
import { IVacationRequest } from '../../../../models/IVacationRequest';
import useDebounce from '../../../../hooks/useDebounce';
import ScheduleCalendarToolbar from './ScheduleCalendarToolbar';
import { VacationRequestStatus } from '../../../../enums/VacationRequestStatus';
import ErrorBoundary from '../../../shared/ErrorBoundary';

function ScheduleCalendar() {
  const user = useAuth().getEmployee();
  const currentWeek = useCurrentWeek();
  const [events, setEvents] = useState<IShiftEvent[]>([]);
  const [vacationRequests, setVacationRequests] = useState<IVacationRequest[]>([]);
  const { shiftService, vacationRequestService } = useServices();
  const { palette: { warning, grey, primary, secondary, text } } = useTheme();

  useDebounce(
    () => {
      const body: IRequestDtoShiftsFromTo = {
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
        ));
      return () => {
        setEvents([]);
      };
    },
    1000,
    [currentWeek.value],
  );

  useEffect(() => {
    const body: IRequestDtoShiftsFromTo = {
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
    vacationRequestService.getAllByEmployeeEmail(user.email).then(setVacationRequests);

    return () => {
      setEvents([]);
      setVacationRequests([]);
    };
  }, [user.email, shiftService]);

  return (
    <Container component={Paper} sx={{ padding: 4 }}>
      <Calendar
        defaultView={Views.WEEK}
        defaultDate={startOfWeek(new Date())}
        views={[Views.WEEK, Views.WORK_WEEK]}
        events={events}
        localizer={localizer}
        showAllEvents={false}
        showMultiDayTimes={false}
        components={{
          toolbar: ({ view, onView, onNavigate }) => (
            <ScheduleCalendarToolbar date={currentWeek.value} view={view} onView={onView} onNavigate={onNavigate} />
          ),
        }}
        toolbar={preferences.calendar.toolbar}
        step={preferences.calendar.step}
        timeslots={preferences.calendar.timeslots}
        min={new Date('2022-03-19T04:00:00.000Z')}
        max={new Date('2022-03-20T03:59:00.000Z')}
        slotPropGetter={() => ({
          style: {
            border: '0.5px',
          },
        })}
        style={{
          borderRadius: '5px',
          colorScheme: 'dark',
          color: text.primary,
        }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: primary.main,
            color: primary.contrastText,
            fontSize: '1.2rem',
          },
        })}
        dayPropGetter={(date) => {
          const day = date.getDay();
          let dayProp: React.HTMLAttributes<HTMLDivElement> = {
            style: {
              color: '#FFF',
            },
          };

          if (isToday(date)) {
            dayProp = {
              ...dayProp,
              style: {
                ...dayProp.style,
                color: secondary.main,
                // eslint-disable-next-line prefer-template
                backgroundColor: secondary.main + '99',
              },
            };
          }

          if (day === 0 || day === 6) {
            dayProp = {
              ...dayProp,
              style: {
                // eslint-disable-next-line prefer-template
                backgroundColor: grey['800'] + 'DD',
                ...dayProp.style,
              },
            };
          }

          const vacationRequest = vacationRequests.find((value) =>
            isBetween(date, parseISO(value.startDate.toString()), addDays(parseISO(value.endDate.toString()), 1)),
          );
          if (vacationRequest?.status === VacationRequestStatus.Pending) {
            dayProp = {
              ...dayProp,
              style: {
                backgroundColor: warning.main + 75,
                ...dayProp.style,
              },
            };
          } else if (vacationRequest?.status === VacationRequestStatus.Approved) {
            dayProp = {
              ...dayProp,
              style: {
                backgroundColor: primary.main + 75,
                ...dayProp.style,
              },
            };
          }

          return dayProp;
        }}
        onNavigate={(date, view, act) => {
          if (act === 'PREV') {
            currentWeek.previous();
          } else if (act === 'NEXT') {
            currentWeek.next();
          } else if (act === 'TODAY') {
            currentWeek.thisWeek();
          }
        }}
      />
    </Container>
  );
}

export default function ScheduleCalendarEmployee() {
  return (
    <ErrorBoundary>
      <ScheduleCalendar />
    </ErrorBoundary>
  );
}
