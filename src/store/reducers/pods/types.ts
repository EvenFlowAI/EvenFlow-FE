import {IAdvisorShort} from "../users/types";
import {IBayShort} from "../bays/types";
import {IAssignedServiceRequestShort} from "../serviceRequests/types";
import {IEngineType} from "../vehicleDetails/types";

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
}

export type TPodTransportation = {
    id: number;
    type: string;
}

export interface IPod {
    id: number;
    name: string;
    serviceCenterId: number;
    description?: string;
    advisorId?: string;
    advisor?: IAdvisorShort;
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
}
export interface IPodFilters {
    searchTerm: string;
    advisorId: string;
}

export interface IPodForm {
    serviceCenterId: number;
    name: string;
    description?: string;
    advisorId?: string | null;
    technicians?: string[];
    serviceRequests?: number[];
    bays?: number[];
    vehicleMakes: number[];
    vehicleModels: number[];
    jobType?: EJobType;
    appointmentType?: EAppointmentType;
    mobileZones?: number[];
    serviceValetZones?: number[];
    engineTypes?:number[];
    isVisitCenter: boolean;
    transportationOptionIds?: number[];
}

export enum EJobType {
    Internal, Warranty, CustomerPay, Recall
}

export enum EAppointmentType {
    MaintenanceOnly, RepairOnly, Mixed
}