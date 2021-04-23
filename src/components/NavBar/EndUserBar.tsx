import React from 'react';
import {AppBar, Avatar, Toolbar, Typography, useMediaQuery, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {getInitials} from "../../utils/utils";

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1
    },
    contacts: {
        fontSize: 19,
        fontWeight: "bold",
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    serviceName: {
        marginLeft: 18,
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 19
    },
    bar: {
        background: "#252733"
    }
}))

export const EndUserBar = () => {
    const scProfile = useSelector((state: RootState) => {
        return state.appointment.scProfile;
    })
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    const classes = useStyles();
    return <AppBar className={classes.bar} position="static">
        <Toolbar>
            <Avatar title={getInitials(scProfile?.name)} src={scProfile?.avatarPath}>
                {getInitials(scProfile?.name)}
            </Avatar>
            {isXS ? <div className="grow" /> : null}
            <Typography className={classes.serviceName} variant="h4">
                {scProfile?.name}
            </Typography>
            <div className={classes.grow} />
            {/*{!isXS ? <ScSelector/> : null}*/}
            <div className={classes.grow} />
            <Typography className={classes.contacts} variant="h6">
                Service: {scProfile?.phoneNumber}
            </Typography>
        </Toolbar>
    </AppBar>
};