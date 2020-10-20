import moment from "moment";

export const getDaysOfWeek = (date: moment.Moment): moment.Moment[] => {
    const days = [];
    const weekStart = moment(date).startOf("week");
    for (let i=1; i<7; i++) {
        days.push(moment(weekStart).add(i, "days"));
    }
    return days;
}

export const calendarDateFormat = "ddd, MMM D";