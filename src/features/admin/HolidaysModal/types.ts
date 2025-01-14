import { TParsableDate } from '../../../types/types';

export type THolidayForm = {
  date: TParsableDate;
  isRecurring: boolean;
  description: string;
};
