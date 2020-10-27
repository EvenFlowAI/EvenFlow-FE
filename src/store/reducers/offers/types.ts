import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

export enum EOfferType {
    AmountOff, PercentOff, FreeService
}
export enum ECustomerSegment {
    All, New, LowValue, MediumValue, HighValue, EndOfWarranty
}
export enum EOfferStatus {
    None, Archived, Deleted
}
export enum EOfferState {
    Active, Disabled
}
export enum EDayOfWeek {
    Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, EveryDay, LastWeekdayInMonth
}
export enum ECustomerPresence {
    DropOff, Waiters, Both
}

export interface IDuration {
    start: ParsableDate;
    end: ParsableDate;
}
export interface ITimeOfDay {
    start: ParsableDate;
    end: ParsableDate;
}
export interface IServiceType {
    name: string;
}

export interface IOffer {
    id: number;
    title: string;
    value: number;
    type: EOfferType;
    customerSegment: ECustomerSegment;
    dayOfWeeks: EDayOfWeek[];
    duration: IDuration;
    timeOfDay: ITimeOfDay;
    serviceType: IServiceType;
    status: EOfferStatus;
    state: EOfferState;
    customerPresence: ECustomerPresence;
    isAllServiceRequestsIncluded: boolean;
    serviceCenterId: number;
}

export interface IOfferForm {
    title: string;
    value: number;
    type: EOfferType;
    customerSegment: ECustomerSegment;
    dayOfWeeks: EDayOfWeek[];
    duration: IDuration;
    timeOfDay: ITimeOfDay;
    serviceType: IServiceType;
    customerPresence: ECustomerPresence;
    isAllServiceRequestsIncluded: boolean;
    serviceRequests: number[];
    serviceCenterId: number;
}
