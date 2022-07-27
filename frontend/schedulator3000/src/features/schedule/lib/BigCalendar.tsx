import React from 'react';
import { Calendar, CalendarProps, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { useTheme } from '@mui/material';
import { startOfWeek } from 'date-fns';
import { preferences } from '../../../utilities/DateUtilities';
import { IShiftEvent } from '../models/IShiftEvent';

export interface IResourceType {
  employeeId: number,
}

export function BigCalendar(props: CalendarProps<IShiftEvent, IResourceType>) {
  const { palette: { text } } = useTheme();

  return (
    <Calendar
      {...props}
      defaultView={Views.WEEK}
      defaultDate={startOfWeek(new Date())}
      views={[Views.WEEK, Views.WORK_WEEK]}
      toolbar={preferences.calendar.toolbar}
      step={preferences.calendar.step}
      timeslots={preferences.calendar.timeslots}
      scrollToTime={preferences.calendar.scrollToTime}
      min={new Date('2022-03-19T04:00:00.000Z')}
      max={new Date('2022-03-20T03:59:00.000Z')}
      allDayAccessor="allDay"
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
    />
  );
}

export const DragAndDropBigCalendar = withDragAndDrop<IShiftEvent, IResourceType>((props) => <BigCalendar {...props} />);
