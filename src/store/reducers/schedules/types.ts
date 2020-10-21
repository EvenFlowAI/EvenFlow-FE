import {IEmployee} from "../employees/types";

export interface ISchedule {

}
export interface IEmployeeSchedule {
    employee: IEmployee,
    schedules: ISchedule[]
}