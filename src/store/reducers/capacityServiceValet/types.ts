import {EPricingDisplayType} from "../pricingSettings/types";

export enum EDaysFromMonday {
    Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
}

export interface IZoneRouting {
    id: number;
    name: string;
}

export interface IZonesRoutingByDay {
    dayOfWeek: EDaysFromMonday;
    geographicZoneIds: number[]
}

export enum EZoneTimeGap {
    Small = 15, Medium = 30, Large = 60
}

export enum ETimeWindows {
    Timewindow1,
    Timewindow2,
    Timewindow3,
    Timewindow4,
    Timewindow5,
    Timewindow6,
    Timewindow7,
    Timewindow8,
    Timewindow9,
    Timewindow10,
    Timewindow11,
    Timewindow12,
    DropOffPeriod,
    NotAvailable

}

export interface IZoneTimeWindow {
    id: number;
    zoneId: number;
    zoneName: string;
    timeSlotType: EZoneTimeGap;
    timeWindow: ETimeWindows;
    start: string;
}

export interface IZoneForTimeSlot {
    zoneId: number;
    zoneName: string;
    timeSlotType: EZoneTimeGap;
    timeWindow: ETimeWindows;
}

export interface IZoneTimeSlot {
    id: number;
    start: string;
    zones: IZoneForTimeSlot[];
}

export interface ITimeWindowReservation {
    start: string;
    end: string;
    timeWindowType: ETimeWindows;
    reservationsCount: number;
}

export interface IZoneTimeReservation {
    id: number;
    zoneId: number;
    zoneName: string;
    timeWindows: ITimeWindowReservation[];
}

export interface ITimeRangeAndCapacity {
    serviceCenterId: number;
    id?: number;
    dayOfWeek?: number;
    pickUpMin: string;
    pickUpMax: string;
    dropOffMin: string;
    dropOffMax: string;
    capacity: number;
}

export interface ICenterSettingsSR {
    id: number;
    code: string;
    description: string;
    price: number;
    pricingDisplayType: EPricingDisplayType;
}

export interface ICenterSettings {
    showDropOffTime: boolean;
    dropOffTimeDescription?: string;
    dmsAppointmentTime?: string;
    serviceRequest?: ICenterSettingsSR;
}

export interface IShowDropOffTime {
    showDropOffTime: boolean;
    description?: string;
}

export type TDmsAppointmentTime = {
    dmsAppointmentTime: string;
}

export type TServiceValetRequestId = {
    serviceRequestId: number;
}