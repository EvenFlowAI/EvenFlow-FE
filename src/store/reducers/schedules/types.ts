import {IEmployee} from "../employees/types";
import {ParsableDate, TParsableDate} from "../../../types/types";

enum EWorkingStatus {
    Working, NonWorking, NonActive
}
export interface ISchedule {
    id: number;
    date: TParsableDate;
    startAt: TParsableDate;
    finishAt: TParsableDate;
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
    date: TParsableDate;
    startAt: TParsableDate;
    finishAt: TParsableDate;
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
    calendarData: ICalendarItem[];
    scheduleByDate: IScheduleByDate[];
}

export interface ICalendarItem {
    date: TParsableDate;
    techniciansCount: number;
    advisorsCount: number;
}

export interface IBaseEmployeeSchedule {
    employeeId: string;
    isOnSchedule: boolean;
    startAt?: string;
    finishAt?: string;
}

export interface IEmployeeScheduledHours extends IBaseEmployeeSchedule {

}

export interface IScheduleByDate extends IBaseEmployeeSchedule {
    employeeName: string;
    role: string;
    serviceBooks: string[];
    id: number;
}

export type TTimePeriod = {
    startDate: TParsableDate|null;
    endDate: TParsableDate|null;
}

export interface IUpdateByDateRequest {
    date: TParsableDate;
    serviceCenterId: number;
    isSetForWeek: boolean;
    employeeScheduledHours: IEmployeeScheduledHours[];
}