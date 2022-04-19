import {EMaintenanceOptionType, IBusinessRule} from "../../../api/types";
import {EPricingDisplayType} from "../pricingSettings/types";

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
    pricingDisplayType: EPricingDisplayType;
}

export interface IPackageOptionShort {
    maintenancePackageOptionId: number;
    maintenancePackageOptionName: string;
    maintenancePackageId: number;
    maintenancePackageName: string;
    type: EMaintenanceOptionType;
}