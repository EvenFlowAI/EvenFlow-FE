import React from "react";
import {Route, RouteProps, Redirect} from "react-router-dom";
import {Routes} from "../config/routes";
import {authService} from "../config/requests";

export const PrivateRoute: React.FC<RouteProps> = (
    {component: Component, ...rest}) => {
    return <Route {...rest} render={props => {
        if (!Component) return null;
        return (
            authService.isAuthenticated()
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: Routes.Login.Base,
                    state: {from: props.location}
                }} />
        );
    }}
    />;
};