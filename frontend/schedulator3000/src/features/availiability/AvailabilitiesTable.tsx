import { Container } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { CalendarProps, Event } from 'react-big-calendar';
import { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { addWeeks, format, parseISO } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { useDialog } from '../../hooks/useDialog';
import { localizer } from '../../utilities/DateUtilities';
import AvailabilityForm, { IAvailabilityFormFieldValue } from './AvailabilityForm';
import { IAvailability } from './models/IAvailability';
import useAvailabilitiesService from '../schedule/hooks/useAvailabilitiesService';
import useAsync from '../../hooks/useAsync';
import { DragAndDropBigCalendar, IResourceType } from '../schedule/lib/BigCalendar';
import { IShiftEvent } from '../schedule/models/IShiftEvent';
import { useCurrentWeek } from '../schedule/contexts/CurrentWeekContext';
import { IAvailabilityDto } from './models/IAvailabilityDto';
import { StringOrDate } from '../../models/StringOrDate';

type DndCalProps = withDragAndDropProps<IShiftEvent, IResourceType>;
type CalProps = CalendarProps<IShiftEvent, IResourceType>;
type UnChangedProps = Omit<IAvailability, 'daysTheEventOccur' | 'endTime' | 'startTime' | 'nbOfOccurrence'>;

const defaultBoolArray = new Array(7).fill(false);

function useAvailabilities() {
  const availabilitiesService = useAvailabilitiesService();
  const currentWeek = useCurrentWeek();
  const employee = useAuth().getEmployee();

  const [value, setValue] = useState<IAvailabilityDto[]>([]);

  const update = useCallback(() =>
    availabilitiesService.getByEmployeeEmail(
      {
        userEmail: employee.email,
        from: format(currentWeek.getPreviousWeek(), 'yyyy-MM-dd'),
        to: format(addWeeks(currentWeek.value, 2), 'yyyy-MM-dd'),
      })
      .then(setValue), []);

  useAsync(update, []);

  return {
    value,
    update,
  };
}

export default function AvailabilitiesTable() {
  const availabilitiesService = useAvailabilitiesService();
  const employee = useAuth().getEmployee();
  const [openDialog, closeDialog] = useDialog();
  const availabilities = useAvailabilities();

  const events = useMemo<IShiftEvent[]>(() =>
    availabilities.value.map((value) => ({
      resourceId: value.id,
      start: parseISO(value.start as string),
      end: parseISO(value.end as string),
      title: '',
    })),
  [availabilities],
  );

  const buildNewAvailability = (data:IAvailabilityFormFieldValue, unChangedProps: UnChangedProps): IAvailability => {
    const { daysOfWeek, startTime, endTime, nbOfOccurrence } = data;

    const daysTheEventOccur = [...defaultBoolArray];
    daysOfWeek.forEach((value) => { daysTheEventOccur[value] = true; });
    daysTheEventOccur.unshift(daysTheEventOccur.pop());

    return {
      ...unChangedProps,
      daysTheEventOccur,
      startTime: startTime.toTimeString().slice(0, 9),
      endTime: endTime.toTimeString().slice(0, 9),
      nbOfOccurrence: Number(nbOfOccurrence),
    };
  };

  const createAction = (start: StringOrDate, end: StringOrDate) => {
    const date = format(start as Date, 'yyyy-MM-dd');
    const unChangedProps = {
      id: -1,
      employeeEmail: employee.email,
      startingDate: date,
      endDate: date,
      weekBetweenOccurrences: 1,
    };

    const newAvailability:IAvailability = {
      ...unChangedProps,
      daysTheEventOccur: [],
      startTime: start as string,
      endTime: end as string,
      nbOfOccurrence: 1,
    };

    const submit : SubmitHandler<IAvailabilityFormFieldValue> = (data) => {
      const returnIng = buildNewAvailability(data, unChangedProps);
      availabilitiesService.create(returnIng).then(availabilities.update);
      closeDialog();
    };

    openDialog(
      <AvailabilityForm
        onClose={closeDialog}
        submit={submit}
        availability={newAvailability}
      />,
    );
  };

  const editAction = async (resourceId: number, start: StringOrDate, end: StringOrDate) => {
    const availability = await availabilitiesService.getById(resourceId);
    const newAvailability: IAvailability = {
      ...availability,
      startTime: start as string,
      endTime: end as string,
    };

    const submit : SubmitHandler<IAvailabilityFormFieldValue> = (data) => {
      const returnIng = buildNewAvailability(data, availability);
      availabilitiesService.update(resourceId, returnIng).then(availabilities.update);
      closeDialog();
    };

    openDialog(
      <AvailabilityForm
        onClose={closeDialog}
        submit={submit}
        availability={newAvailability}
      />,
    );
  };

  const onEventResize: DndCalProps['onEventResize'] = ({ event: { resourceId, start, end } }) => editAction(resourceId, start!, end!);
  const onEventDrop: DndCalProps['onEventDrop'] = ({ event: { resourceId, start, end } }) => editAction(resourceId, start!, end!);
  const onSelectEvent: CalProps['onSelectEvent'] = ({ resourceId, start, end }) => editAction(resourceId, start!, end!);
  const onSelectSlot: CalProps['onSelectSlot'] = ({ start, end }) => createAction(start, end);

  return (
    <Container maxWidth="lg">
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
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        // onNavigate={(date, view, act) => currentWeek.onNavigate(act)}
        // dayPropGetter={(date) => getDefaultDayProps(date, secondary, grey)}
        // eventPropGetter={eventPropGetter}
        // components={components}
      />
    </Container>
  );
}
