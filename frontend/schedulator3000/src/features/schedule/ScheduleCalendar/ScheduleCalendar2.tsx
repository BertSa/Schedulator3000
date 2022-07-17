/* eslint-disable prefer-template */
import React, { ComponentType } from 'react';
import { Calendar, CalendarProps, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { isToday, startOfWeek } from 'date-fns';
import { Color, PaletteColor, useTheme } from '@mui/material';
import { preferences } from '../../../utilities/DateUtilities';
import { IShiftEvent } from '../../../models/IShiftEvent';
import { ResourceType } from './ScheduleCalendarManager';
import { IDragAndDropCalendarProps } from '../../../models/IDragAndDropCalendarProps';
import { OneOf } from '../../../models/OneOf';

type DefaultScheduleCalendarProps = OneOf<
CalendarProps<IShiftEvent, ResourceType>,
IDragAndDropCalendarProps<IShiftEvent, ResourceType>
> &
{ component: any };

function DefaultScheduleCalendar({ component: Cal, ...props }:DefaultScheduleCalendarProps) {
  const { palette: { text } } = useTheme();

  return (
    <Cal
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

const DnDCalendar = withDragAndDrop<IShiftEvent, ResourceType>(Calendar as ComponentType<CalendarProps<IShiftEvent, ResourceType>>);

export function DNDCalendar(props:IDragAndDropCalendarProps<IShiftEvent, ResourceType>) {
  return <DefaultScheduleCalendar {...props} component={DnDCalendar} />;
}

export function MyCalendar(props:CalendarProps<IShiftEvent, ResourceType>) {
  return <DefaultScheduleCalendar {...props} component={Calendar} />;
}

export function getDefaultDayProps(date: Date, secondary: PaletteColor, grey: Color) {
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
        backgroundColor: secondary.main + '99',
      },
    };
  }

  if (day === 0 || day === 6) {
    dayProp = {
      ...dayProp,
      style: {
        backgroundColor: grey['800'] + 'DD',
        ...dayProp.style,
      },
    };
  }

  return dayProp;
}
