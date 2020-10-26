import {createAction} from "@reduxjs/toolkit";
import {IEmployeeSchedule, IScheduleFilters, IScheduleForm} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {getStartEndDates} from "../../../components/Optimizer/EmployeeSchedule/utils";
import moment from "moment";

export const switchScheduleFilters = createAction<boolean>("Schedules/SwitchFilters");
export const setScheduleFilters = createAction<Partial<IScheduleFilters>>("Schedules/SetFilters");
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
export const setEmployeesSchedule = (data: IScheduleForm): AppThunk => async dispatch => {
    await Api.call(
        data.id ? Api.endpoints.EmployeeSchedule.Update : Api.endpoints.EmployeeSchedule.Create,
        {data, urlParams: {id: data.id}}
    );
    const [st, nd] = getStartEndDates(moment(data.date));
    dispatch(loadEmployeesSchedule(st, nd, data.serviceCenterId, data.podId));
}