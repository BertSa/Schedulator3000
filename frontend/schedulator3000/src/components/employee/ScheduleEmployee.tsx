/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { addDays, format, isToday, parseISO, startOfWeek } from 'date-fns';
import { Calendar, Navigate, NavigateAction, View, Views } from 'react-big-calendar';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Box, Button, Container, Grid, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useServices } from '../../hooks/use-services/useServices';
import { RequestDtoShiftsFromTo } from '../../models/ShiftsFromTo';
import { isBetween, localizer, preferences } from '../../utilities/DateUtilities';
import { ShiftEvent } from '../../models/ShiftEvent';
import { useAuth } from '../../hooks/useAuth';
import useCurrentWeek from '../../hooks/useCurrentWeek';
import { VacationRequest, VacationRequestStatus } from '../../models/VacationRequest';
import useDebounce from '../../hooks/useDebounce';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.defaultProps = {
  children: undefined,
};

function ToolbarCalendar({
  onNavigate,
  onView,
  view,
  date,
}: {
  onView: (view: View) => void;
  view: View;
  onNavigate: (navigate: NavigateAction, date?: Date) => void;
  date: Date;
}) {
  const selectedTab = view === 'work_week' ? 1 : 0;

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue === 0) {
      onView('week');
    } else if (newValue === 1) {
      onView('work_week');
    }
  };

  return (
    <Grid container sx={{ width: '100%' }} paddingBottom={3}>
      <Grid item xs={4}>
        <Tabs value={selectedTab} onChange={handleChange} aria-label="basic tabs example" sx={{ width: 'auto', minWidth: 0 }}>
          <Tab label="Week" />
          <Tab label="Work Week" />
        </Tabs>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          {format(date, 'MMM dd')}
          {' to '}
          {format(addDays(date, 6), 'MMM dd')}
        </Typography>
      </Grid>
      <Grid item xs={4} display="flex" justifySelf="flex-end" justifyItems="flex-end" justifyContent="flex-end">
        <Button sx={{ height: '100%' }} color="inherit" onClick={() => onNavigate(Navigate.PREVIOUS)}>
          <ArrowBack />
        </Button>
        <Button sx={{ height: '100%' }} color="inherit" onClick={() => onNavigate(Navigate.TODAY)}>
          Today
        </Button>
        <Button sx={{ height: '100%' }} color="inherit" onClick={() => onNavigate(Navigate.NEXT)}>
          <ArrowForward />
        </Button>
      </Grid>
    </Grid>
  );
}

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
  const { shiftService, vacationRequestService } = useServices();
  const user = useAuth().getEmployee();
  const currentWeek = useCurrentWeek();
  const [events, setEvents] = useState<ShiftEvent[]>([]);
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const {
    palette: { warning, grey, primary, secondary, text },
  } = useTheme();

  useDebounce(
    () => {
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
        ));
    },
    1000,
    [currentWeek.value],
  );

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
    vacationRequestService.getAllByEmployeeEmail(user.email).then(setVacationRequests);
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
            <ToolbarCalendar date={currentWeek.value} view={view} onView={onView} onNavigate={onNavigate} />
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
