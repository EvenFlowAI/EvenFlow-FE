import { TRole } from '../../../../store/reducers/users/types';
import { IServiceCenter } from '../../../../store/reducers/serviceCenters/types';
import { TOptionForUserAccountServiceCenters, TTechnicianLevel } from '../../../../types/types';
import { EDisplayOnBookingType, EEmployeeType } from '../CreateEmployee/types';
import { TOption } from '../../../../utils/types';

export type TUserAccountForm = {
  firstName: string;
  email: string;
  role: TRole | null;
  lastName: string;
  serviceCenter?: IServiceCenter | null;
  dealerships: TOption[];
  serviceCenters: TOptionForUserAccountServiceCenters[];
  dmsId?: string | null;
  position: string;
  displayOnBookingTypes?: EDisplayOnBookingType[];
  type?: EEmployeeType | null;
  hourlyRate?: number | '';
  overtimeRate?: number | '';
  technicianLevel?: TTechnicianLevel;
};
