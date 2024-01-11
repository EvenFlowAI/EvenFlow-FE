import React from "react";
import {Typography} from "@material-ui/core";
import {useStyles} from "./styles";

type Props = {content: React.ReactElement | string};

export const LoginTextContent: React.FC<Props> = props => {
    const classes = useStyles();
    return <Typography align="center" variant="body1" className={classes.root}>{props.content}</Typography>;
}
