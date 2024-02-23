import {createAction} from "@reduxjs/toolkit";
import {
    ICalendarItem,
    IEmployeeSchedule,
    IScheduleByDate,
    IScheduleFilters,
    IScheduleForm,
    IUpdateByDateRequest
} from "./types";
import {AppThunk, TParsableDate} from "../../../types/types";
import {getStartEndDates} from "../../../utils/utils";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import dayjs from "dayjs";
import {loading} from "../employees/actions";

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

export const getScheduleCalendar = createAction<ICalendarItem[]>("Employees/GetCalendarData");
export const getScheduleByDate = createAction<IScheduleByDate[]>("Employees/GetScheduleByDate");

export const loadScheduleCalendar = (serviceCenterId: number, startDate: string, endDate: string): AppThunk => dispatch => {
    dispatch(loading(true))
    Api.call<ICalendarItem[]>(Api.endpoints.EmployeeSchedule.GetCalendarSummary, {data: {serviceCenterId, startDate, endDate}})
        .then(result => {
            if (result.data) dispatch(getScheduleCalendar(result.data))
        })
        .catch(err => {
            console.log('load schedule calendar', err)
        })
        .finally(() => dispatch(loading(false)))
}

export const loadScheduleByDate = (serviceCenterId: number, date: TParsableDate): AppThunk => dispatch => {
    dispatch(loading(true))
    Api.call<IScheduleByDate[]>(Api.endpoints.EmployeeSchedule.GetByDate, {params: {date, serviceCenterId}})
        .then(result => {
            if (result.data) {
                dispatch(getScheduleByDate(result.data))
            }
        })
        .catch(err => {
            console.log('load schedule by date', err)
        })
        .finally(() => dispatch(loading(false)))
}

export const updateScheduleByDate = (data: IUpdateByDateRequest, onSuccess: () => void, onError: (err: any) => void): AppThunk => dispatch => {
    dispatch(loading(true))
    Api.call(Api.endpoints.EmployeeSchedule.UpdateByDate, {data})
        .then(result => {
            if (result) {
                dispatch(loadScheduleByDate(data.serviceCenterId, data.date))
                onSuccess()
            }
        })
        .catch(err => {
            console.log('update schedule by date error', err)
            onError(err)
        })
        .finally(() => dispatch(loading(false)))
}