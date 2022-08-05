export interface IAvailabilities {
  id: number;
  employeeEmail: string;
  startingDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  nbOfOccurrence: number;
  weekBetweenOccurrences: number;
  daysTheEventOccurre: boolean[];
}
