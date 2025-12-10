import { IAdvisorShort } from '../users/types';
import { IBayShort } from '../bays/types';
import { IAssignedServiceRequestShort } from '../serviceRequests/types';
import { IEngineType } from '../vehicleDetails/types';
import { IPageRequest, IPagingResponse } from '../../../types/types';

export interface IPodVehicleMake {
  id: number;
  name: string;
}

export interface IPodVehicleModel {
  id: number;
  name: string;
}

export interface IPodShort {
  id: number;
  name: string;
}

export type TPodZone = {
  id: number;
  name: string;
};

export type TPodTransportation = {
  id: number;
  type: string;
};

export type TPodMileage = {
  from?: number;
  to?: number;
};

export interface IPod {
  id: number;
  name: string;
  serviceCenterId: number;
  description?: string;
  advisorId?: string;
  advisors: IAdvisorShort[];
  bays?: IBayShort[];
  technicians?: IAdvisorShort[];
  serviceRequests?: IAssignedServiceRequestShort[];
  vehicleMakes?: IPodVehicleMake[];
  vehicleModels?: IPodVehicleModel[];
  jobType?: EJobType;
  mobileZones?: TPodZone[];
  serviceValetZones?: TPodZone[];
  appointmentType?: EAppointmentType;
  engineTypes?: IEngineType[];
  isVisitCenter?: boolean;
  transportationOptions?: TPodTransportation[];
  mileageFrom?: number;
  mileageTo?: number;
}
export interface IPodFilters {
  searchTerm: string;
  advisorId: string;
}

export interface IPodForm {
  serviceCenterId: number;
  name: string;
  description?: string;
  advisors?: string[];
  technicians?: string[];
  serviceRequests?: number[];
  bays?: number[];
  vehicleMakes: number[];
  vehicleModels: number[];
  jobType?: EJobType;
  appointmentType?: EAppointmentType;
  mobileZones?: number[];
  serviceValetZones?: number[];
  engineTypes?: number[];
  isVisitCenter: boolean;
  transportationOptionIds?: number[];
  mileageFrom?: number;
  mileageTo?: number;
}

export enum EJobType {
  Internal,
  Warranty,
  CustomerPay,
  Recall,
}

export enum EAppointmentType {
  MaintenanceOnly,
  RepairOnly,
  Mixed,
}

export enum EFilterMode {
  Mixed,
  Only,
}

export type TState = {
  podsList: IPod[];
  podsLoading: boolean;
  podsPaging: IPagingResponse;
  podsPageData: IPageRequest;
  podsFilters: IPodFilters;
  shortPodsList: IPodShort[];
  selectedPod: IPodShort | null;
  podById: IPod | null;
  summary: IPodSummary[];
};

export enum EPodSummaryOption {
  OpsCodes,
  ServiceType,
  Make,
  Model,
  Mileage,
  EngineType,
  ServiceValet,
  MobileService,
  TransportOptions,
  Advisors,
}

export interface IPodSummary {
  serviceBookId: number;
  options: EPodSummaryOption[];
  serviceBookName?: string;
  orderIndex?: number;
}

export interface IPodSummaryLocal extends IPodSummary {
  prevOrder: number;
}

export type TPodOrder = {
  id: number;
  orderIndex: number;
};
