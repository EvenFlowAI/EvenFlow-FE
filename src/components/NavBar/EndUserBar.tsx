import React from 'react';
import {AppBar, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    grow: {
        flexGrow: 1
    },
    contacts: {
        fontSize: 19,
        fontWeight: "bold"
    },
    bar: {
        background: "#252733"
    }
})

export const EndUserBar = () => {
    const classes = useStyles();
    return <AppBar className={classes.bar} position="static">
        <Toolbar>
            <div className={classes.grow} />
            <Typography className={classes.contacts} variant="h6">
                Service: 888-690-3322 Parts: (888) 689-0555
            </Typography>
        </Toolbar>
    </AppBar>
};