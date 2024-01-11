import React, {useMemo, useState} from "react";
import {Paper} from "@mui/material";
import {CalendarControls} from "./CalendarControls/CalendarControls";
import {WeekDayNames} from "../../../utils/constants";
import moment, {Moment} from "moment";
import clsx from "clsx";
import {Star, SupervisorAccount} from "@mui/icons-material";
import {TDay} from "./types";
import {useCalendarStyles} from "../../../hooks/styling/useCalendarStyles";

export const AvailableStaffCalendar = () => {
    const [date, setDate] = useState<Moment>(moment());
    const today = useMemo(() => moment(), []);
    const classes = useCalendarStyles();

    const handleMonthChange = (m: Moment) => {
        setDate(m);
    }

    const days: TDay[] = useMemo(() => {
        const days: TDay[] = [];
        const cur = moment(date).startOf("month");
        const daysInMonth = cur.daysInMonth();
        const startDay = cur.day();
        cur.subtract(startDay, 'days');
        for (let i=0; i < daysInMonth + startDay; i++) {
            days.push({
                date: moment(cur),
                day: +cur.format("D"),
                type: cur.month() === date.month() ? "cur" : "prev"
            });
            cur.add(1, "day");
        }
        for (let i = 0; i < cur.day(); i++) {
            days.push({
                date: moment(cur),
                day: +cur.format("D"),
                type: "next"
            })
            cur.add(1, "day");
        }

        return days;
    }, [date]);

    return <div style={{width: "100%"}}>
        <Paper className={classes.paper} variant="outlined">
            <h2 className={classes.title}>Calendar</h2>
            <CalendarControls date={date} onChange={handleMonthChange} />
            <div className={classes.calendarWrapper}>
                {WeekDayNames.map(day =>
                    <div className={classes.weekDay} key={day}>{day}</div>
                )}
                {days.map(d =>
                    <div
                        className={clsx(
                            classes.dayCell,
                            d.type === "cur" ? classes.currentMonth : classes.prevMonth,
                            d.date.isSame(today, "day") ? classes.today : ""
                        )}
                        key={`${d.day}-${d.type}`}>
                        <span className={classes.dayNumber}>{d.day}</span>
                        <span className={classes.iconBlock}><SupervisorAccount/> - 4</span>
                        <span className={classes.iconBlock}><Star /> - 2</span>
                    </div>
                )}
            </div>
        </Paper>
    </div>
}