import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {AppBar, Avatar, Menu, MenuItem, Toolbar, Typography} from "@material-ui/core";
import {sideBarWidth} from "../../theme/theme";
import {authService} from "../../config/requests";
import { useHistory } from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {getInitials} from "../../utils/utils";
import {ServiceCenterSelector} from "./ServiceCenterSelector";
import {Roles} from "../../config/constants";
import {Routes} from "../../config/routes";


const useStyles = makeStyles(theme => ({
    root: {
        width: `calc(100% - ${sideBarWidth}px)`,
        color: "#858585",
        backgroundColor: theme.palette.background.paper,
        marginLeft: sideBarWidth,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
    },
    toolbar: {
        justifyContent: "flex-end"
    },
    name: {
        fontSize: 16,
        marginRight: 10,
        fontWeight: "bold"
    },
    avatar: {
        backgroundColor: theme.palette.primary.dark,
        cursor: "pointer"
    }
}));


export const NavBar = () => {
    const classes = useStyles();
    const history = useHistory();
    const {currentUser} = useSelector((state: RootState) => state.users);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick: React.MouseEventHandler<HTMLElement> = e => {
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    const openProfile = () => {
        handleClose();
        history.push(Routes.Admin.Profile);
    }

    const handleLogout = () => {
        authService.logout();
        history.push("/");
    }

    return <>
        <AppBar className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <ServiceCenterSelector />
                <Typography className={classes.name} variant="h4">{currentUser?.fullName || ""}</Typography>
                <Avatar src={currentUser?.avatarPath} className={classes.avatar} onClick={handleClick}>
                    {getInitials(currentUser?.fullName || '-')}
                </Avatar>
                <Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    {currentUser?.role === Roles.Owner ? <MenuItem onClick={openProfile}>Company Settings</MenuItem> : null}
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    </>
}