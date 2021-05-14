import {IAdvisorShort} from "../users/types";
import {IBayShort} from "../bays/types";
import {IAssignedServiceRequestShort} from "../serviceRequests/types";


export interface IPodShort {
    id: number;
    name: string;
}
export interface IPod {
    id: number;
    name: string;
    description?: string;
    advisorId?: string;
    advisor?: IAdvisorShort;
    bays?: IBayShort[];
    technicians?: IAdvisorShort[];
    serviceRequests?: IAssignedServiceRequestShort[];
    serviceCenterId: number;
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
}