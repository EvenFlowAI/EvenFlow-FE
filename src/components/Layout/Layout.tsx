import React from "react";
import {SideBar} from "../SideBar/SideBar.";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        minHeight: "100vh"
    },
    main: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3)
    }
}));


export const Layout = () => {
    const classes = useStyles();
    return <div className={classes.root}>
        <SideBar />
        <div className={classes.main}>
            Content
        </div>
    </div>
}