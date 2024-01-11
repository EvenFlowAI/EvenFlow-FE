import moment from "moment/moment";
import {ITimeOfYearSetting} from "../../../../store/reducers/pricingSettings/types";
import {TDate} from "./types";

const findD = (date: moment.Moment) => (sd: ITimeOfYearSetting) => {
    const tfd = moment(sd.date);
    return tfd.isSame(date, "day") && tfd.isSame(date, "month")
}

export const getDays = (start: moment.Moment, end: moment.Moment, dt: ITimeOfYearSetting[]): TDate[] => {
    const dates: TDate[] = [];
    let date = moment(start);
    while (1) {
        const data = dt.find(findD(date));
        dates.push({date, data});
        if (date.isSameOrAfter(end, "date")) {
            break;
        }
        date = moment(date).add(1, "day");
    }
    return dates;
}