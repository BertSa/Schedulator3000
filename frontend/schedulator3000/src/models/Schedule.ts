import {Shift} from './Shift';

export class Schedule {
  id: number;
  startDate: Date;
  shifts: Shift[];

  constructor(id: number, startDate: Date, shifts: Shift[]) {
    this.id = id;
    this.startDate = startDate;
    this.shifts = shifts;
  }
}
