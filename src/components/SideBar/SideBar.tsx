import React, {useEffect, useMemo} from "react";
import {Button, Drawer, IconButton, List, useMediaQuery, useTheme} from "@material-ui/core";
import logo from '../../assets/img/logoSidebar.svg';
import {LinkTypeWithSub} from "../../types/types";
import {Routes} from "../../config/routes";
import {useCurrentUser, useModal, useSCs} from "../../utils/hooks";
import {matchPath, useHistory, useLocation} from "react-router-dom";
import {ArrowForwardIos, Close} from "@material-ui/icons";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {Loading} from "../Loading/Loading";
import Link from "./Link/Link";
import {reportingAllowedRoles} from "../../pages/admin/Reporting/constants";
import {useStyles} from "./styles";
import {MainLinksWithSub, SULinks} from "./constants";
import {BookingModal} from "./BookingModal/BookingModal";

type TProps = {
    isOpened: boolean;
    onClose: () => void;
};

export const SideBar: React.FC<TProps> = ({isOpened, onClose}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const {onClose: onModalClose, isOpen, onOpen} = useModal();

    const currentUser = useCurrentUser();
    const { loading } = useSelector((state: RootState) => state.users);
    const {pathname} = useLocation();
    const {selectedSC} = useSCs();
    const history = useHistory();

    const links: LinkTypeWithSub[] = useMemo(() => {
        if (matchPath(pathname, Routes.Admin.Base) && currentUser?.isSuperUser) {
            return SULinks;
        }
        return MainLinksWithSub;
    }, [currentUser, pathname]);

    useEffect(() => {
        if ((!window.origin.includes("apps.evenflow.ai") || (currentUser && reportingAllowedRoles.includes(currentUser?.role)))
            && !MainLinksWithSub.find(el => el.to === Routes.Admin.Reporting)) {
            MainLinksWithSub.push(
                {to: Routes.Admin.Reporting, name: "Reporting", roles: ["Owner", "Manager", "Service Director", "Super Admin"], subLinks: [
                        {to: Routes.Reporting.AppointmentsSummary, name: "Appointments Summary", exact: true, sub: true, roles: ["Owner", "Manager", "Service Director", "Super Admin"]},
                        {to: Routes.Reporting.ShopLoading, name: "Shop Loading", exact: true, sub: true, roles: ["Owner", "Manager", "Service Director", "Super Admin"]},
                        {to: Routes.Reporting.ValetAppointments, name: "Valet Appointments", exact: true, sub: true, roles: ["Owner", "Manager", "Service Director", "Super Admin"]},
                        {to: Routes.Reporting.MobileServiceAppointments, name: "Mobile Service Appointments", exact: true, sub: true, roles: ["Owner", "Manager", "Service Director", "Super Admin"]},
                        {to: Routes.Reporting.CustomerBehavior, name: "Customer Behavior", exact: true, sub: true, roles: ["Owner", "Manager", "Service Director", "Super Admin"]},
                        {to: Routes.Reporting.RepairOrderPerformance, name: "Repair Order Performance", exact: true, sub: true, roles: ["Owner", "Manager", "Service Director", "Super Admin"]},
                        {to: Routes.Reporting.CapacityManagementPerformance, name: "Capacity Management Performance", exact: true, sub: true, roles: ["Owner", "Manager", "Service Director", "Super Admin"]},
                    ]},
            )
        }
    }, [MainLinksWithSub, window, currentUser])

    const handleLogoClick = () => {
        history.push(Routes.Admin.Base);
    }

    const closeSidebar = () => {
        if (isXS) {
            onClose();
        }
    }

    return <Drawer
        className={classes.drawer}
        classes={{paper: classes.drawerPaper}}
        variant={!isTablet ? "permanent" : "persistent"}
        open={isOpened}
        anchor="left"
    >
        {isTablet
            ? <IconButton
                className={classes.closeButton}
                onClick={onClose}>
                <Close style={{color: "#fff"}} />
            </IconButton>
            : null}
        <img onClick={handleLogoClick} className={classes.logo} src={logo} alt="EvenFlow AI"/>
        <List disablePadding>
            {loading
                ? <Loading/>
                : links.map(link =>  <Link link={link} closeSidebar={closeSidebar} key={link.name}/>)
            }
        </List>
        <div style={{flex: 1}} />
        {selectedSC
            ? <Button
                endIcon={<ArrowForwardIos/>}
                className={classes.link}
                onClick={onOpen}>
                Booking UI
            </Button>
            : null}
        <BookingModal open={isOpen} onClose={onModalClose} />
    </Drawer>
};