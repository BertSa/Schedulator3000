import React, {createContext, useContext, useEffect, useState} from 'react';
import {Employee, Manager} from '../models/User';
import { useSnackbar } from 'notistack';
import {METHODS, requestInit} from './use-services';

const authContext: React.Context<IProviderAuth> = createContext({} as IProviderAuth);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const auth = useProvideAuth();
    return React.createElement(authContext.Provider, {value: auth}, children);
}

export const useAuth = () => {
    return useContext(authContext);
};

export function RequireAuth({children}: { children: React.ReactNode }): any {
    let auth = useAuth();

    if (auth.isAuthenticated()) {
        return null;
    }

    return children;
}

export function RequireAdmin({children}: { children: React.ReactNode }): any {
    let auth = useAuth();

    if (auth.isManager()){
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
    const { enqueueSnackbar } = useSnackbar();
    const [user, setUser] = useState<Manager | Employee | undefined>(() => {
        if (sessionStorage.length === 0) {
            return null;
        }

        let item: any = sessionStorage.getItem('user');
        if (item === typeof undefined || item === typeof null) {
            return null;
        }

        let userParsed = JSON.parse(item);

        let type = sessionStorage.getItem('type');
        if (type === Employee.prototype.constructor.name)
            return Object.setPrototypeOf(userParsed, Employee.prototype);
        if (type === Manager.prototype.constructor.name)
            return Object.setPrototypeOf(userParsed, Manager.prototype);
        return null;
    });


    useEffect(() => {
        sessionStorage.setItem('user', JSON.stringify(user));
        if (isEmployee())
            sessionStorage.setItem('type', Employee.prototype.constructor.name);
        else if (isManager())
            sessionStorage.setItem('type', Manager.prototype.constructor.name);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const signInManager = async (email: string, password: string): Promise<boolean | void> => {
        return await fetch(`/manager/signin`, requestInit(METHODS.POST, {email: email, password: password})).then(
            response => {
                return response.json().then(
                    body => {
                        if (response.status === 200) {
                            setUser(Object.setPrototypeOf(body, Manager.prototype));
                            enqueueSnackbar('You are connected!', {
                                variant: 'success',
                                autoHideDuration: 3000,
                            });
                            return true;
                        }
                        if (response.status === 400) {
                            enqueueSnackbar(body.message, {
                                variant: 'error',
                                autoHideDuration: 3000,
                            });
                        }
                        return false;
                    }
                );
            }, err => console.log(err)
        );
    };
    const signOut = (): void => {
        setUser(undefined);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('type');
        enqueueSnackbar('You are now disconnected.', {
            variant: 'default',
            autoHideDuration: 3000,
        });
    };

    const isManager = (): boolean => {
        return isAuthenticated() && user instanceof Manager;
    };

    const isEmployee = (): boolean => {
        return isAuthenticated() && user instanceof Employee;
    };

    const isAuthenticated = (): boolean => {
        return user !== undefined && user !== null;
    };

    const getManager = (): Manager => {
        if (isManager())
            return user as Manager;
        return null as unknown as Manager;
    };
    return {
        user,
        signInManager,
        signOut,
        isManager,
        isEmployee,
        getManager,
        isAuthenticated,
    };
}

type IProviderAuth = {
    user: Manager | Employee | undefined;
    signInManager: (email: string, password: string) => Promise<boolean | void>;
    signOut: () => void;
    isManager: () => boolean;
    isEmployee: () => boolean;
    getManager: () => Manager;
    isAuthenticated: () => boolean;
}
