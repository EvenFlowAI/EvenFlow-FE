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

type TAssignedRequest = {
    type: string | number;
    serviceRequestId: number;
}

export interface IUpdatedPackage {
    serviceRequestsAssigned: TAssignedRequest[];
    serviceRequests: number[];
    complimentaryServices: number[];
    businessRules: IBusinessRule;
    name: string,
}