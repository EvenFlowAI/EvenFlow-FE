import { TParsableDate } from '../../../types/types';

export type TBreak = {
  id?: number;
  from: TParsableDate;
  to: TParsableDate;
  checked: boolean;
  dayOfWeek: number;
};
