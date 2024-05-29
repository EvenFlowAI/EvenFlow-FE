import {EServiceType, EUserType} from "../appointmentFrameReducer/types";
import {EDay} from "../demandSegments/types";

export type TEmailRequirement = {
    adminAndEmployeesEnabled: boolean;
    customerSelfServiceEnabled: boolean;
}

export enum EScreenSettingsType {
    EmailRequirement, CustomerConsent, PriceDisplay, Waitlist
}

export const screenSettingsList: EScreenSettingsType[] = [
    EScreenSettingsType.EmailRequirement,
    EScreenSettingsType.CustomerConsent,
    EScreenSettingsType.PriceDisplay,
    EScreenSettingsType.Waitlist,
];

export type TOptContentData = {
    helperText: string;
    label: string;
    title: string;
    isLoading: boolean;
    prefix?: string;
    suffix?: string;
}
export type TOptContent = {
    [k in EScreenSettingsType]: TOptContentData;
}

export interface ICustomerConsent {
    id: number;
    name: string;
    isEnabled: boolean;
}

export type TGeographicZone = {
    id: number;
    name: string;
    serviceType: EServiceType;
}

export type TState = {
    emailRequirement: TEmailRequirement | null;
    isEmailRequirementLoading: boolean;
    consentsList: ICustomerConsent[];
    isConsentLoading: boolean;
    isLoading: boolean;
    currentConsent: ICustomerConsentById|null;
}

export enum ECustomerType {
    New}

export interface IBaseCustomerConsent {
    serviceCenterId: number;
     podId: number|null;
     name: string;
     title: string;
     makeIds: number[];
     modelIds: number[];
     modelYearFrom: number|null;
     modelYearTo: number|null;
     customerType: EUserType|null;
     serviceRequestIds: number[];
     serviceBookIds: number[];
     appointmentTimeFrom: string;
     appointmentTimeTo: string;
     daysOfWeek: EDay[];
     advisorIds: string[];
     transportationOptionIds: number[];
     mobileServiceZoneIds: number[];
     serviceValetZoneIds: number[];
     isWaitlistEnabled: boolean;
     message: string;
}

export interface ICustomerConsentById extends IBaseCustomerConsent {
    id: number;
    isEnabled?: boolean;
}