export interface Shift {
    id: number;
    startTime: Date;
    endTime: Date;
    emailEmployee: string;
    emailManager: string;
}

export type ShiftWithoutId = Omit<Shift, 'id'>;

export interface ShiftFormUpdate {
    id: number;
    startTime: Date;
    endTime: Date;
    employeeId: number;
}
