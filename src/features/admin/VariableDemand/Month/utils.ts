import { ITimeOfYearSetting } from '../../../../store/reducers/pricingSettings/types';
import { TDate } from './types';
import { TParsableDate } from '../../../../types/types';
import dayjs from 'dayjs';

const findD = (date: TParsableDate) => (sd: ITimeOfYearSetting) => {
  const tfd = dayjs(sd.date);
  return tfd.isSame(date, 'day') && tfd.isSame(date, 'month');
};

export const getDays = (
  start: TParsableDate,
  end: TParsableDate,
  dt: ITimeOfYearSetting[]
): TDate[] => {
  const dates: TDate[] = [];
  let date = dayjs.utc(start);

  while (dayjs.utc(date).isBefore(end, 'date')) {
    const data = dt.find(findD(date));
    dates.push({ date, data });
    date = dayjs.utc(date).add(1, 'day');
  }

  const data = dt.find(findD(end));
  dates.push({ date: dayjs.utc(end), data });

  return dates;
};
