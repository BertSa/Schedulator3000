export class User {
    private readonly _id: number;
    private readonly _email: string;
    private readonly _phone: string;
    private readonly _password: string;

    constructor(id: number, email: string, phone: string, password: string) {
        this._id = id;
        this._email = email;
        this._phone = phone;
        this._password = password;
    }


    get id(): number {
        return this._id;
    }

    get email(): string {
        return this._email ?? '';
    }

    get phone(): string {
        return this._phone ?? '';
    }

    get password(): string {
        return this._password ?? '';
    }
}

export class Employee extends User {
    private readonly _firstName: string;
    private readonly _lastName: string;
    private readonly _role: string;
    private _active: boolean | null = null;

    constructor(id: number, email: string, phone: string, firstName: string, lastName: string, role: string, password: string = '', active: boolean | null = null) {
        super(id, email, phone, password);
        this._firstName = firstName;
        this._lastName = lastName;
        this._role = role;
        this._active = active;
    }


    get firstName(): string {
        return this._firstName;
    }

    get lastName(): string {
        return this._lastName;
    }

    get role(): string {
        return this._role;
    }

    set active(value: boolean | null) {
        this._active = value;
    }

    get active(): boolean | null {
        return this._active;
    }
}

export class Manager extends User {
}


export type EmployeeRegister = Omit<Employee, 'id' | 'active' | 'password'>
