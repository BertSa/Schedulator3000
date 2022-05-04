import { Nullable } from './Nullable';

export interface IAvailabilityDay {
  start: Nullable<Date>;
  end: Nullable<Date>;
}

export interface IAvailabilities {
  id: number;
  lastModified: Date;
  sunday: IAvailabilityDay;
  monday: IAvailabilityDay;
  tuesday: IAvailabilityDay;
  wednesday: IAvailabilityDay;
  thursday: IAvailabilityDay;
  friday: IAvailabilityDay;
  saturday: IAvailabilityDay;
}
