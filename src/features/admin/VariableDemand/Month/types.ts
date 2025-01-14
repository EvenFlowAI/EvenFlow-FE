import { ITimeOfYearSetting } from '../../../../store/reducers/pricingSettings/types';
import { TParsableDate } from '../../../../types/types';

export type TDate = {
  date: TParsableDate;
  data?: ITimeOfYearSetting;
};
