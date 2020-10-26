import moment from "moment";
import {ISchedule} from "../../../store/reducers/schedules/types";
import {timeSpanString, timeString} from "../../../config/constants";

export const getDaysOfWeek = (date: moment.Moment): moment.Moment[] => {
    const days = [];
    const weekStart = moment.utc(date).startOf("week");
    for (let i=1; i<7; i++) {
        days.push(moment(weekStart).add(i, "days"));
    }
    return days;
}
export const getFirstLastDaysOfWeek = (date: moment.Moment): string => {
    const weekStart = moment(date).startOf("week");
    const weekEnd = moment(date).endOf("week");
    return `${weekStart.format("MMM D")} - ${weekEnd.format("MMM D")}`;
}

export const getSchedule = (date: moment.Moment, schedules: ISchedule[]): ISchedule|undefined => {
    return schedules.find(d => moment.utc(d.date).isSame(date, "day"));
}

export const findScheduleDates = (date: moment.Moment, schedules: ISchedule[]): JSX.Element|string => {
    const schedule = getSchedule(date, schedules);
    if (schedule) {
        return `${
            moment(schedule.startAt, timeSpanString).format(timeString)
        } - ${
            moment(schedule.finishAt, timeSpanString).format(timeString)
        }`;
    }
    return "-"
}

export const calendarDateFormat = "ddd, MMM D";
export const getStartEndDates = (date: moment.Moment): [string, string] => {
    return [
        moment(date).startOf("week").toISOString(),
        moment(date).endOf("week").toISOString(),
    ]
}