import React, {createContext, useContext, useEffect, useState} from 'react';
import {METHODS, requestInit} from '../serviceUtils';
import {Employee, Manager, User} from '../models/user';
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

export function RequireAuth({children}: { children: React.ReactChildren }): any {
    let auth = useAuth();
    let locationStateHistory = useHistory();

    if (!auth.user) {
        locationStateHistory.replace('/dashboard');
        return null;
    }

    return children;
}

export function RequireNoAuth({children}: { children: React.ReactChildren }): any {
    let auth = useAuth();
    let locationStateHistory = useHistory();

    if (auth.user) {
        locationStateHistory.replace('/dashboard');
        return null;
    }

    return children;
}

function useProvideAuth(): IProviderAuth {
    const [user, setUser] = useState<User|undefined>(() => {
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

    return {
        user,
        signInManager,
        signOut,
        isManager,
        isEmployee
    };
}

type IProviderAuth = {
    user: User|undefined;
    signInManager: (email: string, password: string) => Promise<boolean | void>;
    signOut: () => void;
    isManager: () => boolean;
    isEmployee: () => boolean;
}
