import { IAdvisorShort } from '../../../store/reducers/users/types';
import { IAssignedServiceRequestShort } from '../../../store/reducers/serviceRequests/types';

export type TOption = {
  value: number;
  name: string;
};

export type TForm = {
  name: string;
  description: string;
  advisors: IAdvisorShort[];
  technicians: IAdvisorShort[];
  serviceRequests: IAssignedServiceRequestShort[];
  isVisitCenter: boolean;
};
