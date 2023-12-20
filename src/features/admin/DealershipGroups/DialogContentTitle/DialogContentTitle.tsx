import React from "react";
import {Typography} from "@material-ui/core";
import {useStyles} from "./styles";

export const DialogContentTitle: React.FC<{title: string}> = props => {
    const classes = useStyles({maxWidth: 0});
    return <Typography
        className={classes.dialogContentTitle}
        variant="h4">
        {props.title}
    </Typography>;
}