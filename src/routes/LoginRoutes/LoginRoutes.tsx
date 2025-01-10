import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { AdminLogin } from "../../features/admin/AdminLogin/AdminLogin";
import { ForgotPassword } from "../../features/admin/ForgotPassword/ForgotPassword";
import { ResetPassword } from "../../features/admin/ResetPassword/ResetPassword";
import { EmailVerification } from "../../features/admin/EmailVerification/EmailVerification";
import { Routes } from "../constants";

const LoginRoutes = () => {
  return (
    <Switch>
      <Route path={Routes.Login.Base} exact component={AdminLogin} />
      <Route path={Routes.Login.ForgotPassword} component={ForgotPassword} />
      <Route path={Routes.Account.ResetPassword} component={ResetPassword} />
      <Route path={Routes.Account.Verification} component={EmailVerification} />
      <Redirect to="/login" />
    </Switch>
  );
};

export default LoginRoutes;
