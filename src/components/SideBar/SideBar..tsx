import React from "react";
import {Drawer, lighten, List, ListItem} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import logo from '../../assets/img/logoSidebar.svg';
import {NavLink} from "react-router-dom";
import {LinkType} from "../../types/types";
import {sideBarWidth} from "../../theme/theme";
import {Routes} from "../../config/routes";

const useStyles = makeStyles(theme => ({
    drawer: {
        width: sideBarWidth,
        flexShrink: 0
    },
    logo: {
        maxWidth: "80%",
        marginBottom: 60
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
        transition: theme.transitions.create(['color']),
        "&.active": {
            color: "#7898FF"
        },
        "&:hover": {
            color: lighten("#7898FF", .5)
        }
    }
}));

const links: LinkType[] = [
    {to: Routes.Admin.DealershipGroups, name: "Dealership Groups"},
    {to: Routes.Admin.Employees, name: "Employees"},
    {to: Routes.Admin.ServiceCenters, name: "Service Centers"}
];

export const SideBar = () => {
    const classes = useStyles();
    return <Drawer
        className={classes.drawer}
        classes={{paper: classes.drawerPaper}}
        variant="permanent"
        anchor="left"
    >
        <img className={classes.logo} src={logo} alt="EvenFlow AI"/>
        <List disablePadding>
            {links.map(link => <ListItem
                disableGutters
                className={classes.listItem}
                component={NavLink}
                to={link.to}
                key={link.to}>{link.name}</ListItem>)}
        </List>
    </Drawer>
};