import React from "react";
import {Button} from "@material-ui/core";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {MonthNames} from "../../../../config/constants";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import moment, {Moment} from "moment";

const useStyles = makeStyles({
    controls: {
    },
    controlButton: {
        borderRadius: 0,
        marginRight: 11,
        padding: 5,
        minWidth: 30,
    },
    controlDay: {
        padding: "5px 20px !important"
    }
})
type TProps = {
    date: Moment,
    onChange: (date: Moment) => void
}

enum Directions {
    Next, Prev
}
export const CalendarControls = (props: TProps) => {
    const classes = useStyles();
    const switchDate = (direction: Directions) => () => {
        if (direction === Directions.Prev) {
            props.onChange(moment(props.date).subtract(1, "month"));
        } else {
            props.onChange(moment(props.date).add(1, "month"));
        }
    };
    return <div className={classes.controls}>
        <Button
            className={classes.controlButton}
            onClick={switchDate(Directions.Prev)}
            variant="outlined">
            <ChevronLeft />
        </Button>
        <Button className={clsx(classes.controlButton, classes.controlDay)}  variant="outlined">
            {props.date.format("MMMM YYYY")}
        </Button>
        <Button
            className={classes.controlButton}
            onClick={switchDate(Directions.Next)}
            variant="outlined">
            <ChevronRight />
        </Button>
    </div>
}