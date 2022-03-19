export class Shift {
    public id?: number;
    public startTime: Date;
    public endTime: Date;
    public emailEmployee: string;
    public emailManager: string;

    constructor(id: number, startTime: Date, endTime: Date, emailEmployee: string, emailManager:string) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.emailEmployee = emailEmployee;
        this.emailManager = emailManager;
    }
}
