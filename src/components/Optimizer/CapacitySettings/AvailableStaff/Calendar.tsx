import React, {useMemo, useState} from "react";
import {lighten, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CalendarControls} from "./CalendarControls";
import {WeekDayNames} from "../../../../config/constants";
import moment, {Moment} from "moment";
import clsx from "clsx";
import {Star, SupervisorAccount} from "@material-ui/icons";


const useStyles = makeStyles(theme => ({
    title: {
        textAlign: "center",
        position: "absolute",
        top: 8,
        left: 0,
        right: 0,
        margin: 0,
        fontSize: 16,
        [theme.breakpoints.down("xs")]: {
            position: "static",
            marginBottom: theme.spacing(1)
        }
    },
    paper: {
        borderRadius: 0,
        position: "relative",
        padding: 11
    },
    weekDay: {
        textAlign: "center",
        background: theme.palette.common.white
    },
    dayNumber: {
        position: "absolute",
        top: 4, left: 4
    },
    prevMonth: {
        color: theme.palette.text.hint
    },
    dayCell: {
        background: theme.palette.common.white,
        minHeight: 70,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: theme.transitions.create(["background"]),
        "&:hover": {
            background: lighten(theme.palette.primary.light, .9)
        }
    },
    iconBlock: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        margin: 3,
        "&>.MuiSvgIcon-root": {
            fontSize: 20
        }
    },
    today: {
        color: `${theme.palette.success.dark} !important`,
    },
    currentMonth: {
        color: theme.palette.text.primary
    },
    calendarWrapper: {
        marginTop: 11,
        overflowX: "auto",
        gridGap: 1,
        background: theme.palette.divider,
        border: `1px solid ${theme.palette.divider}`,
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)"
    }
}));


type TDayType = "prev" | "cur" | "next"
type TDay = {
    date: Moment,
    day: number,
    type: TDayType
}
export const Calendar = () => {
    const [date, setDate] = useState<Moment>(moment());
    const today = useMemo(() => {
        return moment();
    }, []);
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


    const classes = useStyles();
    return <Paper className={classes.paper} variant="outlined">
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
}