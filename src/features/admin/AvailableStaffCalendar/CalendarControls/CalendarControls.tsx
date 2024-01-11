import React from "react";
import {Button} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import clsx from "clsx";
import moment, {Moment} from "moment";
import {useStyles} from "./styles";
import {Directions} from "../types";

type TProps = {
    date: Moment,
    onChange: (date: Moment) => void
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