import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Employee, Manager } from '../models/User';
import { http } from './use-services/useServices';
import { PasswordChangeDto } from '../models/PasswordChange';
import NewEmployeePage from '../components/employee/NewEmployeePage';
import { useSessionStorage } from './useStorage';
import { Nullable } from '../models/Nullable';

interface SessionStorageUser {
  type: 'employee' | 'manager';
  user: Employee | Manager;
}

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
  const [sessionStorageUser, setSessionStorageUser, removeSessionStorageUser] = useSessionStorage<Nullable<SessionStorageUser>>('user', null);
  const [user, setUser] = useState<Nullable<Manager | Employee>>(() => {
    if (sessionStorageUser) {
      if (sessionStorageUser.type === 'manager') {
        return Object.setPrototypeOf(sessionStorageUser.user, Manager.prototype);
      }
      if (sessionStorageUser.type === 'employee') {
        return Object.setPrototypeOf(sessionStorageUser.user, Employee.prototype);
      }
    }
    return null;
  });

  const isAuthenticated = (): boolean => !!user;
  const isManager = useCallback(() => !!user && user instanceof Manager, [user]);
  const isEmployee = useCallback(() => !!user && user instanceof Employee, [user]);

  useEffect(() => {
    if (user) {
      setSessionStorageUser({ type: isManager() ? 'manager' : 'employee', user });
    } else {
      removeSessionStorageUser();
    }
    return () => {

    };
  }, [user, setSessionStorageUser, removeSessionStorageUser]);

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
    setUser(null);
    removeSessionStorageUser();
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
      setUser(Object.setPrototypeOf(body, Employee.prototype));
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
