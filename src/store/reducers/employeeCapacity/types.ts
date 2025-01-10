import { TParsableDate } from "../../../types/types";

export type TAdvisorPerPodBase = {
  id?: number;
  value: number;
};

export type TAdvisorPerPodCapacity = TAdvisorPerPodBase & {
  isEditable: boolean;
};

export interface IAdvisorCapacity {
  employeeId: string;
  employeeName: string;
  localId?: number;
  capacityPerServiceBook: TAdvisorPerPodCapacity[];
}

export interface ITechnicianCapacity {
  employeeId: string;
  serviceBookId: number;
  efficiency: number;
  employeeName: string;
  serviceBookName: string;
  avarageBillHoursPerRO: number;
  dailyCapacity: { [key: string]: number };
  localId: number;
}

export enum ECapacityType {
  DailyVehicles,
  AvailableBillHours,
}

export type TCapacityDateRange = {
  from: TParsableDate;
  to: TParsableDate;
};

export type TState = {
  advisors: IAdvisorCapacity[];
  capacityTypeOption: ECapacityType | null;
  technicians: ITechnicianCapacity[];
  isLoading: boolean;
  dateRange: TCapacityDateRange;
  isSettingLoading: boolean;
};

export type TTechniciansResponse = {
  technicianCapacitySettings: ITechnicianCapacity[];
  capacityTypeOption: ECapacityType;
};

export type TCapacitySettingPayload = {
  employeeId: string;
  capacityPerServiceBook: TAdvisorPerPodBase[];
};

export type TAdvisorCapacityPayload = {
  serviceCenterId: number;
  capacitySettings: TCapacitySettingPayload[];
};

export type IAdvisorsPayload = {
  serviceCenterId: number;
  capacitySettings: IAdvisorCapacity[];
};

export type TTechnicianEfficiency = {
  employeeId: string;
  efficiency: number;
  serviceBookId?: number;
};

export type ITechniciansPayload = {
  serviceCenterId: number;
  techniciansEfficiency: TTechnicianEfficiency[];
};
