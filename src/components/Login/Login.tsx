import {Grid} from "@material-ui/core";
import {CustomerLogin} from "./CustomerLogin";
import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";

export const Login = () => {
    return <Grid container alignItems="stretch" style={{height: "100%"}}>
        <Grid item xs={4} style={{background: "grey"}}/>
        <Grid item xs={8} style={{justifyContent: "center"}}>
            <Grid container alignItems="center" justify="center" style={{height: "100%"}}>
                <Grid item xs={6}>
                    <Switch>
                        <Route path="/login" exact component={CustomerLogin} />
                        <Route path="/login/forgot-password" component={CustomerLogin} />
                        <Redirect to="/login" />
                    </Switch>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}