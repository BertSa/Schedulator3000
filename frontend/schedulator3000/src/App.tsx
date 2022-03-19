import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider, RequireAdmin, RequireNoAuth} from './hooks/use-auth';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Dashboards} from './components/Dashboards';
import {Schedule} from './components/Schedule';
import {createTheme, CssBaseline, ThemeOptions, ThemeProvider} from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterDateFns';
import {SignIn} from './components/SignIn';
import DialogProvider from './hooks/use-dialog';


export default function App() {
    // document.addEventListener('contextmenu', (event) => {
    //     event.preventDefault();
    // });
    let Register = (): React.ReactElement => {
        return <h1>Register</h1>;
    };
    let ManagerRoute = (): React.ReactElement => {
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
        <AllProviders>
            <CssBaseline/>
            <Router>
                <div className="container">
                    <Route path="/schedule" component={Schedule}/>
                    <Route path="/manager" component={ManagerRoute}/>
                    <Route path="/register">
                        <RequireNoAuth>
                            <Register/>
                        </RequireNoAuth>
                    </Route>
                </div>
            </Router>
        </AllProviders>
    );
}


const themeOptions: ThemeOptions = createTheme({
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

function AllProviders({children}: { children: React.ReactNode }) {
    return <>
        <AuthProvider>
            <LocalizationProvider dateAdapter={DateAdapter}>
                <ThemeProvider theme={themeOptions}>
                    <DialogProvider>
                        {children}
                    </DialogProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </AuthProvider>
    </>;
}
