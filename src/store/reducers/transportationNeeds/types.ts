export interface IEditedTransportationOption {
    type: number;
    state: number;
    serviceCenterId: number;
}

export interface ITransportationOptionRules {
    isAllServiceRequestsIncluded?: boolean;
    duration?: {
        start: string;
        end: string;
    };
    timeOfDay?: {
        start: any;
        end: any;
    };
    customerSegments?: ECustomerSegment[];
    dayOfWeeks: string[];
}

export type TTimeObject = {
    hours: number;
    minutes: number;
    seconds: number;
}

export interface ITrOptionServiceTRequest {
    id: number;
    code: string;
    description: string;
    priority: string | number;
    price: number;
}

export interface ITransportationOptionRule {
    id: number;
    transportationOptionId: number;
    duration: {
        start: string;
        end: string;
    };
    timeOfDay: {
        start: TTimeObject;
        end: TTimeObject;
    };
    customerSegments: string[];
    dayOfWeeks: string[];
    isAllServiceRequestsIncluded?: boolean;
    serviceRequests: ITrOptionServiceTRequest[];
}

export interface ITransportationOptionFull {
    id: number;
    type: string;
    state: string;
    serviceCenterId: number;
    rules: ITransportationOptionRule,
}

export enum ECustomerSegment {
    All,
    New,
    LowValue,
    MediumValue,
    HighValue,
    EndOfWarranty
}