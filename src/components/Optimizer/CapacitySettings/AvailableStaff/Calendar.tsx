import React, {useState} from "react";
import {Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CalendarControls} from "./CalendarControls";
import {WeekDayNames} from "../../../../config/constants";

const useStyles = makeStyles({
    title: {
        textAlign: "center",
        position: "absolute",
        top: 8,
        left: 0,
        right: 0,
        margin: 0,
        fontSize: 16
    },
    paper: {
        position: "relative"
    },
    calendarWrapper: {
        margin: 8,
        border: "1px solid gray",
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)"
    }
});

export const Calendar = () => {
    const today = new Date();
    const [month, setMonth] = useState<number>(today.getMonth());
    const handleMonthChange = (m: number) => {
        setMonth(m);
    }

    const classes = useStyles();
    return <Paper className={classes.paper}>
        <h2 className={classes.title}>Calendar</h2>
        <CalendarControls month={month} onChange={handleMonthChange} />
        <div className={classes.calendarWrapper}>
            {WeekDayNames.map(day => {
                return <span key={day}>{day}</span>
            })}
        </div>
    </Paper>
}