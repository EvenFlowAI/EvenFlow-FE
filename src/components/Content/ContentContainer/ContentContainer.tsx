import React from "react";
import {Container, ContainerProps} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        padding: `0 ${theme.spacing(4)}px ${theme.spacing(4)}px`,
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        width: "100%",
        maxWidth: theme.breakpoints.values.lg,
    }
}));

export const ContentContainer: React.FC<ContainerProps> = props => {
    const classes = useStyles();

    return <Container className={classes.root} disableGutters {...props} />;
}
