import { TEmployeeForm } from './types';
import { EDmsRole } from '../../../../store/reducers/employees/types';

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

export const superRoles = ['Super Admin', 'Owner'];

export const DmsRoles = {
  [EDmsRole.None]: 'None',
  [EDmsRole.Advisor]: 'Advisor',
  [EDmsRole.Technician]: 'Technician',
  [EDmsRole.ServiceManager]: 'Manager',
  [EDmsRole.ServiceDirector]: 'Service Director',
  [EDmsRole.CallCenterRep]: 'Call Center Rep',
};
