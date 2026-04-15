import { IAdvisorShort } from '../../../store/reducers/users/types';
import { IAssignedServiceRequestShort } from '../../../store/reducers/serviceRequests/types';
import { IMake, IModel } from '../../../api/types';
import { TZone } from '../../../store/reducers/mobileService/types';
import { IEngineType } from '../../../store/reducers/vehicleDetails/types';
import { ITransportationOptionFull } from '../../../store/reducers/transportationNeeds/types';

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
};

export const initialForm: TForm = {
  name: '',
  description: '',
  advisors: [],
  technicians: [],
  serviceRequests: [],
};

export type ServiceBookState = {
  selectedMakes: IMake[];
  modelsOptions: IModel[];
  selectedModels: IModel[];
  mobileZones: TZone[];
  mileageFrom: string;
  mileageTo: string;
  selectedServiceValetZones: TZone[];
  selectedEngineTypes: IEngineType[];
  jobType: TOption | null;
  appointmentType: TOption | null;
  transportationOptions: ITransportationOptionFull[];
};
