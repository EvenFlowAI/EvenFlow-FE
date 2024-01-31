import React from 'react';
import {AppBar, Avatar, Toolbar, Typography, useMediaQuery, useTheme} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {getInitials} from "../../../utils/utils";
import {useStyles} from "./styles";

export const EndUserBar = () => {
    const scProfile = useSelector((state: RootState) => {
        return state.appointment.scProfile;
    })
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));

    const { classes  } = useStyles();
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
            <div className={classes.grow} />
            <Typography className={classes.contacts} variant="h6">
                Service: {scProfile?.phoneNumber}
            </Typography>
        </Toolbar>
    </AppBar>
};