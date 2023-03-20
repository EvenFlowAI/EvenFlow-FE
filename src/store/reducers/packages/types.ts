import {EMaintenanceOptionType, IBusinessRule} from "../../../api/types";
import {EPricingDisplayType} from "../pricingSettings/types";

export type TAssignedRequest = {
    type: string | number;
    serviceRequestId: number;
    code?: string;
}

export interface IUpdatedPackage {
    serviceRequestsAssigned: TAssignedRequest[];
    serviceRequests: number[];
    complimentaryServices: number[];
    businessRules?: IBusinessRule;
    name: string,
    engineTypes: number[];
    isApplyBusinessRules?: boolean;
}

export interface INewPackage {
    serviceRequestsAssigned: TAssignedRequest[];
    serviceRequests: number[];
    complimentaryServices: number[];
    businessRules?: IBusinessRule;
    name: string,
    isApplyBusinessRules?: boolean;
    engineTypes: number[];
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
    pricingDisplayType: EPricingDisplayType;
}

export interface IPackageOptionShort {
    maintenancePackageOptionId: number;
    maintenancePackageOptionName: string;
    maintenancePackageId: number;
    maintenancePackageName: string;
    type: EMaintenanceOptionType;
}

export type TOrderIndex = {
    id: number;
    orderIndex: number;
}