import React from 'react';
import {RequireEmployee, RequireNoAuth} from './hooks/use-auth';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {ManagerRoute} from './components/manager/ManagerRoute';
import {Navbar} from './components/Navbar';
import {SignIn} from './components/SignIn';


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
                <Route path="/manager" component={ManagerRoute}/>
                <RequireEmployee>
                    <h3>Allooooo</h3>
                </RequireEmployee>
                <RequireNoAuth>
                    <Route path="/register">
                        <Register/>
                    </Route>
                    <Route path="/signin">
                        <SignIn/>
                    </Route>
                </RequireNoAuth>
            </div>
        </Router>
    );
}
