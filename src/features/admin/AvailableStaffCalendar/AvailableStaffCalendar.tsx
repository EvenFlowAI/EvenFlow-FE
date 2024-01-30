import React, {useMemo, useState} from "react";
import {Paper} from "@mui/material";
import {CalendarControls} from "./CalendarControls/CalendarControls";
import {WeekDayNames} from "../../../utils/constants";
import clsx from "clsx";
import {Star, SupervisorAccount} from "@mui/icons-material";
import {TDay} from "./types";
import {useCalendarStyles} from "../../../hooks/styling/useCalendarStyles";
import {TParsableDate} from "../../../types/types";
import dayjs from "dayjs";

export const AvailableStaffCalendar = () => {
    const [date, setDate] = useState<TParsableDate>(dayjs());
    const today = useMemo(() => dayjs(), []);
    const classes = useCalendarStyles();

    const handleMonthChange = (m: TParsableDate) => {
        setDate(m);
    }

    const days: TDay[] = useMemo(() => {
        const days: TDay[] = [];
        let cur = dayjs(date).startOf("month");
        const daysInMonth = cur.daysInMonth();
        const startDay = cur.day();
        cur = cur.subtract(startDay, 'days');
        for (let i=0; i < daysInMonth + startDay; i++) {
            days.push({
                date: dayjs(cur),
                day: +cur.format("D"),
                type: cur.month() === dayjs(date).month() ? "cur" : "prev"
            });
            cur = dayjs(cur).add(1, "day");
        }
        for (let i = 0; i < cur.day(); i++) {
            days.push({
                date: dayjs(cur),
                day: +cur.format("D"),
                type: "next"
            })
            cur = dayjs(cur).add(1, "day");
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
                            dayjs(d.date).isSame(today, "day") ? classes.today : ""
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