import React from "react";
import {CircularProgressProps, CircularProgress, Grid} from "@material-ui/core";

export const Loading: React.FC<CircularProgressProps> = props => {
    return <Grid container justify="center"><CircularProgress {...props} /></Grid>;
}
