import { stringOrDate } from 'react-big-calendar';

export interface AvailabilityDto {
  id: number;
  start: stringOrDate;
  end: stringOrDate;
}
