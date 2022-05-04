import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Employee, Manager } from '../models/User';
import { http } from './use-services/useServices';
import { PasswordChangeDto } from '../models/PasswordChange';
import NewEmployeePage from '../components/employee/NewEmployeePage';

interface ProviderAuth {
  updatePassword: (passwordChange: PasswordChangeDto) => Promise<void>;
  signUpManager: (manager: Manager) => Promise<void>;
  signInManager: (email: string, password: string) => Promise<void>;
  signInEmployee: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: () => boolean;
  isManager: () => boolean;
  isEmployee: () => boolean;
  getManager: () => Manager;
  getEmployee: () => Employee;
}

const authContext: React.Context<ProviderAuth> = createContext({} as ProviderAuth);

function useProvideAuth(): ProviderAuth {
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState<Manager | Employee | undefined>(() => {
    if (sessionStorage.length === 0) {
      return undefined;
    }

    const item: string | null = sessionStorage.getItem('user');
    if (item === null || item === 'undefined' || item === 'null') {
      return undefined;
    }

    const userParsed = JSON.parse(item) as Employee | Manager;
    const type = sessionStorage.getItem('type');

    if (type === Employee.prototype.constructor.name) {
      return Object.setPrototypeOf(userParsed, Employee.prototype);
    }
    if (type === Manager.prototype.constructor.name) {
      return Object.setPrototypeOf(userParsed, Manager.prototype);
    }
    return undefined;
  });

  const isAuthenticated = (): boolean => user !== undefined;
  const isManager = useCallback(() => user !== undefined && user instanceof Manager, [user]);
  const isEmployee = useCallback(() => user !== undefined && user instanceof Employee, [user]);

  useEffect(() => {
    sessionStorage.setItem('user', JSON.stringify(user));
    if (isEmployee()) {
      sessionStorage.setItem('type', Employee.prototype.constructor.name);
    } else if (isManager()) {
      sessionStorage.setItem('type', Manager.prototype.constructor.name);
    }
  }, [user, isManager, isEmployee]);

  const signUpManager = async (manager:Manager): Promise<void> => {
    const { response, body } = await http.post('/manager/signup', manager);

    if (response.ok) {
      setUser(Object.setPrototypeOf(body, Manager.prototype));
      enqueueSnackbar('You are connected!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      return Promise.resolve();
    }
    enqueueSnackbar(body.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });

    return Promise.reject(body.message);
  };

  const signIn = async (endpoint: string, prototype: Manager | Employee, email: string, password: string): Promise<void> => {
    const { response, body } = await http.post(`/${endpoint}/signin`, {
      email,
      password,
    });

    if (response.ok) {
      setUser(Object.setPrototypeOf(body, prototype));
      enqueueSnackbar('You are connected!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      return Promise.resolve();
    }
    enqueueSnackbar(body.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });

    return Promise.reject(body.message);
  };

  const signInManager = async (email: string, password: string): Promise<void> => signIn('manager', Manager.prototype, email, password);
  const signInEmployee = async (email: string, password: string): Promise<void> => signIn('employees', Employee.prototype, email, password);

  const signOut = (): void => {
    setUser(undefined);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('type');
    enqueueSnackbar('You are now disconnected.', {
      variant: 'default',
      autoHideDuration: 3000,
    });
  };

  const getManager = (): Manager => {
    if (isManager()) {
      return user as Manager;
    }
    throw new Error('You are not a manager!');
  };

  const getEmployee = (): Employee => {
    if (isEmployee()) {
      return user as Employee;
    }
    throw new Error('You are not an employee!');
  };

  const setActive = (): void => {
    if (isEmployee()) {
      setUser((prevState) => {
        const prevState1 = prevState as Employee;
        prevState1.active = true;
        return prevState1;
      });
    }
  };

  const updatePassword = async (passwordChange: PasswordChangeDto): Promise<void> => {
    if (!isAuthenticated()) {
      return Promise.reject();
    }

    const endpoint: string = isManager() ? 'manager' : 'employees';
    const data: PasswordChangeDto = {
      ...passwordChange,
      email: user?.email,
    };

    const { response, body } = await http.post(`/${endpoint}/password/update`, data);

    if (response.status === 200) {
      setActive();
      enqueueSnackbar('Password Updated!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      return Promise.resolve();
    }
    enqueueSnackbar(body.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });

    return Promise.reject(body.message);
  };

  return {
    updatePassword,
    signUpManager,
    signInManager,
    signInEmployee,
    signOut,
    isAuthenticated,
    isManager,
    isEmployee,
    getManager,
    getEmployee,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();
  return React.createElement(authContext.Provider, { value: auth }, children);
}

export const useAuth = () => useContext(authContext);

export function RequireAuth({ children }: PropsWithChildren<{}>): any {
  const auth = useAuth();

  if (auth.isAuthenticated()) {
    return children;
  }

  return null;
}

export function RequireAdmin({ children }: PropsWithChildren<{}>): any {
  const auth = useAuth();

  if (auth.isManager()) {
    return children;
  }

  return null;
}

export function RequireEmployee({ children }: PropsWithChildren<{}>): any {
  const auth = useAuth();

  if (auth.isEmployee()) {
    const employee = auth.getEmployee();
    if (employee?.active === null) {
      return React.createElement(NewEmployeePage);
    }
    return children;
  }

  return null;
}

export function RequireNoAuth({ children }: PropsWithChildren<{}>): any {
  const auth = useAuth();

  if (auth.isAuthenticated()) {
    return null;
  }

  return children;
}
