import React from "react";
import moment from "moment";
import {ISchedule} from "../../../store/reducers/schedules/types";
import {timeSpanString, timeString} from "../../../config/constants";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

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
    const data = schedules.filter(s => {
       return moment(s.date).isSame(moment(date), 'day')
    });
    return data.find(d => d.isLastSet);
}

export const findScheduleDates = (date: moment.Moment, schedules: ISchedule[], isWorkingDay: boolean): JSX.Element|string => {
    const schedule = getSchedule(date, schedules);
    if (schedule && isWorkingDay) {
        return <>
            <span className="nowrap">{moment(schedule.startAt, timeSpanString).format(timeString)}</span>
            <span> - </span>
            <span className="nowrap">{moment(schedule.finishAt, timeSpanString).format(timeString)}</span>
        </>
    }
    return "-"
}

export const getRequestDate = (date: moment.Moment | ParsableDate): {fromDate: ParsableDate, toDate: ParsableDate} => {
    const dayOfWeek = moment(date).day();
    let fromDate = moment(date).day("Monday").toISOString();
    let toDate = moment(date).day("Friday").toISOString();
    if (dayOfWeek === 0) {
        fromDate = moment(date).subtract(1, 'day').startOf('week').add(1, 'day').toISOString()
        toDate = moment(date).subtract(1, 'day').day("Friday").toISOString()
    }
    return {fromDate, toDate};
}