import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import {RequireNoAuth} from './hooks/use-auth';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Schedule} from './components/manager/Schedule';
import {ManagerRoute} from './components/manager/ManagerRoute';
import {Navbar} from './Navbar';


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
