import { OneOf } from './OneOf';

export interface IRequestDtoShiftsFromTo {
  userEmail: string;
  from: OneOf<Date, string>;
  to: OneOf<Date, string>;
}
