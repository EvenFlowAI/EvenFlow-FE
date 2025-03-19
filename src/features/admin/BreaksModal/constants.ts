import { TBreak } from './types';
import dayjs from 'dayjs';

export const blankRow: TBreak = {
  checked: false,
  from: null,
  to: null,
  dayOfWeek: 0,
};

export const initialBreaks: TBreak[] = dayjs.weekdays().map((day, dayOfWeek) => ({
  ...blankRow,
  dayOfWeek,
}));
