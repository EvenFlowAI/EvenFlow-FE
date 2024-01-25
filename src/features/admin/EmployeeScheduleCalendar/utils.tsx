import React from "react";
import {ISchedule} from "../../../store/reducers/schedules/types";
import {timeSpanString, time12HourFormat} from "../../../utils/constants";
import {TParsableDate} from "../../../types/types";
import dayjs from "dayjs";

export const getDaysOfWeek = (date: TParsableDate, isXS: boolean): TParsableDate[] => {
    if (isXS) {
        return [dayjs.utc(date).startOf("day")];
    }
    const days = [];
    const weekStart = dayjs.utc(date).startOf("week");
    for (let i=1; i<=7; i++) {
        days.push(dayjs(weekStart).add(i, "days"));
    }
    return days;
}
export const getFirstLastDaysOfWeek = (date: TParsableDate, isSingle: boolean): string => {
    if (isSingle) {
        return dayjs(date).format("ddd, MMM D YYYY");
    }
    const weekStart = dayjs(date).startOf("week").add(1, 'days');
    const weekEnd = dayjs(date).endOf("week").add(1, 'days');
    return `${weekStart.format("MMM D")} - ${weekEnd.format("MMM D")}`;
}

export const getSchedule = (date: TParsableDate, schedules: ISchedule[]): ISchedule|undefined => {
    const data = schedules.filter(s => {
       return dayjs(s.date).isSame(dayjs(date), 'day')
    });
    return data.find(d => d.isLastSet);
}

export const findScheduleDates = (date: TParsableDate, schedules: ISchedule[], isWorkingDay: boolean): JSX.Element|string => {
    const schedule = getSchedule(date, schedules);
    if (schedule && isWorkingDay) {
        return <>
            <span className="nowrap">{dayjs(schedule.startAt, timeSpanString).format(time12HourFormat)}</span>
            <span> - </span>
            <span className="nowrap">{dayjs(schedule.finishAt, timeSpanString).format(time12HourFormat)}</span>
        </>
    }
    return "-"
}

export const getRequestDate = (date: TParsableDate): {fromDate: TParsableDate, toDate: TParsableDate} => {
    const dayOfWeek = dayjs(date).day();
    let fromDate = dayjs(date).day(1).toISOString();
    let toDate = dayjs(date).day(4).toISOString();
    if (dayOfWeek === 0) {
        fromDate = dayjs(date).subtract(1, 'day').startOf('week').add(1, 'day').toISOString()
        toDate = dayjs(date).subtract(1, 'day').day(4).toISOString()
    }
    return {fromDate, toDate};
}