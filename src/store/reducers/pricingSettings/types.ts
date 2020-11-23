import {TEnumMap} from "../utils";

export enum EDemandCategory {
    Low, Average, High
}
export interface IPricingLevel {
    demandCategory: EDemandCategory;
    percentage: number;
    serviceCenterId: number;
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
    High, Low
}

export const dayDemands: TEnumMap<EDayDemand>[] = [
    {id: EDayDemand.High, label: "High"},
    {id: EDayDemand.Low, label: "Low"}
];