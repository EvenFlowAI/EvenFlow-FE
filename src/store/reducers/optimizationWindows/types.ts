import {EDay} from "../demandSegments/types";

export enum EOptimizationWindowType {
    FirstAvailable, SpecificDate, DemandSegments,
    OverbookingFactor, AppointmentsPerSlot, AppointmentCutoff, MaxPriceDateRange
}
export interface IOptimizationWindow {
    type: EOptimizationWindowType;
    value: number;
    serviceCenterId: number;
    podId?: number;
}

export const optimizationWindowsList: EOptimizationWindowType[] = [
    EOptimizationWindowType.FirstAvailable,
    EOptimizationWindowType.SpecificDate,
    EOptimizationWindowType.DemandSegments,
    EOptimizationWindowType.AppointmentsPerSlot,
    EOptimizationWindowType.AppointmentCutoff,
    EOptimizationWindowType.MaxPriceDateRange,
];
export type TOptContentData = {
        helperText: string;
        label: string;
        title: string;
        prefix?: string;
        suffix?: string;
    }
export type TOptContent = {
    [k in EOptimizationWindowType]: TOptContentData;
}

export interface IOverbookingFactor {
    day: EDay;
    overbookingFactorValue?: number;
    noShowRate: number;
    dayOfCancellations: number;
    combined: number;
    serviceCenterId: number;
    podId?: number;
}
export interface IAppointmentCutoff {
    day: EDay;
    value: string;
    serviceCenterId: number;
    podId?: number;
}

export type TSlotSettings = {
    serviceCenterId: number;
    appointmentSlotText: string;
    podId?: number|null;
    appointmentSlotTextHex?: string;
    appointmentSlotBoxHex?: string;
    rolloverDescriptionText?: string;
}

export interface IWaitlistConfig {
    isEnabled: boolean;
    slotSettings: TSlotSettings|null;
}

export type TWaitlistRequest = {
    serviceCenterId: number;
    podId?: number
}

export interface TWaitListRequest extends TSlotSettings {
    isEnabled: boolean;
}