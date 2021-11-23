import {TEnumMap} from "../utils";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
export type TValuePricingLevel = {
    demandCategory: EDemandCategory;
    value: number;
}

export enum EDemandCategory {
    Low, Average, High
}
export const demandCategories: TEnumMap<EDemandCategory>[] = [
    {id: EDemandCategory.Low, label: "Low"},
    {id: EDemandCategory.Average, label: "Average"},
    {id: EDemandCategory.High, label: "High"},
];
export interface IPricingLevel {
    demandCategory: EDemandCategory;
    percentage: number;
    serviceCenterId: number;
}
export interface IRequestPricingLevel {
    serviceCenterId: number;
    serviceRequestId: number;
    values: TValuePricingLevel[];
}

export enum EWindowType {
    Window1, Window2, Window3
}
export interface ITimeWindowEl {
    type: EWindowType;
    startInHours: number;
    durationInHours?: number;
    isEligibility: boolean;
    serviceCenterId: number;
    podId?: number;
}
export enum EDay {
    Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
}
export interface IPricingSetting {
    day: EDay;
    lowPrice: number;
    averagePrice: number;
    highPrice: number;
}

export enum EDayDemand {
    Low = 0,
    High = 2
}

export const dayDemands: TEnumMap<EDayDemand>[] = [
    {id: EDayDemand.High, label: "High"},
    {id: EDayDemand.Low, label: "Low"}
];
export enum EDemandType {
    TimeOfDay, DayOfWeek, TimeOfYear
}
export interface IPricingDemand {
    demandCategory: EDemandCategory;
    type: EDemandType;
    point: number;
    serviceCenterId: number;
}
export interface IDayOfWeekSetting {
    serviceCenterId: number;
    demandCategory: EDemandCategory;
    dayOfWeek: EDay;
}

export interface ITimeOfYearSetting {
    serviceCenterId: number;
    demandCategory: EDemandCategory;
    id?: number;
    date: ParsableDate;
    comment?: string;
}