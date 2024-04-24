export type TAdvisorPerPodCapacity = {
    id?: number;
    value: number;
    isEditable: boolean;
}

export interface IAdvisorCapacity {
    employeeId: string;
    capacityPerServiceBook: TAdvisorPerPodCapacity[]
}

export interface ITechnicianCapacity {
    employeeId: string;
    serviceBookId: number;
    efficiency: number;
    employeeName: string;
    serviceBookName: string;
    avarageBillHoursPerRO: number;
    dailyCapacity: {[key: string]: number}
}

export enum ECapacityType {
    DailyVehicles,
    AvailableBillHours,
}

export type TState = {
    advisors: IAdvisorCapacity[];
    capacityTypeOption: ECapacityType|null,
    technicians: ITechnicianCapacity[],
    isLoading: boolean;
}

export type TTechniciansResponse = {
    technicianCapacitySettings: ITechnicianCapacity[];
    capacityTypeOption: ECapacityType;
}
