import {IEmployee} from "../employees/types";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

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

export interface IScheduleFilters {
    searchTerm?: string;
    role?: string;
    skillLevel?: number;
    podId?: number;
}
type TFilterLabels = {
    [K in keyof IScheduleFilters]: string;
}
export const filterLabels: TFilterLabels = {
    searchTerm: "Search",
    role: "Employee",
    skillLevel: "Employee position",
    podId: "Pod"
}