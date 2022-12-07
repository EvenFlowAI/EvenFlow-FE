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
    capacity?: number;
    slotsCount?: number;
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
    dayOfWeeks: number[];
    isAllServiceRequestsIncluded?: boolean;
    serviceRequests: ITrOptionServiceTRequest[];
    capacity?: number;
    slotsCount?: number;
}

export interface INewTransportationOption {
    type: string;
    state: number;
    serviceCenterId: number;
}

export interface ITransportationOptionFull extends INewTransportationOption {
    id: number;
    description: string
    column: ETransportColumn;
    rules?: ITransportationOptionRule;
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
}

export enum ETransportColumn {
    Yes, No
}