import React from 'react';
import {RequireAdmin, RequireEmployee, RequireNoAuth} from './hooks/use-auth';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Navbar} from './components/Navbar';
import {SignInPage} from './components/SignInPage';
import {Dashboards} from './components/manager/Dashboards';


export default function App() {
    // document.addEventListener('contextmenu', (event) => {
    //     event.preventDefault();
    // });

    const Register = (): React.ReactElement => {
        return <h1>Register</h1>;
    };

    return (
        <Router>
            <Navbar/>
            <div className="container">
                <RequireAdmin>
                    <Route path="/manager" component={Dashboards}/>
                </RequireAdmin>
                <RequireEmployee>
                    <h3>Allooooo</h3>
                </RequireEmployee>
                <RequireNoAuth>
                    <Route path="/register" component={Register}/>
                    <Route path="/signin" component={SignInPage}/>
                </RequireNoAuth>
            </div>
        </Router>
    );
}
