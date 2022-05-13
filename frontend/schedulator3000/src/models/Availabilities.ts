import { Nullable } from './Nullable';

export type AvailabilityDay = Nullable< {
  start: Date,
  end: Date,
}>;

export interface IAvailabilities {
  id: number;
  lastModified: Date;
  sunday: AvailabilityDay;
  monday: AvailabilityDay;
  tuesday: AvailabilityDay;
  wednesday: AvailabilityDay;
  thursday: AvailabilityDay;
  friday: AvailabilityDay;
  saturday: AvailabilityDay;
}
