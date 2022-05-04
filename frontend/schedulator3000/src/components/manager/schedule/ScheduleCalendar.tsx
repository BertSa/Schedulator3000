import React, { ComponentType, useEffect, useState } from 'react';
import { Calendar, CalendarProps, Event, Navigate, SlotInfo, stringOrDate, View, Views } from 'react-big-calendar';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { addDays, format, startOfWeek } from 'date-fns';
import { Controller, UnpackNestedValue, useForm } from 'react-hook-form';
import {
  Avatar,
  Button,
  Container,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AccountCircle, ArrowBack, ArrowForward, ContentCopy, Delete, Edit } from '@mui/icons-material';
import { DateTimePicker } from '@mui/lab';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Employee } from '../../../models/User';
import { useAuth } from '../../../hooks/useAuth';
import { stringAvatar, stringToColor } from '../../../utilities/utilities';
import { getCurrentTimezoneDate, localizer, preferences } from '../../../utilities/DateUtilities';
import { useDialog } from '../../../hooks/useDialog';
import { Shift, ShiftWithoutId } from '../../../models/Shift';
import { useServices } from '../../../hooks/use-services/useServices';
import { RequestDtoShiftsFromTo } from '../../../models/ShiftsFromTo';
import { ShiftEvent } from '../../../models/ShiftEvent';

// eslint-disable-next-line no-shadow
export enum SubmitType {
  CREATE,
  UPDATE,
}

type Ress = {
  employeeId: number,
};

const DnDCalendar = withDragAndDrop<ShiftEvent, Ress>(Calendar as ComponentType<CalendarProps<ShiftEvent, Ress>>);

interface ContextMenuStates {
  mouseX: number;
  mouseY: number;
  shiftEvent: ShiftEvent | null;
}

interface FormFieldValue {
  start: Date,
  end: Date,
  employeeId: number,
  shiftId?: number,
}

export default function ScheduleCalendar() {
  // eslint-disable-next-line no-console
  const backup = console.error;
  // eslint-disable-next-line no-console
  console.error = function filter(msg) {
    const supressedWarnings = ['Warning: Using UNSAFE_component', 'Warning: %s is deprecated in StrictMode'];

    if (!supressedWarnings.some((entry) => msg.includes(entry))) {
      backup.apply(console, [msg]);
    }
  };
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [events, setEvents] = useState<ShiftEvent[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(getCurrentTimezoneDate(new Date())));
  const [openDialog, closeDialog] = useDialog();
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormFieldValue>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      start: new Date(),
      end: new Date(),
      employeeId: -1,
    },
  });
  const [contextMenu, setContextMenu] = React.useState<ContextMenuStates | null>(null);
  const user = useAuth().getManager();
  const { managerService, shiftService } = useServices();

  useEffect(() => {
    const body: RequestDtoShiftsFromTo = {
      userEmail: user.email,
      from: format(addDays(currentWeek, -7), 'yyyy-MM-dd'),
      to: format(addDays(currentWeek, 14), 'yyyy-MM-dd'),
    };
    managerService.getEmployees(user.email ?? '').then(
      (list) => {
        setEmployees(list);
        shiftService.getShiftsManager(body).then(
          (shifts) => {
            if (shifts.length === 0) {
              setEvents([]);
              return;
            }
            const map: ShiftEvent[] = shifts.map((shift) => {
              if (!shift?.id) {
                return {} as ShiftEvent;
              }
              const employee = list.find((emp) => emp.email === shift.emailEmployee);

              const event: ShiftEvent = {
                resourceId: shift.id,
                title: `${employee?.lastName} ${employee?.firstName}`,
                start: zonedTimeToUtc(shift.startTime, 'UTC'),
                end: zonedTimeToUtc(shift.endTime, 'UTC'),
                resource: {
                  employeeId: employee?.id,
                },
              };
              return event;
            });
            setEvents(map);
          });
      });
  }, [currentWeek, managerService, user.email, shiftService]);

  function ToolbarCalendar({
    date,
    onNavigate,
    onView,
    view,
  }: { onView: Function, date: stringOrDate, view: View, onNavigate: Function }) {
    useEffect(() => {
      setCurrentWeek(startOfWeek(new Date(date)));
    }, [date]);

    return (
      <div className="d-inline-block">
        <div>
          <Button onClick={() => onNavigate(Navigate.PREVIOUS)}>
            <ArrowBack />
          </Button>
          <Button onClick={() => onNavigate(Navigate.TODAY)}>
            Today
          </Button>
          <Button onClick={() => onNavigate(Navigate.NEXT)}>
            <ArrowForward />
          </Button>
        </div>
        {view === Views.DAY && <div>{new Date(date).toLocaleDateString()}</div>}
        <div>
          <Button onClick={() => onView(Views.WEEK)}>
            Week
          </Button>
          <Button onClick={() => onView(Views.DAY)}>
            Day
          </Button>
        </div>
      </div>
    );
  }

  function openMyDialog(submitType: SubmitType) {
    function submitCreate({
      start,
      end,
      employeeId,
    }: { start: Date, end: Date, employeeId: number }, event?: React.BaseSyntheticEvent) {
      event?.preventDefault();
      const employee = employees.find((emp) => emp.id === employeeId);

      const dto: ShiftWithoutId = {
        startTime: new Date(new Date(start).toISOString()),
        endTime: new Date(new Date(end).toISOString()),
        emailEmployee: employee?.email ?? '',
        emailManager: user.email ?? '',
      };

      shiftService.create(dto).then(
        (shift) => {
          const shiftEvent: ShiftEvent = {
            resourceId: shift.id,
            title: `${employee?.lastName} ${employee?.firstName}`,
            start: zonedTimeToUtc(shift.startTime, 'UTC'),
            end: zonedTimeToUtc(shift.endTime, 'UTC'),
            resource: {
              employeeId,
            },
          };
          setEvents((currentEvents: ShiftEvent[]) => [...currentEvents, shiftEvent]);
          closeDialog();
          reset();
        },
      );
    }

    function update(data: UnpackNestedValue<FormFieldValue>, event?: any) {
      event?.preventDefault();
      const submitter = event?.nativeEvent.submitter.value;
      const { start, end, employeeId, shiftId } = data;

      if (!shiftId) {
        return;
      }

      if (submitter === 'delete') {
        shiftService.deleteShift(shiftId).then(() => {
          setEvents((current) => current.filter((shift) => shift.resourceId !== shiftId));
          closeDialog();
        },
        );
        return;
      }
      const employee = employees.find((emp) => emp.id === employeeId);

      const dto: Shift = {
        id: shiftId,
        startTime: new Date(new Date(start).toISOString()),
        endTime: new Date(new Date(end).toISOString()),
        emailEmployee: employee?.email ?? '',
        emailManager: user.email ?? '',
      };

      shiftService.updateShift(dto).then(
        (shift) => {
          const shiftEvent: ShiftEvent = {
            resourceId: shift.id,
            title: `${employee?.lastName} ${employee?.firstName}`,
            start: zonedTimeToUtc(shift.startTime, 'UTC'),
            end: zonedTimeToUtc(shift.endTime, 'UTC'),
            resource: {
              employeeId,
            },
          };
          closeDialog();
          reset();
          setEvents((currentEvents: ShiftEvent[]) => [...currentEvents.filter((eve) => eve.resourceId !== shiftId), shiftEvent]);
        },
      );
    }

    openDialog(
      <>
        <Typography
          variant="h5"
          component="h5"
        >
          {submitType === SubmitType.CREATE ? 'Create Shift' : 'Modify Shift'}
        </Typography>
        <Grid
          container
          columnSpacing={2}
          rowSpacing={2}
          padding={2}
          component="form"
          onSubmit={handleSubmit(submitType === SubmitType.CREATE ? submitCreate : update)}
          noValidate
        >
          <Grid item xs={12}>
            <TextField
              select
              label="Select"
              fullWidth
              defaultValue={getValues().employeeId ?? '-1'}
              SelectProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              {...register('employeeId', {
                required: true,
                validate: (value: number) => value !== -1 ? undefined : 'Please select an employee',
              })}
              helperText={errors.employeeId ?? ' '}
              error={!!errors.employeeId}
            >
              <MenuItem hidden aria-hidden value={-1} />
              {employees.map((emp) => (
                <MenuItem
                  key={emp.id}
                  value={emp.id}
                >
                  <Avatar {...stringAvatar(`${emp.firstName} ${emp.lastName}`)} />
                  {' '}
                  {emp.firstName}
                  {' '}
                  {emp.lastName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="start"
              control={control}
              rules={{
                required: true,
              }}
              render={({ fieldState, formState, field }) => (
                <DateTimePicker
                  label="Start Time"
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      helperText={errors.start ?? ' '}
                      error={!!errors.start}
                    />
                  )}
                  {...field}
                  {...fieldState}
                  {...formState}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="end"
              control={control}
              rules={{
                required: true,
                validate: (value) => value >= getValues().start || 'End time must be after start time',
              }}
              render={({ fieldState, formState, field }) => (
                <DateTimePicker
                  label="End Time"
                  renderInput={(props) => (
                    <TextField
                      helperText={errors.end?.message ?? ' '}
                      error={!!errors.end}
                      {...props}
                    />
                  )}
                  {...field}
                  {...fieldState}
                  {...formState}
                />
              )}
            />
          </Grid>
          <Grid item alignSelf="center" marginX="auto">
            <Stack spacing={2} direction="row">
              <Button
                type="submit"
                color="primary"
                variant="contained"
              >
                {submitType === SubmitType.CREATE ? 'Submit' : 'Update'}
              </Button>
              {submitType === SubmitType.UPDATE
                && (
                  <Button
                    value="delete"
                    type="submit"
                    color="error"
                    variant="contained"
                  >
                    Delete
                  </Button>
                )}
              <Button
                value="cancel"
                type="button"
                color="primary"
                variant="text"
                onClick={() => {
                  closeDialog();
                  reset();
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </>);
  }

  function updateEvent(data: { event: ShiftEvent; start: stringOrDate; end: stringOrDate; isAllDay: boolean }) {
    const { start, end, event: { resourceId, resource } } = data;

    setValue('start', start as Date);
    setValue('end', end as Date);
    setValue('employeeId', resource.employeeId);
    setValue('shiftId', resourceId);
    openMyDialog(SubmitType.UPDATE);
  }
  const onEventResize: withDragAndDropProps<ShiftEvent, Ress>['onEventResize'] = (data) => updateEvent(data);
  const onEventDrop: withDragAndDropProps<ShiftEvent, Ress>['onEventDrop'] = (data) => updateEvent(data);

  const handleSelect: CalendarProps['onSelectSlot'] = ({ start, end }: SlotInfo): void => {
    setValue('start', start as Date);
    setValue('end', end as Date);
    openMyDialog(SubmitType.CREATE);
  };

  const handleContextMenu = (event: React.MouseEvent, shiftEvent: ShiftEvent | null) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
          shiftEvent,
        }
        // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
        // Other native context menus might behave different.
        // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <>
      <Container maxWidth="lg">
        <DnDCalendar
          defaultView={Views.WEEK}
          defaultDate={startOfWeek(new Date())}
          views={[Views.WEEK, Views.DAY]}
          events={events}
          localizer={localizer}
          slotPropGetter={() => ({ style: {
            border: '0.5px',
          } })}
          style={{
            colorScheme: 'dark',
          }}
          dayPropGetter={(date) => {
            const day = date.getDay();

            if (day === 0 || day === 6) {
              return {
                color: '#FFF',
                className: 'calendar-weekend',
              };
            }
            return {
              color: '#FFF',
            };
          }}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          step={preferences.calendar.step}
          timeslots={preferences.calendar.timeslots}
          scrollToTime={preferences.calendar.scrollToTime}
          showMultiDayTimes
          allDayAccessor="allDay"
          selectable="ignoreEvents"
          popup
          toolbar={preferences.calendar.toolbar}
          startAccessor={(event: Event) => new Date(event.start as Date)}
          onSelectEvent={(data) => {
            setValue('start', data.start as Date);
            setValue('end', data.end as Date);
            setValue('employeeId', data.resource.employeeId);
            setValue('shiftId', data.resourceId);
            openMyDialog(SubmitType.UPDATE);
          }}
          onSelectSlot={handleSelect}
          min={new Date('2022-03-19T04:00:00.000Z')}
          max={new Date('2022-03-20T03:59:00.000Z')}
          resizable
          dayLayoutAlgorithm="overlap"
          eventPropGetter={(event: Event) => {
            const employee = employees.find((emp) => emp.id === event.resource.employeeId);
            const fullName = `${employee?.lastName} ${employee?.firstName}`;
            const eventProps = {
              style: {
                backgroundColor: stringToColor(fullName),
                color: '#fff',
                border: 'none',
              },
            };
            if (event.start?.getDay() === 6 || event.start?.getDay() === 15) {
              eventProps.style.backgroundColor = '#f44336';
              eventProps.style.color = '#fff';
            }

            return eventProps;
          }}
          components={
            {
              eventWrapper: ({ event, children }) => (
                <div onContextMenu={(e) => handleContextMenu(e, event)}>
                  {children}
                </div>
              ),
              toolbar: ({ date, view, onView, onNavigate }) => (
                <ToolbarCalendar
                  date={date}
                  view={view}
                  onView={onView}
                  onNavigate={onNavigate}
                />
              ),
              timeSlotWrapper: ({ children }) => React.cloneElement(children as any, {
                onContextMenu: (e: any) => {
                  handleContextMenu(e, null);
                },
              }),
            }
          }
        />
      </Container>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        onContextMenu={(e: any) => {
          e.preventDefault();
          handleClose();
        }}
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => {
          if (contextMenu !== null && contextMenu.shiftEvent !== null) {
            const { shiftEvent } = contextMenu;
            setValue('start', shiftEvent?.start as Date);
            setValue('end', shiftEvent?.end as Date);
            setValue('employeeId', shiftEvent?.resource.employeeId);
            setValue('shiftId', shiftEvent?.resourceId);
            openMyDialog(SubmitType.UPDATE);
          }
          handleClose();
        }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (contextMenu !== null && contextMenu.shiftEvent !== null) {
            const { shiftEvent } = contextMenu;
            setValue('start', shiftEvent?.start as Date);
            setValue('end', shiftEvent?.end as Date);
            setValue('employeeId', shiftEvent?.resource.employeeId);
            openMyDialog(SubmitType.CREATE);
          }
          handleClose();
        }}
        >
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem
          sx={{ alignContent: 'center' }}
          onClick={() => {
            shiftService.deleteShift(contextMenu?.shiftEvent?.resourceId as number)
              .then(() => setEvents((current) => current.filter((shift) => shift.resourceId !== contextMenu?.shiftEvent?.resourceId)));
            handleClose();
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
