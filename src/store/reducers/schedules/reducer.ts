import {createReducer} from "@reduxjs/toolkit";
import {IEmployeeSchedule, IScheduleFilters} from "./types";
import {getEmployeesSchedule, loadingEmployeesSchedule, setScheduleFilters, switchScheduleFilters} from "./actions";

type TState = {
    employeesList: IEmployeeSchedule[];
    employeesLoading: boolean;
    filters: IScheduleFilters;
    filtersOpened: boolean;
}
const initialState: TState = {
    employeesList: [],
    employeesLoading: false,
    filtersOpened: false,
    filters: {}
}

export const schedulesReducer = createReducer(initialState, builder => builder
    .addCase(getEmployeesSchedule, (state, {payload}) => {
        return {...state, employeesList: payload};
    })
    .addCase(loadingEmployeesSchedule, (state, {payload}) => {
        return {...state, employeesLoading: payload};
    })
    .addCase(switchScheduleFilters, (state, {payload}) => {
        return {...state, filtersOpened: payload};
    })
    .addCase(setScheduleFilters, (state, {payload}) => {
        return {...state, filters: {...state.filters, ...payload}};
    })
);