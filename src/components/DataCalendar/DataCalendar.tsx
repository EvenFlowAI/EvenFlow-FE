import React, {useMemo} from "react";
import {Paper} from "@mui/material";
import clsx from "clsx";
import {useStyles} from "./styles";
import dayjs from "dayjs";
import {IDataCalendarProps, TParsableDate} from "../../types/types";
import {TDay} from "../../features/admin/AvailableStaffCalendar/types";
import {CalendarControls} from "./CalendarControls/CalendarControls";
import {WeekDayNames} from "../../utils/constants";

export function DataCalendar<U>({
                                    date,
                                    data,
                                    setDate,
                                    onDayClick,
                                    firstIconFieldName,
                                    secondIconFieldName,
                                    firstIcon,
                                    secondIcon,
                                    index,
                                    dateFieldName,
                                }: IDataCalendarProps<U>) {
    const today = useMemo(() => dayjs(), []);
    const { classes  } = useStyles();

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
                {days.map(d => {
                        const dayData = data.find(el => dayjs(el[dateFieldName] as TParsableDate).isSame(d.date, "date"))
                        return <div
                            className={clsx(
                                classes.dayCell,
                                d.type === "cur" ? classes.currentMonth : classes.prevMonth,
                                dayjs(d.date).isSame(today, "day") ? classes.today : ""
                            )}
                            onClick={() => dayData ? onDayClick(dayData) : null}
                            key={`${d.day}-${d.type}`}>
                            <span className={classes.dayNumber}>{d.day}</span>
                            <span className={classes.iconBlock}>{firstIcon} {dayData ? ` - ${dayData[firstIconFieldName]}` : ' - 0'}</span>
                            <span className={classes.iconBlock}>{secondIcon} {dayData ? ` - ${dayData[secondIconFieldName]}` : ' - 0'}</span>
                        </div>
                    }
                )}
            </div>
        </Paper>
    </div>
}