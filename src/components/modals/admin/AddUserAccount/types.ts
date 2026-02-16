import { TRole } from '../../../../store/reducers/users/types';
import { IServiceCenter } from '../../../../store/reducers/serviceCenters/types';
import { TOptionForUserAccountServiceCenters } from '../../../../types/types';
import { TOption } from '../../../../utils/types';

export type TUserAccountForm = {
  firstName: string;
  email: string;
  role: TRole | null;
  lastName: string;
  serviceCenter?: IServiceCenter | null;
  dealerships: TOption[];
  serviceCenters: TOptionForUserAccountServiceCenters[];
};
