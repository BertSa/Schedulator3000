import React, { useCallback, useState } from 'react';
import { CalendarProps, Components, Event, SlotInfo, stringOrDate } from 'react-big-calendar';
import { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { format } from 'date-fns';
import { Container, Paper, useTheme } from '@mui/material';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Employee } from '../../../models/User';
import { useAuth } from '../../../contexts/AuthContext';
import { useDialog } from '../../../hooks/useDialog';
import { IShiftEvent } from '../models/IShiftEvent';
import { Nullable } from '../../../models/Nullable';
import { IShiftFormFieldValue } from '../ShiftForm/ShiftForm';
import ShiftFormCreate from '../ShiftForm/ShiftFormCreate';
import ShiftFormEdit from '../ShiftForm/ShiftFormEdit';
import useDebounce from '../../../hooks/useDebounce';
import { IShift } from '../models/IShift';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { localizer } from '../../../utilities/DateUtilities';
import ContextMenu from './ContextMenu';
import useNullableState from '../../../hooks/useNullableState';
import setNull from '../../../utilities/setNull';
import stringToHexColor from '../../../utilities/stringToHexColor';
import { DragAndDropBigCalendar, IResourceType } from '../lib/BigCalendar';
import getDefaultDayProps from './GetDefaultDayProps';
import useManagerService from '../../../hooks/use-services/useManagerService';
import useShiftService from '../../../hooks/use-services/useShiftService';
import useOnMount from '../../../hooks/useOnMount';
import useOnUnmount from '../../../hooks/useOnUnmount';
import { CurrentWeekContextProvider, useCurrentWeek } from '../contexts/CurrentWeekContext';
import ScheduleCalendarToolbar from './ScheduleCalendarToolbar';

export interface IContextMenuStates {
  mouseX: number;
  mouseY: number;
  shiftEvent: Nullable<IShiftEvent>;
}

function ScheduleCalendar() {
  const managerService = useManagerService();
  const shiftService = useShiftService();

  const manager = useAuth().getManager();
  const currentWeek = useCurrentWeek();
  const [openDialog, closeDialog] = useDialog();
  const { palette: { grey, secondary } } = useTheme();

  const [contextMenu, setContextMenu] = useNullableState<IContextMenuStates>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [events, setEvents] = useState<IShiftEvent[]>([]);

  const getShifts = useCallback((emps:Employee[]) => {
    shiftService.getShiftsManager({
      userEmail: manager.email,
      from: format(currentWeek.getPreviousWeek(), 'yyyy-MM-dd'),
      to: format(currentWeek.getNextWeek(), 'yyyy-MM-dd'),
    }).then(
      (shifts) => {
        setEvents(shifts.map((shift) => {
          const employee = emps.find((emp) => emp.email === shift.emailEmployee);

          return {
            resourceId: shift.id,
            title: `${employee?.lastName} ${employee?.firstName}`,
            start: zonedTimeToUtc(shift.startTime, 'UTC'),
            end: zonedTimeToUtc(shift.endTime, 'UTC'),
            resource: {
              employeeId: employee?.id,
            },
          } as IShiftEvent;
        }));
      });
  }, []);

  useOnUnmount(() => {
    setContextMenu(null);
    setEvents([]);
    setEmployees([]);
  });

  useOnMount(() => {
    managerService.getEmployees(manager.email)
      .then((emps) => {
        setEmployees(emps);
        getShifts(emps);
      });
  });

  useDebounce(
    () => { getShifts(employees); },
    1000,
    [currentWeek.value],
  );

  const createAction = (start: stringOrDate, end:stringOrDate) => {
    const selectedValue:IShiftFormFieldValue = {
      employeeId: -1,
      start: start as Date,
      end: end as Date,
    };

    const onFinish = (shift: IShift) => {
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
        employees={employees}
        closeDialog={closeDialog}
        selected={selectedValue}
        manager={manager}
        onFinish={onFinish}
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

  const onEventResize: withDragAndDropProps<IShiftEvent, IResourceType>['onEventResize'] = ({ event }) => editAction(event);
  const onEventDrop: withDragAndDropProps<IShiftEvent, IResourceType>['onEventDrop'] = ({ event }) => editAction(event);

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
        backgroundColor: stringToHexColor(fullName),
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

  const components: Components<IShiftEvent, IResourceType> = {
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
  };

  return (
    <>
      <Container component={Paper} sx={{ padding: 4 }} maxWidth="lg">
        <DragAndDropBigCalendar
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
          components={components}
        />
      </Container>
      <ContextMenu
        contextMenu={contextMenu}
        actions={{ editAction, deleteAction }}
        handleClose={handleClose}
      />
    </>
  );
}
export default function ScheduleCalendarManager() {
  return (
    <ErrorBoundary>
      <CurrentWeekContextProvider>
        <ScheduleCalendar />
      </CurrentWeekContextProvider>
    </ErrorBoundary>
  );
}
