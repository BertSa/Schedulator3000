export class User {
    id: number;
    email: string;
    phone: string;
    password?: string;

    constructor(id: number, email: string, phone: string, password?: string) {
        this.id = id;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }
}

export class Employee extends User {
    firstName: string;
    lastName: string;
    role: string;
    active?: boolean | null;

    constructor(id: number, email: string, phone: string, firstName: string, lastName: string, role: string, password?: string, active?: boolean | null) {
        super(id, email, phone, password);
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.active = active;
    }
}

export class Manager extends User {
}
