import {ETimeSlotType} from "../slotScoring/types";

export interface ICapacitySetting {
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

export interface InitialState {
    capacitySettings: ICapacitySetting[];
    isLoading: boolean;
}