import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { SignInPage } from './components/SignInPage';
import { ManagerPages } from './components/manager/ManagerPages';
import { RequireAdmin, RequireEmployee, RequireNoAuth } from './hooks/use-auth';
import { EmployeePages } from './components/employee/EmployeePages';


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
            <main>
                <RequireAdmin>
                    <Route path="/manager" component={ ManagerPages } />
                </RequireAdmin>
                <RequireEmployee>
                    <EmployeePages />
                </RequireEmployee>
                <RequireNoAuth>
                    <Route path="/register" component={ Register } />
                    <Route path="/signin" component={ SignInPage } />
                </RequireNoAuth>
            </main>
        </Router>
    );
}
