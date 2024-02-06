import {createAction} from "@reduxjs/toolkit";
import {IEmployeeSchedule, IScheduleFilters, IScheduleForm} from "./types";
import {AppThunk} from "../../../types/types";
import {getStartEndDates} from "../../../utils/utils";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import dayjs from "dayjs";

export const switchScheduleFilters = createAction<boolean>("Schedules/SwitchFilters");
export const setScheduleFilters = createAction<Partial<IScheduleFilters>>("Schedules/SetFilters");
export const getEmployeesSchedule = createAction<IEmployeeSchedule[]>("Schedules/GetEmployees");
export const loadingEmployeesSchedule = createAction<boolean>("Schedule/EmployeesLoading");

export const loadEmployeesSchedule = (start: string, end: string, serviceCenterId: number): AppThunk => async (dispatch, getState) => {
    dispatch(loadingEmployeesSchedule(true));
    try {
        const {data} = await Api.call<IEmployeeSchedule[]>(
            Api.endpoints.EmployeeSchedule.GetAll,
            {data: {start, end, serviceCenterId, ...getState().employeesSchedule.filters}}
        );
        dispatch(getEmployeesSchedule(data));
    } finally {
        dispatch(loadingEmployeesSchedule(false));
    }
}
export const setEmployeesSchedule = (data: IScheduleForm, isXS: boolean): AppThunk => async dispatch => {
    await Api.call(
        data.id ? Api.endpoints.EmployeeSchedule.Update : Api.endpoints.EmployeeSchedule.Create,
        {data, urlParams: {id: data.id}}
    );
    const [st, nd] = getStartEndDates(dayjs(data.date), isXS);
    dispatch(loadEmployeesSchedule(st, nd, data.serviceCenterId));
}