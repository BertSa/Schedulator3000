import React, { useCallback, useState } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Container, Paper, useTheme } from '@mui/material';
import { isBetween, localizer } from '../../../utilities/DateUtilities';
import { IShiftEvent } from '../models/IShiftEvent';
import { useAuth } from '../../../contexts/AuthContext';
import { IVacationRequest } from '../../vacation-request/models/IVacationRequest';
import useDebounce from '../../../hooks/useDebounce';
import ScheduleCalendarToolbar from './ScheduleCalendarToolbar';
import { VacationRequestStatus } from '../../../enums/VacationRequestStatus';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { BigCalendar } from '../lib/BigCalendar';
import getDefaultDayProps from './GetDefaultDayProps';
import useShiftService from '../hooks/useShiftService';
import useVacationRequestService from '../../../hooks/use-services/useVacationRequestService';
import useOnUnmount from '../../../hooks/useOnUnmount';
import useOnMount from '../../../hooks/useOnMount';
import { CurrentWeekContextProvider, useCurrentWeek } from '../contexts/CurrentWeekContext';

function ScheduleCalendar() {
  const shiftService = useShiftService();
  const vacationRequestService = useVacationRequestService();

  const user = useAuth().getEmployee();
  const currentWeek = useCurrentWeek();
  const { palette: { warning, grey, primary, secondary } } = useTheme();

  const [events, setEvents] = useState<IShiftEvent[]>([]);
  const [vacationRequests, setVacationRequests] = useState<IVacationRequest[]>([]);

  const eventProps = {
    style: {
      backgroundColor: primary.main,
      color: primary.contrastText,
      fontSize: '1.2rem',
    },
  };

  const getShifts = useCallback(() =>
    shiftService.getShiftsEmployee({
      userEmail: user.email,
      from: format(currentWeek.getPreviousWeek(), 'yyyy-MM-dd'),
      to: format(currentWeek.getNextWeek(), 'yyyy-MM-dd'),
    }).then((shifts) =>
      setEvents(shifts.map((shift) => (
        {
          resourceId: shift.id,
          title: '',
          start: zonedTimeToUtc(shift.startTime, 'UTC'),
          end: zonedTimeToUtc(shift.endTime, 'UTC'),
          resource: {},
        }
      )))), []);

  useOnUnmount(() => {
    setEvents([]);
    setVacationRequests([]);
  });

  useOnMount(() => {
    getShifts().then();
    vacationRequestService.getAllByEmployeeEmail(user.email).then(setVacationRequests);
  });

  useDebounce(
    () => { getShifts().then(); },
    1000,
    [currentWeek.value],
  );

  const dayPropGetter = (date:Date) => {
    const dayProp: React.HTMLAttributes<HTMLDivElement> = getDefaultDayProps(date, secondary, grey);

    const vacationRequest = vacationRequests.find((value) =>
      isBetween(date, parseISO(value.startDate.toString()), addDays(parseISO(value.endDate.toString()), 1)),
    );
    if (vacationRequest?.status === VacationRequestStatus.Pending) {
      dayProp.style!.backgroundColor = warning.main + 75;
    } else if (vacationRequest?.status === VacationRequestStatus.Approved) {
      dayProp.style!.backgroundColor = primary.main + 75;
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
      <CurrentWeekContextProvider>
        <ScheduleCalendar />
      </CurrentWeekContextProvider>
    </ErrorBoundary>
  );
}
