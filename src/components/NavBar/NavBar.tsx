import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {AppBar, Avatar, Toolbar, Typography} from "@material-ui/core";
import {sideBarWidth} from "../../theme/theme";
import {authService} from "../../config/requests";
import { useHistory } from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {getInitials} from "../../utils/utils";


const useStyles = makeStyles(theme => ({
    root: {
        width: `calc(100% - ${sideBarWidth}px)`,
        color: "#858585",
        backgroundColor: theme.palette.background.paper,
        marginLeft: sideBarWidth,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
    },
    grow: {
        flexGrow: 1
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

    const handleLogout = () => {
        authService.logout();
        history.push("/");
    }

    return <>
        <AppBar className={classes.root}>
            <Toolbar>
                <div className={classes.grow} />
                <Typography className={classes.name} variant="h4">{currentUser?.fullName || ""}</Typography>
                <Avatar src={currentUser?.avatarPath} className={classes.avatar} onClick={handleLogout}>
                    {getInitials(currentUser?.fullName || '-')}
                </Avatar>
            </Toolbar>
        </AppBar>
    </>
}