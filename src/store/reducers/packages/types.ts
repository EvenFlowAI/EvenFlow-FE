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
    businessRules: IBusinessRule;
    name: string,
    isApplyBusinessRules?: boolean;
}

export interface IBusinessRuleWhileCreating {
    vehicleMakes: string[] | [];
    vehicleModels: string[] | [];
    vehicleYearRange: {
        from: number | undefined;
        to: number | undefined;
    };
    vehicleMileageRange: {
        from: number | undefined;
        to: number | undefined;
    };
    customerCriteria?: string | number;
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
}