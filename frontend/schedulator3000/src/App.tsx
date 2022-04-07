import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { SignInPage } from './components/SignInPage';
import { Dashboards } from './components/manager/Dashboards';
import { ScheduleEmployee } from './components/employee/ScheduleEmployee';
import { RequireAdmin, RequireEmployee, RequireNoAuth } from './hooks/use-auth';


export default function App() {
    // document.addEventListener('contextmenu', (event) => {
    //     event.preventDefault();
    // });

    const Register = (): React.ReactElement => {
        return <h1>Register</h1>;
    };

    return (
        <Router>
            <Navbar />
            <div className="container">
                <RequireAdmin>
                    <Route path="/manager" component={ Dashboards } />
                </RequireAdmin>
                <RequireEmployee>
                    <h3>Allooooo</h3>
                    <ScheduleEmployee />
                </RequireEmployee>
                <RequireNoAuth>
                    <Route path="/register" component={ Register } />
                    <Route path="/signin" component={ SignInPage } />
                </RequireNoAuth>
            </div>
        </Router>
    );
}
