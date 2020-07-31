import React from "react";
import {Container, ContainerProps} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        padding: 40,
        display: "flex",
        flexFlow: "row no-wrap",
        alignItems: "center"
    }
});

export const ContentContainer: React.FC<ContainerProps> = props => {
    const classes = useStyles();

    return <Container className={classes.root} disableGutters {...props} />;
}
