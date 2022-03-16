import React, {createContext, useContext, useEffect, useState} from 'react';
import {METHODS, requestInit} from '../serviceUtils';
import {Employee, Manager} from '../models/user';
import {toastError, toastSuccess} from '../utilities';
import {useHistory} from 'react-router-dom';

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
    let locationStateHistory = useHistory();

    if (!auth.user) {
        locationStateHistory.replace('/signin');
        return null;
    }

    return children;
}

export function RequireAdmin({children}: { children: React.ReactNode }): any {
    let auth = useAuth();
    let locationStateHistory = useHistory();

    if (!auth.isManager()) {
        locationStateHistory.replace('/manager/signin');
        return null;
    }

    return children;
}

export function RequireNoAuth({children}: { children: React.ReactNode }): any {
    let auth = useAuth();
    let locationStateHistory = useHistory();

    if (!auth.user) {
        return children;
    }

    if (auth.isManager()) {
        locationStateHistory.replace('/manager');
    } else if (auth.isEmployee()) {
        locationStateHistory.replace('/dashboard');
    }
    return null;

}

function useProvideAuth(): IProviderAuth {
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
                            toastSuccess.fire({title: 'Connected!'}).then();
                            return true;
                        }
                        if (response.status === 400) {
                            toastError.fire({title: body.message});
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
    };

    const isManager = (): boolean => {
        return user instanceof Manager;
    };

    const isEmployee = (): boolean => {
        return user instanceof Employee;
    };

    const getManager = (): Manager => {
        if (isManager())
            return user as Manager;
        console.log('Not a manager');
        return user as Manager;
        // throw new Error('User is not a manager');
    };
    return {
        user,
        signInManager,
        signOut,
        isManager,
        isEmployee,
        getManager
    };
}

type IProviderAuth = {
    user: Manager | Employee | undefined;
    signInManager: (email: string, password: string) => Promise<boolean | void>;
    signOut: () => void;
    isManager: () => boolean;
    isEmployee: () => boolean;
    getManager: () => Manager;
}
