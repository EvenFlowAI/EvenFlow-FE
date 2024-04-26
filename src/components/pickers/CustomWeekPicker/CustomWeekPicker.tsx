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

export const CustomWeekPicker = (props: TProps) => {
    const { classes  } = useStyles();

    const switchDate = (direction: Directions) => () => {
        if (direction === Directions.Prev) {
            props.onChange(dayjs(props.date).subtract(1, "week"));
        } else {
            props.onChange(dayjs(props.date).add(1, "week"));
        }
    };

    return <div className={classes.controls}>
        <Button
            className={classes.controlButton}
            onClick={switchDate(Directions.Prev)}
            color="primary"
            variant="text">
            <ChevronLeft />
        </Button>
        <Button className={clsx(classes.controlButton, classes.controlDay)}  variant="text" color="info">
            Week of {dayjs(props.date).format("MMM Do")}
        </Button>
        <Button
            className={classes.controlButton}
            onClick={switchDate(Directions.Next)}
            variant="text"
            color="primary">
            <ChevronRight />
        </Button>
    </div>
}