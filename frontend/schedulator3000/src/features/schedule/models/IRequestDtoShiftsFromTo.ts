import { OneOf } from '../../../models/OneOf';

export interface IRequestDtoShiftsFromTo {
  userEmail: string;
  from: OneOf<Date, string>;
  to: OneOf<Date, string>;
}
