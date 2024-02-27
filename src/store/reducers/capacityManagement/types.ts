export interface ICapacitySetting {
    id: number;
    serviceBookName: string;
    slotsGap: number;
    appointmentsPerSlot: number;
    appointmentLeadTime: number;
    appointmentCutOff: string;
    technicianEfficiency: number;
    averageBillHours: number;
    advisorStaffingFactor: boolean;
}

export interface InitialState {
    capacitySettings: ICapacitySetting[];
    isLoading: boolean;
}