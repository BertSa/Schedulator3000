export class User {
    public id?: number | undefined;
    public email: string;
    public phone: string;
    public password?: string;

    constructor(email: string, phone: string, password?: string) {
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

    constructor(email: string, phone: string,firstName: string, lastName: string, role: string, password?: string) {
        super(email, phone, password);
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }
}


export class Manager extends User {
    public employees: Employee[] = [];
}
