import React from "react";
import {Route, RouteProps, Redirect} from "react-router-dom";
import {Routes} from "../config/routes";
import {useAuth} from "../context/auth";

export const PrivateRoute: React.FC<RouteProps> = (
    {component: Component, ...rest}) => {
    const {tokens: {accessToken}} = useAuth();
    return <Route {...rest} render={props => {
        if (!Component) return null;
        return (
            accessToken
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: Routes.Login.Base,
                    state: {from: props.location}
                }} />
        );
    }}
    />;
};