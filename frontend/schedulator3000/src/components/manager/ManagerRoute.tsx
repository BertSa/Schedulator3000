import React from 'react';
import {RequireAdmin} from '../../hooks/use-auth';
import {Dashboards} from './Dashboards';

export function ManagerRoute(): React.ReactElement {
    return <>
        <RequireAdmin>
            <Dashboards/>
        </RequireAdmin>
    </>;
}
