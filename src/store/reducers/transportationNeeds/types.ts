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
    dayOfWeeks?: number[];
    serviceRequests?: number[];
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
        start: string;
        end: string;
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

export enum ETransportationType {
    Shuttle,
    Loaner,
    Rental,
    BookRide,
    VehiclePickUpDropOff
}

export enum ETransportationDays {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    EveryDay,
    LastWeekdayInMonth
}