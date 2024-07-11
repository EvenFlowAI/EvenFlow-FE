import {IScheduleByDate} from "../../../../store/reducers/schedules/types";

export const compareName = (a: IScheduleByDate, b: IScheduleByDate) => a.employeeName.localeCompare(b.employeeName)