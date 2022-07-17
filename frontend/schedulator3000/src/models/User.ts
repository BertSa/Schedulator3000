import { Nullable } from './Nullable';

export interface User {
  id: number,
  email: string,
  phone: string,
  password: string,
}

export interface Employee extends User {
  firstName: string,
  lastName: string,
  role: string,
  active: Nullable<boolean>,
}

export interface Manager extends User {
  companyName: string;
}

export type EmployeeFormType = Omit<Employee, 'id' | 'active' | 'password'>;
