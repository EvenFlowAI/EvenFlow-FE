import { EReportingStatus } from '../../../../api/types';
import {
  TScheduler,
  TServiceBook,
  TServiceConsultant,
} from '../../../../store/reducers/appointments/types';
import { TParsableDate } from '../../../../types/types';
import { Dispatch, SetStateAction } from 'react';
import { EDate, TFilters } from '../types';

export type TAppointmentFilterProps = {
  status: EReportingStatus[];
  scheduler: TScheduler | null;
  serviceBook: TServiceBook | null;
  dateFrom: TParsableDate;
  dateTo: TParsableDate;
  setFilters: Dispatch<SetStateAction<TFilters>>;
  advisor: TServiceConsultant | null;
  technician: TServiceConsultant | null;
  dateRangeType: EDate;
};
