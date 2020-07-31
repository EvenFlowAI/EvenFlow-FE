import React from "react";
import {Switch, Redirect} from "react-router-dom";

export const AdminPage = () => {
    return <Switch>
        <Redirect to="/admin/sc-profiles" />
    </Switch>;
}