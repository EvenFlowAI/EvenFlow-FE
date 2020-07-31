import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {AppBar, Avatar, Toolbar, Typography} from "@material-ui/core";
import {sideBarWidth} from "../../theme/theme";


const useStyles = makeStyles(theme => ({
    root: {
        width: `calc(100% - ${sideBarWidth}px)`,
        color: "#858585",
        backgroundColor: theme.palette.background.paper,
        marginLeft: sideBarWidth,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
    },
    grow: {
        flexGrow: 1
    },
    name: {
        fontSize: 16,
        marginRight: 10,
        fontWeight: "bold"
    },
    avatar: {
        backgroundColor: theme.palette.primary.dark
    }
}));


export const NavBar = () => {
    const classes = useStyles();

    return <AppBar className={classes.root}>
        <Toolbar>
            <div className={classes.grow} />
            <Typography className={classes.name} variant="h4">EvenFlow Admin</Typography>
            <Avatar className={classes.avatar}>
                IM
            </Avatar>
        </Toolbar>
    </AppBar>
}