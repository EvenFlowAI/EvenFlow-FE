import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {TEnumMap} from "../utils";
import {IAssignedServiceRequestShort} from "../serviceRequests/types";

export enum EOfferType {
    AmountOff, PercentOff, FreeService
}
export const offerTypes: TEnumMap<EOfferType>[] = [
    {id: EOfferType.AmountOff, label: "$ off"},
    {id: EOfferType.FreeService, label: "free service"},
    {id: EOfferType.PercentOff, label: "% off"},
];
export enum ECustomerSegment {
    All, New, LowValue, MediumValue, HighValue, EndOfWarranty
}
export const customerSegments: TEnumMap<ECustomerSegment>[] = [
    {id: ECustomerSegment.All, label: "All"},
    {id: ECustomerSegment.New, label: "New"},
    {id: ECustomerSegment.LowValue, label: "Low Value"},
    {id: ECustomerSegment.MediumValue, label: "Medium Value"},
    {id: ECustomerSegment.HighValue, label: "High Value"},
    {id: ECustomerSegment.EndOfWarranty, label: "End of Warranty"},
];
export enum EOfferStatus {
    None, Archived, Deleted
}
export enum EOfferState {
    Active, Disabled
}
export enum EDayOfWeek {
    Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, EveryDay, LastWeekdayInMonth
}
export const dayOfWeek: TEnumMap<EDayOfWeek>[] = [
    {id: EDayOfWeek.EveryDay, label: "Everyday"},
    {id: EDayOfWeek.LastWeekdayInMonth, label: "Last Weekday in Month"},
    {id: EDayOfWeek.Sunday, label: "Sunday"},
    {id: EDayOfWeek.Monday, label: "Monday"},
    {id: EDayOfWeek.Tuesday, label: "Tuesday"},
    {id: EDayOfWeek.Wednesday, label: "Wednesday"},
    {id: EDayOfWeek.Thursday, label: "Thursday"},
    {id: EDayOfWeek.Friday, label: "Friday"},
    {id: EDayOfWeek.Saturday, label: "Saturday"},
];
export enum ECustomerPresence {
    DropOff, Waiters, Both
}
export const customerPresence: TEnumMap<ECustomerPresence>[] = [
    {id: ECustomerPresence.DropOff, label: "Drop Off"},
    {id: ECustomerPresence.Waiters, label: "Waiters"},
    {id: ECustomerPresence.Both, label: "Both"},
];

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
    customerSegments: ECustomerSegment[];
    dayOfWeeks: EDayOfWeek[];
    duration: IDuration;
    timeOfDay: ITimeOfDay;
    serviceType: IServiceType;
    status: EOfferStatus;
    state: EOfferState;
    customerPresence: ECustomerPresence;
    isAllServiceRequestsIncluded: boolean;
    serviceCenterId: number;
    serviceRequests: IAssignedServiceRequestShort[];
}

export interface IOfferForm {
    title: string;
    value: number;
    type: EOfferType;
    customerSegments: ECustomerSegment[];
    dayOfWeeks: EDayOfWeek[];
    duration: IDuration;
    timeOfDay: ITimeOfDay;
    serviceType: IServiceType;
    customerPresence: ECustomerPresence;
    isAllServiceRequestsIncluded: boolean;
    serviceRequests: number[];
    serviceCenterId: number;
}
