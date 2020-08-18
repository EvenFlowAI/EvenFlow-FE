import React, {useEffect} from "react";
import {SideBar} from "../SideBar/SideBar.";
import {makeStyles} from "@material-ui/core/styles";
import { Redirect, Switch } from "react-router-dom";
import {AdminPage} from "../Admin/AdminPage";
import {NavBar} from "../NavBar/NavBar";
import {ContentTitle} from "../Content/ContentTitle/ContentTitle";
import {Toolbar} from "@material-ui/core";
import {ContentActions} from "../Content/ContentActions/ContentActions";
import {TitleContainer} from "../Content/TitleContainer/TitleContainer";
import {Routes} from "../../config/routes";
import {PrivateRoute} from "../../utils/Routes";
import {useDispatch} from "react-redux";
import {getCurrentUser} from "../../store/reducers/users/actions";


const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        minHeight: "100vh",
    },
    main: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
    }
}));


export const Layout = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCurrentUser());
    })

    return <div className={classes.root}>
        <SideBar />
        <NavBar />
        <div className={classes.main}>
            <Toolbar id="backToTopAnchor" />
            <TitleContainer>
                <ContentTitle />
                <ContentActions />
            </TitleContainer>
            <Switch>
                <PrivateRoute path={Routes.Admin.Base} component={AdminPage} />
                <Redirect to={Routes.Admin.Base} />
            </Switch>
        </div>
    </div>
}