import React, { useEffect, useState } from 'react';
import { CalendarProps, Event, SlotInfo, stringOrDate } from 'react-big-calendar';
import { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { format } from 'date-fns';
import { Container, Paper, useTheme } from '@mui/material';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Employee } from '../../../../models/User';
import { useAuth } from '../../../../contexts/AuthContext';
import { setNull, stringToColor } from '../../../../utilities/utilities';
import { useDialog } from '../../../../hooks/useDialog';
import { useServices } from '../../../../hooks/use-services/useServices';
import { IRequestDtoShiftsFromTo } from '../../../../models/IRequestDtoShiftsFromTo';
import { IShiftEvent } from '../../../../models/IShiftEvent';
import ScheduleCalendarToolbar from './ScheduleCalendarToolbar';
import useCurrentWeek from '../../../../hooks/useCurrentWeek';
import { Nullable } from '../../../../models/Nullable';
import { IShiftFormFieldValue } from '../ShiftForm/ShiftForm';
import ShiftFormCreate from '../ShiftForm/ShiftFormCreate';
import ShiftFormEdit from '../ShiftForm/ShiftFormEdit';
import useDebounce from '../../../../hooks/useDebounce';
import { IShift } from '../../../../models/IShift';
import ErrorBoundary from '../../../shared/ErrorBoundary';
import { DNDCalendar, getDefaultDayProps } from './ScheduleCalendar2';
import { localizer } from '../../../../utilities/DateUtilities';
import ContextMenu from './ContextMenu';
import useNullableState from '../../../../hooks/useNullableState';

export type ResourceType = {
  employeeId: number,
};

export interface IContextMenuStates {
  mouseX: number;
  mouseY: number;
  shiftEvent: IShiftEvent | null;
}

function ScheduleCalendar() {
  const currentWeek = useCurrentWeek();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [events, setEvents] = useState<IShiftEvent[]>([]);
  const [openDialog, closeDialog] = useDialog();
  const [contextMenu, setContextMenu] = useNullableState<IContextMenuStates>();
  const { managerService, shiftService } = useServices();
  const { palette: { grey, secondary } } = useTheme();
  const manager = useAuth().getManager();

  useEffect(() => {
    const body: IRequestDtoShiftsFromTo = {
      userEmail: manager.email,
      from: format(currentWeek.getPreviousWeek(), 'yyyy-MM-dd'),
      to: format(currentWeek.getNextWeek(), 'yyyy-MM-dd'),
    };
    managerService.getEmployees(manager.email ?? '').then(
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
  }, [manager.email]);

  useDebounce(
    () => {
      const body: IRequestDtoShiftsFromTo = {
        userEmail: manager.email,
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
    const selectedValue:IShiftFormFieldValue = {
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
        manager={manager}
        callback={callback}
      />,
    );
  };

  const editAction = (data:IShiftEvent) => {
    const selectedValue = {
      shiftId: data.resourceId,
      employeeId: data.resource.employeeId,
      start: data.start as Date,
      end: data.end as Date,
    };

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
        manager={manager}
        callbackDelete={callbackDelete}
        callbackUpdate={callbackUpdate}
      />,
    );
  };

  const deleteAction = () => {
    const id:number = contextMenu?.shiftEvent?.resourceId as number;
    shiftService.deleteShift(id)
      .then(() => setEvents((current) => current.filter((shift) => shift.resourceId !== id)));
  };

  const onEventResize: withDragAndDropProps<IShiftEvent, ResourceType>['onEventResize'] = ({ event }) => editAction(event);
  const onEventDrop: withDragAndDropProps<IShiftEvent, ResourceType>['onEventDrop'] = ({ event }) => editAction(event);

  const handleSelect: CalendarProps['onSelectSlot'] = ({ start, end }: SlotInfo): void => createAction(start, end);
  const handleContextMenu = (event: React.MouseEvent, shiftEvent: Nullable<IShiftEvent>) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
          shiftEvent,
        }
        : null,
    );
  };
  const handleClose = setNull(setContextMenu);

  const eventPropGetter = (event: Event) => {
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
  };

  return (
    <>
      <Container component={Paper} sx={{ padding: 4 }} maxWidth="lg">
        <DNDCalendar
          events={events}
          localizer={localizer}
          showMultiDayTimes
          popup
          resizable
          selectable="ignoreEvents"
          startAccessor={(event: Event) => new Date(event.start as Date)}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          onSelectEvent={editAction}
          onSelectSlot={handleSelect}
          onNavigate={(date, view, act) => currentWeek.onNavigate(act)}
          dayPropGetter={(date) => getDefaultDayProps(date, secondary, grey)}
          eventPropGetter={eventPropGetter}
          components={{
            toolbar: ({ view, onView, onNavigate }) => (
              <ScheduleCalendarToolbar date={currentWeek.value} view={view} onView={onView} onNavigate={onNavigate} />
            ),
            eventWrapper: ({ event, children }) => (
              <div onContextMenu={(e) => handleContextMenu(e, event)}>
                {children}
              </div>
            ),
            timeSlotWrapper: ({ children }) => React.cloneElement(children as any, {
              onContextMenu: (e: any) => handleContextMenu(e, null),
            }),
          }}
        />
      </Container>
      <ContextMenu contextMenu={contextMenu} actions={{ editAction, deleteAction }} handleClose={handleClose} />
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
