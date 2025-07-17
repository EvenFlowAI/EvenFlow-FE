import { TForm } from './types';
import { getYearOptions } from '../../../../utils/getDate';

export const initialForm: TForm = {
  recallCampaignNumber: '',
  make: null,
  models: [],
  yearTo: '',
  yearFrom: '',
  recallComponent: '',
  recallSummary: '',
  serviceRequest: null,
  oemProgram: '',
};
export const yearOptions = getYearOptions();
