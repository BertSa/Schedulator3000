import { CalendarProps, Event } from 'react-big-calendar';
import { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';

export interface IDragAndDropCalendarProps<TEvent extends object = Event, TResource extends object = object>
  extends CalendarProps<TEvent, TResource>, withDragAndDropProps<TEvent, TResource> {
}
