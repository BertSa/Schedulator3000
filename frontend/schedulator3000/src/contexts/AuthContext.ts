import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Employee, Manager } from '../models/User';
import { IPasswordChange, IPasswordChangeDto } from '../features/authentication/models/PasswordChange';
import { useSessionStorage } from '../hooks/useStorage';
import { Nullable } from '../models/Nullable';
import { OneOf } from '../models/OneOf';
import { NoParamFunction } from '../models/NoParamFunction';
import useNullableState from '../hooks/useNullableState';
import { request } from '../utilities/request';
import { ErrorType } from '../models/ErrorType';

type TypeOfUser = OneOf<'manager', 'employee'>;
type UserType = OneOf<Manager, Employee>;

interface ISessionStorageUser {
  type: TypeOfUser;
  user: UserType;
}

interface IProviderAuth {
  updatePassword: (passwordChange: IPasswordChange) => Promise<void>;
  signUpManager: (manager: Manager) => Promise<void>;
  signInManager: (email: string, password: string) => Promise<void>;
  signInEmployee: (email: string, password: string) => Promise<void>;
  signOut: VoidFunction;
  isAuthenticated: NoParamFunction<boolean>;
  isManager: NoParamFunction<boolean>;
  isEmployee: NoParamFunction<boolean>;
  isNewEmployee: NoParamFunction<boolean>;
  getManager: NoParamFunction<Manager>;
  getEmployee: NoParamFunction<Employee>;
}

const authContext: React.Context<IProviderAuth> = createContext<IProviderAuth>({} as IProviderAuth);

function useProvideAuth(): IProviderAuth {
  const { enqueueSnackbar } = useSnackbar();
  const [sessionStorageUser, setSessionStorageUser, removeSessionStorageUser] = useSessionStorage<Nullable<ISessionStorageUser>>('user', null);
  const [userType, setUserType] = useNullableState<TypeOfUser>(sessionStorageUser?.type);
  const [user, setUser] = useNullableState<UserType>(sessionStorageUser?.user);

  const isAuthenticated = useCallback(() => Boolean(user && userType), [user, userType]);
  const isManager = useCallback(() => isAuthenticated() && userType === 'manager', [user, userType]);
  const isEmployee = useCallback(() => isAuthenticated() && userType === 'employee', [user, userType]);

  useEffect(() => {
    setUser(sessionStorageUser?.user ?? null);
    setUserType(sessionStorageUser?.type ?? null);

    return () => {
      setUser(null);
      setUserType(null);
    };
  }, [sessionStorageUser]);

  useEffect(() => {
    if (user && userType) {
      setSessionStorageUser({ type: userType, user });
    } else {
      removeSessionStorageUser();
    }
    return () => {
    };
  }, [user, userType]);

  const signUpManager = async (manager:Manager): Promise<void> => {
    const result = await request<Manager, ErrorType>(
      {
        method: 'POST',
        url: '/manager/signup',
        body: manager,
      },
    );

    if (result.ok) {
      setUser(result.data);
      setUserType('manager');
      enqueueSnackbar('You are connected!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      return Promise.resolve();
    }
    enqueueSnackbar(result.errorData.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });

    return Promise.reject(result.errorData.message);
  };

  const signIn = async <T extends UserType>(
    endpoint: string,
    type: TypeOfUser,
    body:{ email: string, password: string },
  ): Promise<void> => {
    const result = await request<T, ErrorType>(
      {
        method: 'POST',
        url: `/${endpoint}/signin`,
        body,
      },
    );

    if (result.ok) {
      setUser(result.data);
      setUserType(type);
      enqueueSnackbar('You are connected!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      return Promise.resolve();
    }
    enqueueSnackbar(result.errorData.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });

    return Promise.reject(result.errorData.message);
  };

  const signInManager = async (email: string, password: string): Promise<void> => signIn<Manager>('manager', 'manager', {
    email,
    password,
  });
  const signInEmployee = async (email: string, password: string): Promise<void> => signIn<Employee>('employees', 'employee', {
    email,
    password,
  });

  const signOut = (): void => {
    setUser(null);
    setUserType(null);
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

  const isNewEmployee = useCallback(() => isEmployee() && getEmployee().active === null, [user]);

  const updatePassword = async (passwordChange: IPasswordChange): Promise<void> => {
    if (!isAuthenticated()) {
      return Promise.reject();
    }

    const endpoint: string = isManager() ? 'manager' : 'employees';

    const body: IPasswordChangeDto = {
      ...passwordChange,
      email: user!.email,
    };

    const result = await request<Employee, ErrorType>(
      {
        method: 'POST',
        url: `/${endpoint}/password/update`,
        body,
      },
    );

    if (result.ok) {
      setUser(result.data);
      setUserType('employee');
      enqueueSnackbar('Password Updated!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      return Promise.resolve();
    }
    enqueueSnackbar(result.errorData.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });

    return Promise.reject(result.errorData.message);
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
    isNewEmployee,
    getManager,
    getEmployee,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();
  return React.createElement(authContext.Provider, { value: auth }, children);
}

export const useAuth = () => useContext(authContext);
