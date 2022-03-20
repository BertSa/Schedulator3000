import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {RequireAdmin, RequireNoAuth} from './hooks/use-auth';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Dashboards} from './components/Dashboards';
import {Schedule} from './components/Schedule';
import {SignIn} from './components/SignIn';
import {DateTimePicker} from '@mui/lab';


export default function App() {
    // document.addEventListener('contextmenu', (event) => {
    //     event.preventDefault();
    // });
    const Register = (): React.ReactElement => {
        return <h1>Register</h1>;
    };
    const ManagerRoute = (): React.ReactElement => {
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
    );
}
