import {Grid, ThemeProvider} from "@material-ui/core";
import {CustomerLogin} from "./CustomerLogin";
import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import {ForgotPassword} from "./ForgotPassword";
import {LoginSideBar} from "./LoginSideBar";
import {ResetPassword} from "./ResetPassword";
import {loginTheme} from "../../theme/theme";
import {Routes} from "../../config/routes";
import {EmailVerification} from "../Verification/EmailVerification";

export const Login = () => {
    return <ThemeProvider theme={loginTheme}>
        <Grid container alignItems="stretch" style={{height: "100%", background: "#ffffff"}}>
            <Grid item xs={12} sm={4}><LoginSideBar/></Grid>
            <Grid item xs={12} sm={8} style={{justifyContent: "center"}}>
                <Grid container alignItems="center" justify="center" style={{height: "100%"}}>
                    <Grid item xs={10} sm={10} md={6} style={{padding: "16px 0"}}>
                        <Switch>
                            <Route path={Routes.Login.Base} exact component={CustomerLogin}/>
                            <Route path={Routes.Login.ForgotPassword} exact component={ForgotPassword}/>
                            <Route path={Routes.Account.ResetPassword} exact component={ResetPassword}/>
                            <Route path={Routes.Account.Verification} exact component={EmailVerification} />
                            <Redirect to="/login"/>
                        </Switch>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </ThemeProvider>
}