import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import bgImage from "../../assets/img/image_login.jpg";
import logo from "../../assets/img/logoLogin.svg";

const useStyles = makeStyles({
    wrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%"
    },
    image: {
        position: "absolute",
        background: `url(${bgImage}) right top no-repeat`,
        right: 0,
        left: 0,
        bottom: 0,
        top: 0,
        backgroundSize: "cover"
    },
    gradient: {
        position: "absolute",
        background: `linear-gradient(316.38deg, #000000 -24.4%, #1F42FF 202.16%)`,
        left: 0, right: 0, top: 0, bottom: 0,
        opacity: 0.7,
        backdropFilter: 'blur(10)'
    },
    logo: {
        zIndex: 1,
        maxWidth: "80%"
    }
});

export const LoginSideBar = () => {
    const classes = useStyles();
    return <div className={classes.wrapper}>
        <div className={classes.image} />
        <div className={classes.gradient} />
        <img className={classes.logo} src={logo} alt="EvenFlow AI"/>
    </div>
};