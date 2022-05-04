import React from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignInPage from './components/SignInPage';
import ManagerPages from './components/manager/ManagerPages';
import { RequireAdmin, RequireEmployee, RequireNoAuth } from './hooks/use-auth';
import EmployeePages from './components/employee/EmployeePages';
import SignUpPage from './components/SignUpPage';
import NotFoundPage from './components/NotFoundPage';

export default function App() {
  // document.addEventListener('contextmenu', (event) => {
  //     event.preventDefault();
  // });

  return (
    <Router>
      <Navbar />
      <main>
        <RequireAdmin>
          <Route path="/manager" component={ManagerPages} />
        </RequireAdmin>
        <RequireEmployee>
          <EmployeePages />
        </RequireEmployee>
        <RequireNoAuth>
          <Route path="/register" component={SignUpPage} />
          <Route exact path="/" component={SignInPage} />
        </RequireNoAuth>
        <Route path="/404" component={NotFoundPage} />
        <Redirect to="/404" />
      </main>
    </Router>
  );
}
