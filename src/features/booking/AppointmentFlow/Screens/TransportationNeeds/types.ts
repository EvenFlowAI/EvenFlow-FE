import {
  IVehicleForSlots,
  MPOptionShort,
  TRecallForRequest,
} from '../../../../../store/reducers/appointment/types';
import { IServiceRequestIds } from '../../../../../api/types';

export type TTransportationData = {
  serviceCenterId: number;
  serviceRequests: IServiceRequestIds[];
  serviceCategories: IServiceRequestIds[];
  appointmentHashKey?: string;
  recalls: TRecallForRequest[];
  maintenancePackageOption: MPOptionShort | null;
  vehicle: IVehicleForSlots;
};
