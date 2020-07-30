import React from "react";
import {Paper, withStyles} from "@material-ui/core";

const BaseLoginContainer: React.FC = props => {
    return <Paper elevation={0}>
        {props.children}
    </Paper>
};

export const LoginContainer = withStyles({
    root: {padding: 30}
})(BaseLoginContainer);