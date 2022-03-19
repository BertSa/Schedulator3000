export class User {
    public id: number;
    public email: string;
    public phone: string;
    public password?: string;

    constructor(id:number, email: string, phone: string, password?: string) {
        this.id = id;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }
}

export class Employee extends User {
    public firstName: string;
    public lastName: string;
    public role: string;
    public active?: boolean;

    constructor(id:number, email: string, phone: string,firstName: string, lastName: string, role: string, password?: string) {
        super(id, email, phone, password);
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }
}


export class Manager extends User {
    public employees: Employee[] = [];
}
