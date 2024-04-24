export type TAdvisorPerPodBase = {
    id?: number;
    value: number;
}

export type TAdvisorPerPodCapacity = TAdvisorPerPodBase & {
    isEditable: boolean;
}

export interface IAdvisorCapacity {
    employeeId: string;
    employeeName: string;
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

export type IAdvisorsPayload = {
    serviceCenterId: number;
    capacitySettings: IAdvisorCapacity[];
}

export type TTechnicianEfficiency = {
    employeeId: string;
    efficiency: number;
    serviceBookId?: number;
}

export type ITechniciansPayload = {
    serviceCenterId: number;
    techniciansEfficiency: TTechnicianEfficiency[];
}
