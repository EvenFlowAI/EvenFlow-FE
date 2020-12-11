import React, {useEffect, useRef, useState} from "react";
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
import {useSCs, useSideBar} from "../../utils/hooks";
import {getPodsShort, loadPodsShort} from "../../store/reducers/pods/actions";
import {OfferManagementPage} from "../OfferManagement/OfferManagementPage";
import {sideBarWidth} from "../../theme/theme";
import clsx from "clsx";


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
        transition: theme.transitions.create(["margin"]),
        marginLeft: -sideBarWidth,
        backgroundColor: theme.palette.background.default,
        [theme.breakpoints.up("lg")]: {
            marginLeft: 0
        }
    },
    mainOpened: {
        transition: theme.transitions.create(["margin"]),
        marginLeft: 0,
    }
}));


export const Layout = () => {
    const classes = useStyles();
    const {isOpened, onOpen, onClose} = useSideBar();
    const navBarRef = useRef<HTMLDivElement>(null);
    const [navBarHeight, setNavBarHeight] = useState<number>(0);
    useEffect(() => {
        function updateHeight() {
            setNavBarHeight(navBarRef.current?.clientHeight || 0);
        }
        window.addEventListener("resize", updateHeight);
        return () => {
            window.removeEventListener("resize", updateHeight);
        }
    })

    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    useEffect(() => {
        dispatch(getCurrentUser());
        dispatch(loadDealershipProfile());
        dispatch(loadAllSCs());
    }, [dispatch]);
    useEffect(() => {
        if (selectedSC) {
            dispatch(loadPodsShort(selectedSC.id));
        } else {
            dispatch(getPodsShort([]));
        }
    }, [dispatch, selectedSC])

    return <div className={classes.root}>
        <SideBar isOpened={isOpened} onClose={onClose} />
        <NavBar ref={navBarRef} sideBarOpened={isOpened} onOpen={onOpen} />
        <div className={clsx(
            classes.main,
            {[classes.mainOpened]: isOpened}
        )}>
            <Toolbar id="backToTopAnchor" style={{height: navBarHeight || undefined}} />
            <Switch>
                <PrivateRoute path={Routes.Admin.Base} component={AdminPage} />
                <PrivateRoute path={Routes.Optimizer.Base} component={OptimizerPage} />
                <PrivateRoute path={Routes.OfferManagement.Base} component={OfferManagementPage} />
                <Redirect to={Routes.Admin.Base} />
            </Switch>
        </div>
    </div>
}