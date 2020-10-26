import {IEmployee} from "../employees/types";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

export interface ISchedule {
    id: number;
    date: ParsableDate;
    startAt: ParsableDate;
    finishAt: ParsableDate;
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
}

export interface IScheduleFilters {
    searchTerm?: string;
    role?: string;
    skillLevel?: number;
    podId?: number;
}