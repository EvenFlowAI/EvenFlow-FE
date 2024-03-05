import {ETimeSlotType} from "../slotScoring/types";
import {EDayOfWeek} from "../offers/types";

export interface ICapacitySetting {
    id?: number;
    serviceBookName: string;
    gapSlotsType: ETimeSlotType;
    appointmentsPerSlot: number;
    appointmentLeadTime: number;
    cutOffTime?: string;
    technicianEfficiency: number;
    avarageBillHoursPerRO: number;
    advisorStaffingFactor?: string;
    serviceBookId?: number;
}

export type TCutOff = {
    day: EDayOfWeek;
    value: string;
}

export interface ICapacitySettingById {
    serviceBookName: string;
    gapSlotsType: ETimeSlotType;
    appointmentsPerSlot: number;
    appointmentLeadTime: number;
    cutOffTime: TCutOff[];
    technicianEfficiency: number;
    avarageBillHoursPerRO: number;
    advisorStaffingFactor?: boolean;
    serviceBookId?: number;
}

export interface InitialState {
    capacitySettings: ICapacitySetting[];
    currentSetting: ICapacitySettingById|null;
    isLoading: boolean;
}