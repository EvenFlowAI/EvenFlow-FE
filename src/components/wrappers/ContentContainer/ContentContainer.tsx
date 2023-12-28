import React from "react";
import {Container, ContainerProps} from "@material-ui/core";
import {useStyles} from "./styles";

export const ContentContainer: React.FC<ContainerProps> = props => {
    const classes = useStyles();

    return <Container className={classes.root} disableGutters {...props}  children={props.children}/>;
}
