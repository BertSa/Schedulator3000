import { Redirect, Route } from 'react-router-dom';
import React from 'react';
import { IConditionalRouteProps } from './IConditionalRouteProps';
import { useAuth } from '../../contexts/AuthContext';

type ConditionalRouteProps = {
  condition: boolean,
  redirectPath: string
}
& IConditionalRouteProps;

export function ConditionalRoute({ condition, redirectPath, component: C, ...rest }: ConditionalRouteProps) {
  return (
    <Route
      {...rest}
      render={(props) =>
        condition
          ? <C {...props} />
          : (
            <Redirect to={redirectPath} />
          )}
    />
  );
}

export function RouteAdmin(props: IConditionalRouteProps) {
  const isManager = useAuth().isManager();
  return <ConditionalRoute condition={isManager} redirectPath="/" {...props} />;
}

RouteAdmin.defaultProps = {
  exact: false,
};

export function RouteEmployee(props: IConditionalRouteProps) {
  const auth = useAuth();
  const isEmployee = !auth.isNewEmployee() && auth.isEmployee();
  const redirectPath: string = auth.isNewEmployee() ? '/welcome' : '/';

  return <ConditionalRoute condition={isEmployee} redirectPath={redirectPath} {...props} />;
}

RouteEmployee.defaultProps = {
  exact: false,
};

export function RouteNewEmployee(props: IConditionalRouteProps) {
  const isEmployee = useAuth().isNewEmployee();
  return <ConditionalRoute condition={isEmployee} redirectPath="/" {...props} />;
}

RouteNewEmployee.defaultProps = {
  exact: false,
};

export function RouteUnAuthenticated(props: IConditionalRouteProps) {
  const auth = useAuth();
  const isUnAuthenticated = !auth.isAuthenticated();

  return (
    <ConditionalRoute
      condition={isUnAuthenticated}
      redirectPath={auth.isManager() ? '/manager' : '/schedule'}
      {...props}
    />
  );
}

RouteUnAuthenticated.defaultProps = {
  exact: false,
};
