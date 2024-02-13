import {ITimeOfYearSetting} from "../../../../store/reducers/pricingSettings/types";
import {TDate} from "./types";
import {TParsableDate} from "../../../../types/types";
import dayjs from "dayjs";

const findD = (date: TParsableDate) => (sd: ITimeOfYearSetting) => {
    const tfd = dayjs(sd.date);
    return tfd.isSame(date, "day") && tfd.isSame(date, "month")
}

export const getDays = (start: TParsableDate, end: TParsableDate, dt: ITimeOfYearSetting[]): TDate[] => {
    const dates: TDate[] = [];
    let date = dayjs.utc(start);
    while (1) {
        const data = dt.find(findD(date));
        dates.push({date, data});
        if (dayjs.utc(date).isSameOrAfter(end, "date")) {
            break;
        }
        date = dayjs.utc(date).add(1, "day");
    }
    return dates;
}