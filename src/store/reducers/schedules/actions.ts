import {createAction} from "@reduxjs/toolkit";
import {IEmployeeSchedule} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getEmployeesSchedule = createAction<IEmployeeSchedule[]>("Schedules/GetEmployees");
export const loadingEmployeesSchedule = createAction<boolean>("Schedule/EmployeesLoading");

export const loadEmployeesSchedule = (start: string, end: string, serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    dispatch(loadingEmployeesSchedule(true));
    try {
        const {data} = await Api.call<IEmployeeSchedule[]>(
            Api.endpoints.EmployeeSchedule.GetAll,
            {data: {start, end, serviceCenterId, podId}}
        );
        dispatch(getEmployeesSchedule(data));
    } finally {
        dispatch(loadingEmployeesSchedule(false));
    }
}