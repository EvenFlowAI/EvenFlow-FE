import React, {useMemo} from "react";
import {Drawer, lighten, List, ListItem} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import logo from '../../assets/img/logoSidebar.svg';
import {NavLink} from "react-router-dom";
import {LinkType} from "../../types/types";
import {sideBarWidth} from "../../theme/theme";
import {Routes} from "../../config/routes";
import {useCurrentUser} from "../../utils/hooks";
import {useLocation, useHistory, matchPath} from "react-router-dom";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
    drawer: {
        width: sideBarWidth,
        flexShrink: 0
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
        alignItems: "center"
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
    {to: Routes.Admin.DealershipGroups, name: "Dealership Groups"},
    {to: Routes.Admin.Employees, name: "Employees"},
    {to: Routes.Admin.ServiceCenters, name: "Service Centers"},
    {to: Routes.Admin.ServiceRequests, name: "Service Requests"}
];
const AdminLinks: LinkType[] = [
    {to: Routes.Admin.Base, name: "Dashboard", exact: true},
    {to: Routes.Admin.ServiceCenters, name: "Service Centers"},
    {to: Routes.Admin.Employees, name: "Employees"}
]
const MainLinks: LinkType[] = [
    {to: Routes.Admin.Base, name: "Dashboard", exact: true},
    {to: Routes.Optimizer.Base, name: "Optimizer Settings", exact: true},
    {to: Routes.Optimizer.ServiceRequests, name: "Service Requests", sub: true},
    {to: Routes.Optimizer.AppointmentValue, name: "Appointment Value Settings", sub: true},
    {to: Routes.Optimizer.CapacitySettings, name: "Capacity Settings", sub: true},
    {to: Routes.Optimizer.AppointmentSlotScoring, name: "Appointment Slot Scoring", sub: true},
    {to: Routes.Optimizer.OptimizationWindows, name: "Optimization Windows", sub: true},
]

export const SideBar = () => {
    const classes = useStyles();

    const currentUser = useCurrentUser();
    const {pathname} = useLocation();
    const history = useHistory();
    const links: LinkType[] = useMemo(() => {
        if (matchPath(pathname, Routes.Admin.Base))
            return currentUser?.isSuperUser ? SULinks : AdminLinks;
        return MainLinks;
    }, [currentUser, pathname]);
    const handleLogoClick = () => {
        history.push(Routes.Admin.Base);
    }

    return <Drawer
        className={classes.drawer}
        classes={{paper: classes.drawerPaper}}
        variant="permanent"
        anchor="left"
    >
        <img onClick={handleLogoClick} className={classes.logo} src={logo} alt="EvenFlow AI"/>
        <List disablePadding>
            {links.map(link => <ListItem
                disableGutters
                className={clsx(classes.listItem, link.sub ? classes.subMenu : "")}
                component={NavLink}
                to={link.to}
                exact={link.exact}
                key={link.to}>{link.name}</ListItem>)}
        </List>
    </Drawer>
};