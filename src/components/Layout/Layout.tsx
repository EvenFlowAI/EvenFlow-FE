import React, {useEffect} from "react";
import {SideBar} from "../SideBar/SideBar.";
import {makeStyles} from "@material-ui/core/styles";
import { Redirect, Switch } from "react-router-dom";
import {AdminPage} from "../Admin/AdminPage";
import {NavBar} from "../NavBar/NavBar";
import {Toolbar} from "@material-ui/core";
import {Routes} from "../../config/routes";
import {PrivateRoute} from "../../utils/Routes";
import {useDispatch} from "react-redux";
import {getCurrentUser} from "../../store/reducers/users/actions";
import {OptimizerPage} from "../Optimizer/OptimizerPage";
import {loadDealershipProfile} from "../../store/reducers/dealershipGroups/actions";
import {loadAllSCs} from "../../store/reducers/serviceCenters/actions";
import {useSCs} from "../../utils/hooks";


const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        minHeight: "100vh",
    },
    divider: {
        marginTop: 20,
        marginBottom: 10
    },
    main: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
    }
}));


export const Layout = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    useEffect(() => {
        dispatch(getCurrentUser());
        dispatch(loadDealershipProfile());
        dispatch(loadAllSCs());
    }, [dispatch]);
    useEffect(() => {
        if (selectedSC) {
            // TODO: Load pods for selection
        }
    }, [dispatch, selectedSC])

    return <div className={classes.root}>
        <SideBar />
        <NavBar />
        <div className={classes.main}>
            <Toolbar id="backToTopAnchor" />
            <Switch>
                <PrivateRoute path={Routes.Admin.Base} component={AdminPage} />
                <PrivateRoute path={Routes.Optimizer.Base} component={OptimizerPage} />
                <Redirect to={Routes.Admin.Base} />
            </Switch>
        </div>
    </div>
}