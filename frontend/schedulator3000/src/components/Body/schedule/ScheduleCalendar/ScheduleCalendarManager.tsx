import React, { ComponentType, useEffect, useState } from 'react';
import { Calendar, CalendarProps, Event, SlotInfo, stringOrDate, Views } from 'react-big-calendar';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, isToday, startOfWeek } from 'date-fns';
import { Container, Menu, MenuItem, Paper, useTheme } from '@mui/material';
import { ContentCopy, Delete, Edit } from '@mui/icons-material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Employee } from '../../../../models/User';
import { useAuth } from '../../../../contexts/AuthContext';
import { stringToColor } from '../../../../utilities/utilities';
import { localizer, preferences } from '../../../../utilities/DateUtilities';
import { useDialog } from '../../../../hooks/useDialog';
import { useServices } from '../../../../hooks/use-services/useServices';
import { IRequestDtoShiftsFromTo } from '../../../../models/IRequestDtoShiftsFromTo';
import { IShiftEvent } from '../../../../models/IShiftEvent';
import ScheduleCalendarToolbar from './ScheduleCalendarToolbar';
import useCurrentWeek from '../../../../hooks/useCurrentWeek';
import { Nullable } from '../../../../models/Nullable';
import { ShiftFormFieldValue } from '../ShiftForm/ShiftForm';
import ShiftFormCreate from '../ShiftForm/ShiftFormCreate';
import ShiftFormEdit from '../ShiftForm/ShiftFormEdit';
import useDebounce from '../../../../hooks/useDebounce';
import { IShift } from '../../../../models/IShift';
import ErrorBoundary from '../../../shared/ErrorBoundary';

type ResourceType = {
  employeeId: number,
};

const DnDCalendar = withDragAndDrop<IShiftEvent, ResourceType>(Calendar as ComponentType<CalendarProps<IShiftEvent, ResourceType>>);

interface IContextMenuStates {
  mouseX: number;
  mouseY: number;
  shiftEvent: IShiftEvent | null;
}

function ScheduleCalendar() {
  const currentWeek = useCurrentWeek();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [events, setEvents] = useState<IShiftEvent[]>([]);
  const [openDialog, closeDialog] = useDialog();
  const [contextMenu, setContextMenu] = React.useState<Nullable<IContextMenuStates>>(null);
  const { managerService, shiftService } = useServices();
  const { palette: { grey, secondary, text } } = useTheme();
  const user = useAuth().getManager();

  useEffect(() => {
    const body: IRequestDtoShiftsFromTo = {
      userEmail: user.email,
      from: format(currentWeek.getPreviousWeek(), 'yyyy-MM-dd'),
      to: format(currentWeek.getNextWeek(), 'yyyy-MM-dd'),
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
            const map: IShiftEvent[] = shifts.map((shift) => {
              if (!shift?.id) {
                return {} as IShiftEvent;
              }
              const employee = list.find((emp) => emp.email === shift.emailEmployee);

              const event: IShiftEvent = {
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

    return () => {
      setEvents([]);
      setContextMenu(null);
      setEmployees([]);
    };
  }, [user.email]);

  useDebounce(
    () => {
      const body: IRequestDtoShiftsFromTo = {
        userEmail: user.email,
        from: format(currentWeek.getPreviousWeek(), 'yyyy-MM-dd'),
        to: format(currentWeek.getNextWeek(), 'yyyy-MM-dd'),
      };
      shiftService.getShiftsManager(body).then(
        (shifts) => {
          if (shifts.length === 0) {
            setEvents([]);
            return;
          }
          const map: IShiftEvent[] = shifts.map((shift) => {
            if (!shift?.id) {
              return {} as IShiftEvent;
            }
            const employee = employees.find((emp) => emp.email === shift.emailEmployee);

            const event: IShiftEvent = {
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
      return () => {
        setEvents([]);
      };
    },
    1000,
    [currentWeek.value],
  );

  const createAction = (start: stringOrDate, end:stringOrDate) => {
    const selectedValue:ShiftFormFieldValue = {
      employeeId: -1,
      start: start as Date,
      end: end as Date,
    };

    const callback = (shift: IShift) => {
      const employee = employees.find((emp) => emp.email === shift.emailEmployee);

      if (!employee) {
        return;
      }

      closeDialog();
      const shiftEvent: IShiftEvent = {
        resourceId: shift.id,
        title: `${employee?.lastName} ${employee?.firstName}`,
        start: zonedTimeToUtc(shift.startTime, 'UTC'),
        end: zonedTimeToUtc(shift.endTime, 'UTC'),
        resource: {
          employeeId: employee.id,
        },
      };
      setEvents((currentEvents: IShiftEvent[]) => [...currentEvents.filter((eve) => eve.resourceId !== shift.id), shiftEvent]);
    };

    openDialog(
      <ShiftFormCreate
        shiftService={shiftService}
        employees={employees}
        closeDialog={closeDialog}
        selected={selectedValue}
        manager={user}
        callback={callback}
      />,
    );
  };

  const editAction = (selectedValue:ShiftFormFieldValue) => {
    const callbackDelete = () => {
      closeDialog();
      setEvents((current) => current.filter((shift) => shift.resourceId !== selectedValue.shiftId));
    };

    const callbackUpdate = (shift: IShift) => {
      const employee = employees.find((emp) => emp.id === selectedValue.employeeId);
      closeDialog();
      const shiftEvent: IShiftEvent = {
        resourceId: shift.id,
        title: `${employee?.lastName} ${employee?.firstName}`,
        start: zonedTimeToUtc(shift.startTime, 'UTC'),
        end: zonedTimeToUtc(shift.endTime, 'UTC'),
        resource: {
          employeeId: selectedValue.employeeId,
        },
      };
      setEvents((currentEvents: IShiftEvent[]) => [...currentEvents.filter((eve) => eve.resourceId !== shift.id), shiftEvent]);
    };

    openDialog(
      <ShiftFormEdit
        shiftService={shiftService}
        employees={employees}
        closeDialog={closeDialog}
        selected={selectedValue}
        manager={user}
        callbackDelete={callbackDelete}
        callbackUpdate={callbackUpdate}
      />,
    );
  };

  const deleteAction = () => {
    shiftService.deleteShift(contextMenu?.shiftEvent?.resourceId as number)
      .then(() => setEvents((current) => current.filter((shift) => shift.resourceId !== contextMenu?.shiftEvent?.resourceId)));
  };

  const onEventResize: withDragAndDropProps<IShiftEvent, ResourceType>['onEventResize'] = (data) => editAction({
    shiftId: data.event.resourceId,
    employeeId: data.event.resource.employeeId,
    start: data.start as Date,
    end: data.end as Date,
  });
  const onEventDrop: withDragAndDropProps<IShiftEvent, ResourceType>['onEventDrop'] = (data) => editAction({
    shiftId: data.event.resourceId,
    employeeId: data.event.resource.employeeId,
    start: data.start as Date,
    end: data.end as Date,
  });

  const handleSelect: CalendarProps['onSelectSlot'] = ({ start, end }: SlotInfo): void => {
    createAction(start, end);
  };

  const handleContextMenu = (event: React.MouseEvent, shiftEvent: IShiftEvent | null) => {
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
      <Container component={Paper} sx={{ padding: 4 }} maxWidth="lg">
        <DnDCalendar
          defaultView={Views.WEEK}
          defaultDate={startOfWeek(new Date())}
          views={[Views.WEEK, Views.WORK_WEEK]}
          events={events}
          localizer={localizer}
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
          onNavigate={(date, view, act) => {
            if (act === 'PREV') {
              currentWeek.previous();
            } else if (act === 'NEXT') {
              currentWeek.next();
            } else if (act === 'TODAY') {
              currentWeek.thisWeek();
            }
          }}
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

            return dayProp;
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
          onSelectEvent={(data) => editAction({
            shiftId: data.resourceId,
            employeeId: data.resource.employeeId,
            start: data.start as Date,
            end: data.end as Date,
          })}
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
              toolbar: ({ view, onView, onNavigate }) => (
                <ScheduleCalendarToolbar date={currentWeek.value} view={view} onView={onView} onNavigate={onNavigate} />
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
          if (!contextMenu?.shiftEvent) {
            return;
          }
          editAction({
            shiftId: contextMenu.shiftEvent.resourceId,
            employeeId: contextMenu.shiftEvent.resource.employeeId,
            start: contextMenu.shiftEvent.start as Date,
            end: contextMenu.shiftEvent.end as Date,
          });
          handleClose();
        }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (!contextMenu?.shiftEvent) {
            return;
          }
          editAction({
            shiftId: contextMenu.shiftEvent.resourceId,
            employeeId: contextMenu.shiftEvent.resource.employeeId,
            start: contextMenu.shiftEvent.start as Date,
            end: contextMenu.shiftEvent.end as Date,
          });
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
            deleteAction();
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
export default function ScheduleCalendarManager() {
  return (
    <ErrorBoundary>
      <ScheduleCalendar />
    </ErrorBoundary>
  );
}