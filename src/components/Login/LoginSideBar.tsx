import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    wrapper: {

    },
    image: {

    },
    gradient: {

    }
});

export const LoginSideBar = () => {
    const classes = useStyles();
    return <div className={classes.wrapper}>
        <div className={classes.image} />
        <div className={classes.gradient} />
    </div>
};