import React from "react";
import {Typography} from "@mui/material";
import {useStyles} from "./styles";

export const DialogContentTitle: React.FC<React.PropsWithChildren<React.PropsWithChildren<{title: string}>>> = props => {
    const { classes  } = useStyles();
    return <Typography
        className={classes.dialogContentTitle}
        variant="h4">
        {props.title}
    </Typography>;
}