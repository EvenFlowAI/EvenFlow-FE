import React from "react";
import {Calendar} from "./Calendar";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles({
    wrapper: {
        width: "100%"
    }
})
export const AvailableStaff = () => {
    const classes = useStyles();
    return <div className={classes.wrapper}>
        {/*<Cards />*/}
        <Calendar />
    </div>
}