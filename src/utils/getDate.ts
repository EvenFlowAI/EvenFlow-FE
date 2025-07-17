import { TParsableDate } from '../types/types';
import dayjs from 'dayjs';

export const getStartEndDates = (date: TParsableDate, isXS: boolean): [string, string] => {
  const utcOffset = dayjs(date).utcOffset();
  if (isXS) {
    return [
      dayjs.utc(date).startOf('day').add(utcOffset, 'minute').toISOString(),
      dayjs.utc(date).endOf('day').add(utcOffset, 'minute').toISOString(),
    ];
  }
  let correctedDate = date;
  const dayOfWeek = dayjs(date).day();
  if (dayOfWeek === 0) correctedDate = dayjs(date).subtract(1, 'day');
  return [
    dayjs(correctedDate).startOf('week').add(1, 'days').add(utcOffset, 'minute').toISOString(),
    dayjs(correctedDate).endOf('week').add(1, 'days').add(utcOffset, 'minute').toISOString(),
  ];
};

export const getYearOptions = () => {
  const year = dayjs().utc().add(1, 'year').year();
  const YEARS = year - 1982;
  return Array(YEARS)
    .fill(0)
    .map((_, idx) => String(year - idx));
};
