import React from "react";
import logo from "../../../../assets/img/logoLogin.svg";
import {useStyles} from "./styles";

export const LoginSideBar = () => {
    const { classes  } = useStyles();
    return <div className={classes.wrapper}>
        <div className={classes.image} />
        <div className={classes.gradient} />
        <img className={classes.logo} src={logo} alt="EvenFlow AI"/>
    </div>
};