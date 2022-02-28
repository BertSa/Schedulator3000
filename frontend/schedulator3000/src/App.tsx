import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider, RequireAuth, RequireNoAuth} from './hooks/use-auth';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Dashboards} from './Dashboards';

function App() {
    let Register = (): React.ReactElement => {
        return <h1>Register</h1>;
    };
    return (
        <AuthProvider>
            <Router>
                <div className="container">
                    <RequiredRoute path="/manager" required>
                        <Dashboards />
                    </RequiredRoute>
                    <RequiredRoute path="/register" required>
                        <Register/>
                    </RequiredRoute>
                </div>
            </Router>
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
