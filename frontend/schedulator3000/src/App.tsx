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
import DialogProvider from './hooks/use-dialog';


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
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
    let Register = (): React.ReactElement => {
        return <h1>Register</h1>;
    };
    let ManagerRoute = (): React.ReactElement => {
        const {path} = useRouteMatch();

        return <>
            <h2>Hello</h2>
            <RequireNoAuth>
                <SignIn/>
            </RequireNoAuth>
            <RequireAdmin>
                <Dashboards/>
            </RequireAdmin>
        </>;
    };
    return (
        <AuthProvider>
            <LocalizationProvider dateAdapter={DateAdapter}>
                <ThemeProvider theme={themeOptions}>
                    <DialogProvider>
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
                    </DialogProvider>
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
