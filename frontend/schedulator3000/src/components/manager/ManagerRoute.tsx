import React from 'react';
import {RequireAdmin, RequireNoAuth} from '../../hooks/use-auth';
import {Dashboards} from './Dashboards';
import {SignInManager} from './SignInManager';

export function ManagerRoute(): React.ReactElement {
    return <>
        <RequireAdmin>
            <Dashboards/>
        </RequireAdmin>
        <RequireNoAuth>
            <SignInManager/>
        </RequireNoAuth>
    </>;
}
