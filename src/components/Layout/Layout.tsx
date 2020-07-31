import React from "react";
import {SideBar} from "../SideBar/SideBar.";
import {makeStyles} from "@material-ui/core/styles";
import { Redirect, Route, Switch } from "react-router-dom";
import {AdminPage} from "../Admin/AdminPage";


const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        minHeight: "100vh"
    },
    main: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
    }
}));


export const Layout = () => {
    const classes = useStyles();
    return <div className={classes.root}>
        <SideBar />
        <div className={classes.main}>
            <Switch>
                <Route to="/admin" component={AdminPage} />
                <Redirect to="/admin" />
            </Switch>
        </div>
    </div>
}