import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { CalendarProps, Event, SlotInfo } from 'react-big-calendar';
import { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { addWeeks, format, parseISO } from 'date-fns';
import { Nullable } from '../../models/Nullable';
import { useAuth } from '../../contexts/AuthContext';
import { useDialog } from '../../hooks/useDialog';
import { AvailabilityDay } from './models/AvailabilityDay';
import { localizer } from '../../utilities/DateUtilities';
import AvailabilityForm, { IAvailabilityFormFieldValue } from './AvailabilityForm';
import { IAvailabilities } from './models/IAvailabilities';
import useAvailabilitiesService from '../../hooks/use-services/useAvailabilitiesService';
import useAsync from '../../hooks/useAsync';
import { DragAndDropBigCalendar, IResourceType } from '../schedule/lib/BigCalendar';
import { IShiftEvent } from '../schedule/models/IShiftEvent';
import useArray from '../../hooks/useArray';
import { KeyOf } from '../../models/KeyOf';
import { useCurrentWeek } from '../schedule/contexts/CurrentWeekContext';
import { OneOf } from '../../models/OneOf';

export interface SelectedAvailabilityTableCell {
  day:number,
  availability:Nullable<AvailabilityDay>,
}
export default function AvailabilitiesTable() {
  const availabilities = useArray<IAvailabilities, KeyOf<IAvailabilities>>('id');
  const availabilitiesService = useAvailabilitiesService();
  const [openDialog, closeDialog] = useDialog();
  const [events, setEvents] = useState<any[]>([]);
  const currentWeek = useCurrentWeek();

  const employee = useAuth().getEmployee();

  useEffect(() => {
    const events1 = availabilities.value.map((value) => {
      value.
    });

    setEvents(events1);

    console.table({ ...availabilities.value });
    console.table({ ...events1 });
  }, [availabilities.value]);

  useAsync(
    () =>
      availabilitiesService.getByEmployeeEmail(
        {
          userEmail: employee.email,
          from: format(currentWeek.getPreviousWeek(), 'yyyy-MM-dd'),
          to: format(addWeeks(currentWeek.value, 2), 'yyyy-MM-dd'),
        })
        .then(availabilities.setValue),
    [],
  );

  const createAction = (start: OneOf<Date, string>, end: OneOf<Date, string>) => {
    const s = start as Date;

    const unChangedProps = {
      id: -1,
      employeeEmail: employee.email,
      startingDate: format(s, 'yyyy-MM-dd'),
      endDate: format(s, 'yyyy-MM-dd'),
      weekBetweenOccurrences: 0,
    };

    const av:IAvailabilities = {
      ...unChangedProps,
      daysTheEventOccurre: [],
      startTime: start as string,
      endTime: end as string,
      nbOfOccurrence: 1,
    };

    const submit : SubmitHandler<IAvailabilityFormFieldValue> = (data) => {
      const { daysOfWeek, startTime, endTime, nbOfOccurrence } = data;

      let daysTheEventOccurre = new Array(7).fill(false);
      daysOfWeek.forEach((value) => {
        daysTheEventOccurre[value] = true;
      });
      const pop = daysTheEventOccurre.pop();
      daysTheEventOccurre = [pop, ...daysTheEventOccurre];

      const returnIng: IAvailabilities = {
        ...unChangedProps,
        daysTheEventOccurre,
        startTime: startTime.toTimeString().slice(0, 9),
        endTime: endTime.toTimeString().slice(0, 9),
        nbOfOccurrence: Number(nbOfOccurrence),
      };

      availabilitiesService.create(returnIng).then(availabilities.add);
      closeDialog();
    };

    openDialog(
      <AvailabilityForm
        onClose={closeDialog}
        submit={submit}
        availability={av}
      />,
    );
  };

  const editAction = (resourceId: number, start: OneOf<Date, string>, end: OneOf<Date, string>) => {
    const availability = availabilities.getBy('id', resourceId);

    if (!availability) {
      return;
    }

    const newAvai: IAvailabilities = {
      ...availability,
      startTime: start as string,
      endTime: end as string,
    };

    const submit : SubmitHandler<IAvailabilityFormFieldValue> = (data) => {
      const { daysOfWeek, startTime, endTime, nbOfOccurrence } = data;

      let daysTheEventOccurre = new Array(7).fill(false);
      daysOfWeek.forEach((value) => {
        daysTheEventOccurre[value] = true;
      });
      const pop = daysTheEventOccurre.pop();
      daysTheEventOccurre = [pop, ...daysTheEventOccurre];

      const returnIng: IAvailabilities = {
        ...availability,
        daysTheEventOccurre,
        startTime: startTime.toTimeString().slice(0, 9),
        endTime: endTime.toTimeString().slice(0, 9),
        nbOfOccurrence: Number(nbOfOccurrence),
      };
      availabilitiesService.update(resourceId, returnIng).then(availabilities.update);
      closeDialog();
    };

    openDialog(
      <AvailabilityForm
        onClose={closeDialog}
        submit={submit}
        availability={newAvai}
      />,
    );
  };

  const onEventResize: withDragAndDropProps<IShiftEvent, IResourceType>['onEventResize'] = ({ event: { resourceId, start, end } }) => editAction(resourceId, start as Date, end as Date);
  const onEventDrop: withDragAndDropProps<IShiftEvent, IResourceType>['onEventDrop'] = ({ event: { resourceId, start, end } }) => editAction(resourceId, start as Date, end as Date);
  const onSelectEvent: CalendarProps<IShiftEvent, IResourceType>['onSelectEvent'] = ({ resourceId, start, end }) => editAction(resourceId, start as Date, end as Date);
  // eslint-disable-next-line @typescript-eslint/no-shadow,no-unused-vars,@typescript-eslint/no-unused-vars,no-shadow
  const handleSelect: CalendarProps['onSelectSlot'] = ({ start, end }: SlotInfo): void => createAction(start, end);

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
        onSelectSlot={handleSelect}
        // onNavigate={(date, view, act) => currentWeek.onNavigate(act)}
        // dayPropGetter={(date) => getDefaultDayProps(date, secondary, grey)}
        // eventPropGetter={eventPropGetter}
        // components={components}

      />
    </Container>
  );
}
