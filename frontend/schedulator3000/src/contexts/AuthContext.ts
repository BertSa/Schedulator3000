import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Employee, Manager } from '../models/User';
import { http } from '../hooks/use-services/useServices';
import { IPasswordChangeDto } from '../features/authentication/models/PasswordChange';
import { useSessionStorage } from '../hooks/useStorage';
import { Nullable } from '../models/Nullable';
import { OneOf } from '../models/OneOf';
import { NoParamFunction } from '../models/NoParamFunction';
import useNullableState from '../hooks/useNullableState';

type TypeOfUser = OneOf<'manager', 'employee'>;
type UserType = OneOf<Manager, Employee>;

interface ISessionStorageUser {
  type: TypeOfUser;
  user: UserType;
}

interface IProviderAuth {
  updatePassword: (passwordChange: IPasswordChangeDto) => Promise<void>;
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
    if (user) {
      setSessionStorageUser({ type: isManager() ? 'manager' : 'employee', user });
    } else {
      removeSessionStorageUser();
    }
    return () => {
    };
  }, [user]);

  const signUpManager = async (manager:Manager): Promise<void> => {
    const { response, body } = await http.post('/manager/signup', manager);

    if (response.ok) {
      setUser(body);
      setUserType('manager');
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

  const signIn = async (endpoint: string, type: TypeOfUser, email: string, password: string): Promise<void> => {
    const { response, body } = await http.post(`/${endpoint}/signin`, {
      email,
      password,
    });

    if (response.ok) {
      setUser(type === 'manager' ? body as Manager : body as Employee);
      setUserType(type);
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

  const signInManager = async (email: string, password: string): Promise<void> => signIn('manager', 'manager', email, password);
  const signInEmployee = async (email: string, password: string): Promise<void> => signIn('employees', 'employee', email, password);

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

  const updatePassword = async (passwordChange: IPasswordChangeDto): Promise<void> => {
    if (!isAuthenticated()) {
      return Promise.reject();
    }

    const endpoint: string = isManager() ? 'manager' : 'employees';
    const data: IPasswordChangeDto = {
      ...passwordChange,
      email: user?.email,
    };

    const { response, body } = await http.post(`/${endpoint}/password/update`, data);

    if (response.status === 200) {
      setUser(body);
      setUserType('employee');
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
