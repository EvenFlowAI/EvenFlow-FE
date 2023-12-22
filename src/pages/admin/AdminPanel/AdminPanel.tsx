import React, {useEffect, useRef, useState} from "react";
import {SideBar} from "../../../features/admin/SideBar/SideBar";
import {Redirect, Switch} from "react-router-dom";
import {AdminPage} from "../AdminPage/AdminPage";
import {NavBar} from "../../../features/admin/NavBar/NavBar";
import {Toolbar} from "@material-ui/core";
import {Routes} from "../../../config/routes";
import {PrivateRoute} from "../../../components/PrivateRoute/PrivateRoute";
import {useDispatch} from "react-redux";
import {getCurrentUser} from "../../../store/reducers/users/actions";
import {loadDealershipProfile} from "../../../store/reducers/dealershipGroups/actions";
import {loadAllSCs, loadSCAnalytics} from "../../../store/reducers/serviceCenters/actions";
import {getPodsShort, loadPodsShort} from "../../../store/reducers/pods/actions";
import clsx from "clsx";
import {useStyles} from "./styles";
import {useSideBar} from "../../../hooks/useSideBar/useSideBar";
import {useSCs} from "../../../hooks/useSCs/useSCs";

export const AdminPanel = () => {
    const [navBarHeight, setNavBarHeight] = useState<number>(0);
    const {selectedSC} = useSCs();
    const {isOpened, onOpen, onClose} = useSideBar();
    const dispatch = useDispatch();
    const navBarRef = useRef<HTMLDivElement>(null);
    const classes = useStyles();

    useEffect(() => {
        function updateHeight() {
            setNavBarHeight(navBarRef.current?.clientHeight || 0);
        }
        window.addEventListener("resize", updateHeight);
        return () => {
            window.removeEventListener("resize", updateHeight);
        }
    })

    useEffect(() => {
        dispatch(getCurrentUser());
        dispatch(loadDealershipProfile());
        dispatch(loadAllSCs());
    }, [dispatch]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadPodsShort(selectedSC.id));
            dispatch(loadSCAnalytics(selectedSC.id));
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
                <Redirect to={Routes.Admin.Base} />
            </Switch>
        </div>
    </div>
}