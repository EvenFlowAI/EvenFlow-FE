import { TForm } from './types';
import { getOptions, getYearOptions } from '../../../../utils/utils';
import { TOption } from '../../ServiceBookModal/types';
import { EUserType } from '../../../../store/reducers/appointmentFrameReducer/types';
import { EDay } from '../../../../store/reducers/demandSegments/types';

export const initialForm: TForm = {
  name: '',
  message: '',
  title: '',
  advisors: [],
  serviceRequests: [],
  isWaitlistEnabled: false,
  makes: [],
  models: [],
  modelYearFrom: null,
  modelYearTo: null,
  customerType: null,
  serviceBooks: [],
  appointmentTimeFrom: '',
  appointmentTimeTo: '',
  daysOfWeek: [],
  transportationOptions: [],
  mobileServiceZones: [],
  serviceValetZones: [],
};
export const yearOptions = getYearOptions();
export const customerTypeOptions: TOption[] = getOptions(
  Object.keys(EUserType).filter(key => Number.isNaN(+key))
);
export const dayOfWeekOptions = getOptions(Object.keys(EDay).filter(key => Number.isNaN(+key)));
