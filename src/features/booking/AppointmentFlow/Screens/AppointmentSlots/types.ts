import { TArgCallback, TParsableDate } from '../../../../../types/types';
import { Dayjs } from 'dayjs';

export type TMonthProps = {
  date: TParsableDate;
  loading: boolean;
  onDateChange: TArgCallback<TParsableDate>;
};

export type TSlot = {
  date: Dayjs;
  label: string;
};
