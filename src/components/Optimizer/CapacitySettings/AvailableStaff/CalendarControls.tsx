import React from "react";
import {Button} from "@material-ui/core";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {MonthNames} from "../../../../config/constants";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    controls: {
    },
    controlButton: {

    },
})
type TProps = {
    month: number,
    onChange: (month: number) => void
}
export const CalendarControls = (props: TProps) => {
    const classes = useStyles();
    return <div className={classes.controls}>
            <Button className={classes.controlButton} variant="outlined">
            <ChevronLeft />
        </Button>
        <Button className={classes.controlButton}  variant="outlined">
            {MonthNames[props.month]}
        </Button>
        <Button className={classes.controlButton}  variant="outlined">
            <ChevronRight />
        </Button>
    </div>
}