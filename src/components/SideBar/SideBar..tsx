import React, {useMemo} from "react";
import {Button, Drawer, IconButton, lighten, List, ListItem, useMediaQuery, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import logo from '../../assets/img/logoSidebar.svg';
import {NavLink} from "react-router-dom";
import {LinkType} from "../../types/types";
import {sideBarWidth} from "../../theme/theme";
import {Routes} from "../../config/routes";
import {useCurrentUser, useSCs} from "../../utils/hooks";
import {useLocation, useHistory, matchPath} from "react-router-dom";
import clsx from "clsx";
import {ArrowForwardIos, Close} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    drawer: {
        flexShrink: 0,
        width: sideBarWidth,
        display: "flex",
        flexFlow: "column",
        position: "relative",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
        }
    },
    link: {
        color: "#fff"
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10
    },
    logo: {
        maxWidth: "80%",
        marginBottom: 60,
        cursor: "pointer",
        transition: theme.transitions.create(['opacity']),
        "&:hover": {
            opacity: .8
        }
    },
    drawerPaper: {
        width: sideBarWidth,
        backgroundColor: "#252525",
        color: "#FFFFFF",
        display: "flex",
        flexFlow: "column",
        padding: "60px 30px",
        alignItems: "center",
        [theme.breakpoints.down("xs")]: {
            width: "100%"
        }
    },
    listItem: {
        color: "#FFFFFF",
        textTransform: "uppercase",
        fontSize: 14,
        padding: "16px 0",
        lineHeight: "17px",
        fontWeight: "bold",
        transition: theme.transitions.create(['color']),
        "&.active": {
            color: "#7898FF"
        },
        "&:hover": {
            color: lighten("#7898FF", .5)
        }
    },
    subMenu: {
        color: "#929292",
        padding: "10px 0 10px 15px",
        textTransform: "none"
    }
}));

const SULinks: LinkType[] = [
    {to: Routes.Admin.DealershipGroups, name: "Dealership Groups", roles: ["Super Admin"]},
    {to: Routes.Admin.Employees, name: "Employees", roles: ["Super Admin"]},
    {to: Routes.Admin.ServiceCenters, name: "Service Centers", roles: ["Super Admin"]},
    {to: Routes.Admin.ServiceRequests, name: "Service Requests", roles: ["Super Admin"]}
];
const AdminLinks: LinkType[] = [
    {to: Routes.Admin.Base, name: "Dashboard", exact: true, roles: true},
    {to: Routes.Admin.Appointments, name: "Appointments", roles: true},
    {to: Routes.Admin.ServiceCenters, name: "Service Centers", roles: ["Owner"]},
    {to: Routes.Admin.Employees, name: "Employees", roles: ["Owner", "Manager", "Advisor"]}
]
const MainLinks: LinkType[] = [
    {to: Routes.Admin.Base, name: "Dashboard", exact: true, roles: true},
    {to: Routes.Optimizer.Base, name: "Optimizer Settings", exact: true, roles: true},
    {to: Routes.Optimizer.ServiceRequests, name: "Service Requests", sub: true, roles: ["Owner", "Manager", "Advisor"]},
    {to: Routes.Optimizer.AppointmentValue, name: "Appointment Value Settings", sub: true, roles: ["Owner", "Manager"]},
    {to: Routes.Optimizer.CapacitySettings, name: "Capacity Settings", sub: true, roles: ["Owner", "Manager"]},
    {to: Routes.Optimizer.EmployeeSchedule, name: "Employee Schedule", sub: true, roles: ["Owner", "Manager"]},
    {to: Routes.Optimizer.AppointmentSlotScoring, name: "Appointment Slot Scoring", sub: true, roles: ["Owner", "Manager"]},
    {to: Routes.Optimizer.AppointmentAllocation, name: "Appointment Allocation", sub: true, roles: ["Owner", "Manager"]},
    {to: Routes.Optimizer.OptimizationWindows, name: "Optimization Windows", sub: true, roles: ["Owner", "Manager"]},
    {to: Routes.Optimizer.PricingSettings, name: "Pricing Settings", sub: true, roles: ["Owner", "Manager"]},
    {to: Routes.OfferManagement.Base, name: "Offer Management", sub: false, roles: ["Owner", "Manager"]},
];


type TProps = {
    isOpened: boolean;
    onClose: () => void;
};
export const SideBar: React.FC<TProps> = ({isOpened, onClose}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    const currentUser = useCurrentUser();
    const {pathname} = useLocation();
    const {selectedSC} = useSCs();
    const history = useHistory();
    const links: LinkType[] = useMemo(() => {
        if (matchPath(pathname, Routes.Admin.Base))
            return currentUser?.isSuperUser ? SULinks : AdminLinks;
        return MainLinks;
    }, [currentUser, pathname]);
    const handleLogoClick = () => {
        history.push(Routes.Admin.Base);
    }
    const handleGoToBooking = () => {
        history.push(Routes.EndUser.Welcome + "/" + selectedSC?.id);
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
            {links.map(link => {
                if (typeof link.roles === "boolean") {
                    if (!link.roles) {
                        return null;
                    }
                } else if (currentUser?.role && !link.roles.includes(currentUser.role)) {
                    return null;
                }
                return <ListItem
                    disableGutters
                    className={clsx(classes.listItem, link.sub ? classes.subMenu : "")}
                    component={NavLink}
                    to={link.to}
                    onClick={closeSidebar}
                    exact={link.exact}
                    key={link.to}>{link.name}</ListItem>;
            })}
        </List>
        <div style={{flex: 1}} />
        <Button endIcon={<ArrowForwardIos />} className={classes.link} onClick={handleGoToBooking}>Go to Booking</Button>
    </Drawer>
};