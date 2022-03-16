import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider, RequireAdmin, RequireAuth, RequireNoAuth} from './hooks/use-auth';
import {BrowserRouter as Router, Route, useRouteMatch} from 'react-router-dom';
import {Dashboards} from './components/Dashboards';
import {Schedule} from './components/Schedule';
import {createTheme, CssBaseline, ThemeOptions, ThemeProvider} from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterDateFns';
import {SignIn} from './components/SignIn';


export const themeOptions: ThemeOptions = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00796b'
        },
        secondary: {
            main: '#b2ebf2'
        }
    }
});

function App() {
    let Register = (): React.ReactElement => {
        return <h1>Register</h1>;
    };
    let ManagerRoute = (): React.ReactElement => {
        const {path} = useRouteMatch();

        return <>
            <Route exact path={`${path}/signin`}>
                <RequireNoAuth>
                    <SignIn/>
                </RequireNoAuth>
            </Route>
            <RequireAdmin>
                <Dashboards/>
            </RequireAdmin>
        </>;
    };
    return (
        <AuthProvider>
            <LocalizationProvider dateAdapter={DateAdapter}>
                <ThemeProvider theme={themeOptions}>
                    <CssBaseline/>
                    <Router>
                        <div className="container">
                            <Route path="/schedule" component={Schedule}/>
                            <Route path="/manager" component={ManagerRoute}/>
                            <RequiredRoute path="/register" required>
                                <Register/>
                            </RequiredRoute>
                        </div>
                    </Router>
                </ThemeProvider>
            </LocalizationProvider>
        </AuthProvider>);
}

export default App;

function RequiredRoute(props: IRequiredRouteProps) {
    const {exact, path, required, children} = props;
    if (required) {
        return <Route path={path} exact={exact}>
            <RequireAuth>{children}</RequireAuth>
        </Route>;
    } else
        return <Route exact={exact} path={path}>
            <RequireNoAuth>{children}</RequireNoAuth>
        </Route>;
}

type IRequiredRouteProps = {
    exact: boolean;
    path: string;
    required: boolean;
    children: any;
};
RequiredRoute.defaultProps = {
    exact: false,
    required: false
};
