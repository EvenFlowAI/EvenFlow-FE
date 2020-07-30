import React from "react";
import {Drawer, List, ListItem} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import logo from '../../assets/img/logoSidebar.svg';
import {Link} from "react-router-dom";


type LinkObj = {
    to: string;
    name: string;
}
const links: LinkObj[] = [
    {to: '/admin/sc-profiles', name: "Service Center Profiles"},
    {to: '/admin/employees', name: "Employees"},
    {to: '/admin/locations', name: "Locations"}
];



const useStyles = makeStyles(theme => ({
    drawer: {
        width: 240,
    },
    logo: {
        maxWidth: "80%",
        marginBottom: 60
    },
    drawerPaper: {
        width: 240,
        backgroundColor: "#252525",
        color: "#FFFFFF",
        display: "flex",
        flexFlow: "column",
        padding: "60px 30px",
        alignItems: "center"
    }
}));

export const SideBar = () => {
    const classes = useStyles();
    return <Drawer
        className={classes.drawer}
        classes={{paper: classes.drawerPaper}}
        variant="permanent"
        anchor="left"
    >
        <img className={classes.logo} src={logo} alt="EvenFlow AI"/>
        <List>
            {links.map(link => <ListItem component={Link} to={link.to} key={link.to}>{link.name}</ListItem>)}
        </List>
    </Drawer>
};