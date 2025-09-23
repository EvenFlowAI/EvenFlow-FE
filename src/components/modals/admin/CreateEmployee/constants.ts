import { TEmployeeForm } from './types';
import { EDmsRole } from '../../../../store/reducers/employees/types';
import { Roles } from '../../../../types/types';

export const initialEmployeeForm: TEmployeeForm = {
  firstName: '',
  lastName: '',
  serviceCenter: null,
  role: null,
  position: '',
  hourlyRate: '',
  overtimeRate: '',
  email: '',
  technicianLevel: 1,
  dmsId: '',
};

export const superRoles = [Roles.EvenFlowAdmin, Roles.DealerOwner];

export const DmsRoles = {
  [EDmsRole.None]: 'None',
  [EDmsRole.Advisor]: Roles.Advisor,
  [EDmsRole.Technician]: Roles.Technician,
  [EDmsRole.ServiceManager]: Roles.ServiceManager,
  [EDmsRole.ServiceDirector]: Roles.ServiceDirector,
  [EDmsRole.BDCAgent]: Roles.BDCAgent,
};
