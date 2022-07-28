import {IAdvisorShort} from "../users/types";
import {IBayShort} from "../bays/types";
import {IAssignedServiceRequestShort} from "../serviceRequests/types";
import {IMake} from "../../../api/types";


export interface IPodShort {
    id: number;
    name: string;
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
    makes?: number[];
    models?: number[];
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
    makes: number[];
    models: number[];
}

export enum EJobType {
    Internal, Warranty, CustomerPay, Recall
}