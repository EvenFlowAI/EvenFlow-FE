import React from "react";
import {Button, ButtonProps, withStyles} from "@material-ui/core";

export const BaseLoginButton: React.FC<ButtonProps> = props => {
    return <Button variant="contained" color="primary" fullWidth {...props} />
}

export const LoginButton = withStyles({
    root: {marginTop: 40}
})(BaseLoginButton);