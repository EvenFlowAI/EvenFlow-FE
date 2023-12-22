import React from "react";
import {Route, RouteProps, Redirect} from "react-router-dom";
import {hasPermission} from "../../utils/utils";
import {useCurrentUser} from "../../hooks/useCurrentUser/useCurrentUser";
import {Routes} from "../constants";
import {authService} from "../../api/AuthService/AuthService";

export const PrivateRoute: React.FC<RouteProps> = (
    {component: Component, ...rest}) => {
    const currentUser = useCurrentUser();
    return <Route {...rest} render={props => {
        if (!Component) return null;
        if (authService.isAuthenticated()) {
            if (!hasPermission(currentUser, rest.path as string)) {
                return <Redirect to={"/"} />;
            }
            return <Component {...props} />;
        }
       return <Redirect to={{
           pathname: Routes.Login.Base,
           state: {from: props.location}
       }} />
    }}
    />;
};