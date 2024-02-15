import React from "react";
import {Button} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import clsx from "clsx";
import {useStyles} from "./styles";
import {Directions} from "../../../features/admin/AvailableStaffCalendar/types";
import {TParsableDate} from "../../../types/types";
import dayjs from "dayjs";

type TProps = {
    date: TParsableDate,
    onChange: (date: TParsableDate) => void
}

export const CalendarControls = (props: TProps) => {
    const { classes  } = useStyles();
    const switchDate = (direction: Directions) => () => {
        if (direction === Directions.Prev) {
            props.onChange(dayjs(props.date).subtract(1, "month"));
        } else {
            props.onChange(dayjs(props.date).add(1, "month"));
        }
    };
    return <div className={classes.controls}>
        <Button
            className={classes.controlButton}
            onClick={switchDate(Directions.Prev)}
            color="info"
            variant="outlined">
            <ChevronLeft />
        </Button>
        <Button className={clsx(classes.controlButton, classes.controlDay)}  variant="outlined" color="info">
            {dayjs(props.date).format("MMMM YYYY")}
        </Button>
        <Button
            className={classes.controlButton}
            onClick={switchDate(Directions.Next)}
            variant="outlined"
            color="info">
            <ChevronRight />
        </Button>
    </div>
}