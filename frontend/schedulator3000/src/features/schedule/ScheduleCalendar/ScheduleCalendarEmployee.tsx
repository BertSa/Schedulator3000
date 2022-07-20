import React, { useEffect, useState } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Container, Paper, useTheme } from '@mui/material';
import { useServices } from '../../../hooks/use-services/useServices';
import { IRequestDtoShiftsFromTo } from '../models/IRequestDtoShiftsFromTo';
import { isBetween, localizer } from '../../../utilities/DateUtilities';
import { IShiftEvent } from '../models/IShiftEvent';
import { useAuth } from '../../../contexts/AuthContext';
import useCurrentWeek from '../../../hooks/useCurrentWeek';
import { IVacationRequest } from '../../vacation-request/models/IVacationRequest';
import useDebounce from '../../../hooks/useDebounce';
import ScheduleCalendarToolbar from './ScheduleCalendarToolbar';
import { VacationRequestStatus } from '../../../enums/VacationRequestStatus';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { BigCalendar } from '../lib/BigCalendar';
import getDefaultDayProps from './GetDefaultDayProps';

function ScheduleCalendar() {
  const user = useAuth().getEmployee();
  const currentWeek = useCurrentWeek();
  const [events, setEvents] = useState<IShiftEvent[]>([]);
  const [vacationRequests, setVacationRequests] = useState<IVacationRequest[]>([]);
  const { shiftService, vacationRequestService } = useServices();
  const { palette: { warning, grey, primary, secondary } } = useTheme();

  const eventProps = {
    style: {
      backgroundColor: primary.main,
      color: primary.contrastText,
      fontSize: '1.2rem',
    },
  };

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

  const dayPropGetter = (date:Date) => {
    let dayProp: React.HTMLAttributes<HTMLDivElement> = getDefaultDayProps(date, secondary, grey);

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
  };

  return (
    <Container component={Paper} sx={{ padding: 4 }}>
      <BigCalendar
        events={events}
        localizer={localizer}
        showAllEvents={false}
        showMultiDayTimes={false}
        eventPropGetter={() => eventProps}
        dayPropGetter={dayPropGetter}
        onNavigate={(date, view, act) => currentWeek.onNavigate(act)}
        components={{
          toolbar: ({ view, onView, onNavigate }) => (
            <ScheduleCalendarToolbar date={currentWeek.value} view={view} onView={onView} onNavigate={onNavigate} />
          ),
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
