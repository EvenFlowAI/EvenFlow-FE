import {IBusinessRule} from "../../../api/types";

export interface IPackageOption {
    serviceRequestPrice: number;
    complimentaryServicePrice: number;
    serviceRequestLaborHours: number;
    complimentaryServiceLaborHours: number;
    serviceRequests: number[];
    complimentaryServices: number[];
    type: string | number;
}

export type TAssignedRequest = {
    type: string | number;
    serviceRequestId: number;
}

export interface IUpdatedPackage {
    serviceRequestsAssigned: TAssignedRequest[];
    serviceRequests: number[];
    complimentaryServices: number[];
    businessRules?: IBusinessRule;
    name: string,
    isApplyBusinessRules?: boolean;
}

export interface INewPackage {
    serviceRequestsAssigned: TAssignedRequest[];
    serviceRequests: number[];
    complimentaryServices: number[];
    businessRules?: IBusinessRule;
    name: string,
    isApplyBusinessRules?: boolean;
    serviceCenterId?: number;
}

export interface IComplimentaryServiceByQuery {
    id: number;
    name: string;
    price: number;
    code: string;
    durationInHours: number;
    laborAmount: number;
    partsAmount: number;
    serviceRequestId: number;
}

export interface IPackageShort {
    id: number;
    name: string;
    isApplyPricingOptimization: boolean;
    baseMarketPrice: number;
    valueMarketPrice: number;
    preferredMarketPrice: number;
}

export interface IPackageOptionShort {
    id: number;
    name: string;
    maintenancePackageId: number;
    maintenancePackageName: string;
    isApplyPricingOptimization: boolean;
    baseMarketPrice: number;
    valueMarketPrice: number;
    preferredMarketPrice: number;
}