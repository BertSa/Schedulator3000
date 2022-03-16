export class Shift {
    public id: number;
    public startTime: Date;
    public endTime: Date;
    public idEmployee: number;

    constructor(id: number, startTime: Date, endTime: Date, idEmployee: number) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.idEmployee = idEmployee;
    }
}
