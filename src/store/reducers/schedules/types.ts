import {IEmployee} from "../employees/types";
import {ParsableDate} from "../../../types/types";

enum EWorkingStatus {
    Working, NonWorking, NonActive
}
export interface ISchedule {
    id: number;
    date: ParsableDate;
    startAt: ParsableDate;
    finishAt: ParsableDate;
    isRecurring: boolean;
    status: EWorkingStatus;
    dayOfWeek?: number;
    podId?: number;
    isLastSet?: boolean;
}
export interface IEmployeeSchedule {
    employee: IEmployee,
    schedules: ISchedule[]
}

export interface IScheduleForm {
    id?: number;
    date: ParsableDate;
    startAt: ParsableDate;
    finishAt: ParsableDate;
    employeeId: string;
    serviceCenterId: number;
    podId?: number;
    isRecurring?: boolean;
}

export interface IScheduleForWeek {
    serviceCenterId: number;
    employeeId: string;
    startAt: ParsableDate;
    finishAt: ParsableDate;
    status: EWorkingStatus;
    fromDate: ParsableDate;
    toDate: ParsableDate;
    podId?: number;
}

export interface IScheduleFilters {
    searchTerm?: string;
    role?: string;
    skillLevel?: number;
    podId?: number;
}

export type TState = {
    employeesList: IEmployeeSchedule[];
    employeesLoading: boolean;
    filters: IScheduleFilters;
    filtersOpened: boolean;
}