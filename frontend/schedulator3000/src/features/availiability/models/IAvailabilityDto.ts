import { StringOrDate } from '../../../models/StringOrDate';

export interface IAvailabilityDto {
  id: number;
  start: StringOrDate;
  end: StringOrDate;
}
