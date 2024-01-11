import {useStyles} from "./styles";
import {Grid} from "@mui/material";
import React from "react";

export const TitleRow = () => {
    const classes = useStyles();

    return <Grid container spacing={1}>
        <Grid className={classes.titleRow} item xs={6} sm={2} md={3}>
            Slot starts
        </Grid>
        <Grid className={classes.titleRow} item xs={6} sm={2} md={2}>
            Slot ends
        </Grid>
        <Grid item xs={12} sm={8} md={7} />
    </Grid>
}