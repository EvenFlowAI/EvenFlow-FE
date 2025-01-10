import { IScheduleByDate } from '../../../../store/reducers/schedules/types';

export const compareName = (a: IScheduleByDate, b: IScheduleByDate) =>
  a.employeeName === b.employeeName ? a.id - b.id : a.employeeName.localeCompare(b.employeeName);
