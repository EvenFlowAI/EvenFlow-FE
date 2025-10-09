import { TRole } from '../../../store/reducers/users/types';
import { Roles } from '../../../types/types';

export const rolesList: TRole[] = [
  Roles.DealerOwner,
  Roles.ServiceManager,
  Roles.ServiceDirector,
  Roles.Advisor,
  Roles.Technician,
  Roles.BDCAgent,
];
