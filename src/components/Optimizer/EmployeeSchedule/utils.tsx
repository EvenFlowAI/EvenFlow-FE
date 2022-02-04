import React from "react";
import moment from "moment";
import {ISchedule} from "../../../store/reducers/schedules/types";
import {timeSpanString, timeString} from "../../../config/constants";

export const getDaysOfWeek = (date: moment.Moment, isXS: boolean): moment.Moment[] => {
    if (isXS) {
        return [moment.utc(date).startOf("day")];
    }
    const days = [];
    const weekStart = moment.utc(date).startOf("week");
    for (let i=1; i<=7; i++) {
        days.push(moment(weekStart).add(i, "days"));
    }
    return days;
}
export const getFirstLastDaysOfWeek = (date: moment.Moment, isSingle: boolean): string => {
    if (isSingle) {
        return date.format("ddd, MMM D YYYY");
    }
    const weekStart = moment(date).startOf("week").add(1, 'days');
    const weekEnd = moment(date).endOf("week").add(1, 'days');
    return `${weekStart.format("MMM D")} - ${weekEnd.format("MMM D")}`;
}

export const getSchedule = (date: moment.Moment, schedules: ISchedule[]): ISchedule|undefined => {
    const data = schedules.filter(s => s.dayOfWeek === moment(date).day());
    if (data.length > 1) {
        return data.find(d => d.isLastSet) || data.find(d => d.isRecurring) || data[0];
    }
    return data[0];
}

export const findScheduleDates = (date: moment.Moment, schedules: ISchedule[]): JSX.Element|string => {
    const schedule = getSchedule(date, schedules);
    if (schedule) {
        return <>
            <span className="nowrap">{moment(schedule.startAt, timeSpanString).format(timeString)}</span>
            <span> - </span>
            <span className="nowrap">{moment(schedule.finishAt, timeSpanString).format(timeString)}</span>
        </>
    }
    return "-"
}

export const calendarDateFormat = "ddd, MMM D";
export const getStartEndDates = (date: moment.Moment, isXS: boolean): [string, string] => {
    const utcOffset = moment(date).utcOffset();
    if (isXS) {
        return [
            moment(date).startOf("day").add(utcOffset, 'minutes').toISOString(),
            moment(date).endOf("day").add(utcOffset, 'minutes').toISOString()
        ]
    }
    let correctedDate = date;
    const dayOfWeek = moment(date).day();
    if (dayOfWeek === 0) correctedDate = moment(date).subtract('1', 'days');
    return [
        moment(correctedDate).startOf("week").add(1, 'days').add(utcOffset, 'minutes').toISOString(),
        moment(correctedDate).endOf("week").add(1, 'days').add(utcOffset, 'minutes').toISOString(),
    ]
}