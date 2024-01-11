import React from "react";
import { Paper } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

const BaseLoginContainer: React.FC = props => {
    return <Paper elevation={0}>
        {props.children}
    </Paper>
};

export const LoginContainer = withStyles({
    root: {padding: 30}
})(BaseLoginContainer);