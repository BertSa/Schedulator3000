import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {Employee, Manager, User} from '../models/User';
import {useSnackbar} from 'notistack';
import {METHODS, requestInit} from './use-services';
import {PasswordChangeDto} from '../models/PasswordChangeDto';
import {NewEmployeePage} from '../components/NewEmployeePage';
import {useHistory} from 'react-router-dom';

const authContext: React.Context<IProviderAuth> = createContext({} as IProviderAuth);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const auth = useProvideAuth();
    return React.createElement(authContext.Provider, {value: auth}, children);
}

export const useAuth = () => useContext(authContext);

export function RequireAuth({children}: { children: React.ReactNode }): any {
    const auth = useAuth();

    if (auth.isAuthenticated()) {
        return children;
    }

    return null;
}

export function RequireAdmin({children}: { children: React.ReactNode }): any {
    const auth = useAuth();

    if (auth.isManager()) {
        return children;
    }

    return null;
}

export function RequireEmployee({children}: { children: React.ReactNode }): any {
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

export function RequireNoAuth({children}: { children: React.ReactNode }): any {
    let auth = useAuth();

    if (auth.isAuthenticated()) {
        return null;
    }

    return children;
}

function useProvideAuth(): IProviderAuth {
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const [user, setUser] = useState<Manager | Employee | undefined>(() => {
        if (sessionStorage.length === 0) {
            return undefined;
        }

        let item: any = sessionStorage.getItem('user');
        if (item === typeof undefined || item === typeof null) {
            return undefined;
        }

        let userParsed = JSON.parse(item) as Employee | Manager;
        let type = sessionStorage.getItem('type');

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

    const signInManager = async (email: string, password: string): Promise<boolean> => {
        return signIn('manager', Manager.prototype, email, password);
    };

    const signInEmployee = async (email: string, password: string): Promise<boolean> => {
        return signIn('employee', Employee.prototype, email, password);
    };


    const signIn = async (endpoint: string, prototype: any, email: string, password: string): Promise<boolean> => {
        return await fetch(`/${endpoint}/signin`, requestInit(METHODS.POST, {email: email, password: password})).then(
            response => {
                return response.json().then(
                    body => {
                        if (response.status === 200) {
                            setUser(Object.setPrototypeOf(body, prototype));
                            enqueueSnackbar('You are connected!', {
                                variant: 'success',
                                autoHideDuration: 3000
                            });
                            return true;
                        }
                        if (response.status === 400) {
                            enqueueSnackbar(body.message, {
                                variant: 'error',
                                autoHideDuration: 3000
                            });
                        }
                        return false;
                    }
                );
            }
        );
    };

    const signOut = (): void => {
        setUser(undefined);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('type');
        enqueueSnackbar('You are now disconnected.', {
            variant: 'default',
            autoHideDuration: 3000
        });
        history.push('/');
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

    const updatePassword = async (passwordChange: PasswordChangeDto): Promise<boolean> => {
        let endpoint: string;
        let prototype: User;

        if (isManager()) {
            endpoint = 'manager';
            prototype = Manager.prototype;
        } else if (isEmployee()) {
            endpoint = 'employee';
            prototype = Employee.prototype;
        } else {
            return false;
        }

        passwordChange.email = getEmployee().email;

        return await fetch(`/${endpoint}/password/update`, requestInit(METHODS.POST, passwordChange)).then(
            response => {
                return response.json().then(
                    body => {
                        if (response.status === 200) {
                            setUser(Object.setPrototypeOf(body, prototype));
                            enqueueSnackbar('Password Updated!', {
                                variant: 'success',
                                autoHideDuration: 3000
                            });
                            return true;
                        }
                        if (response.status === 400) {
                            enqueueSnackbar(body.message, {
                                variant: 'error',
                                autoHideDuration: 3000
                            });
                        }
                        return false;
                    }
                );
            }
        );

    };

    return {
        updatePassword,
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

type IProviderAuth = {
    updatePassword: (passwordChange: PasswordChangeDto) => Promise<boolean>;
    signInManager: (email: string, password: string) => Promise<boolean>;
    signInEmployee: (email: string, password: string) => Promise<boolean>;
    signOut: () => void;
    isAuthenticated: () => boolean;
    isManager: () => boolean;
    isEmployee: () => boolean;
    getManager: () => Manager;
    getEmployee: () => Employee;
}
