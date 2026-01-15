import { TArgCallback, TParsableDate } from '../../../../../types/types';
import { Dayjs } from 'dayjs';

export type TMonthProps = {
  date: TParsableDate;
  onDateChange: TArgCallback<TParsableDate>;
};

export type TSlot = {
  date: Dayjs;
  label: string;
};
