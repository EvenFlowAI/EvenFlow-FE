import {createReducer} from "@reduxjs/toolkit";
import {IEmployeeSchedule} from "./types";
import {getEmployeesSchedule, loadingEmployeesSchedule} from "./actions";

type TState = {
    employeesList: IEmployeeSchedule[];
    employeesLoading: boolean;
}
const initialState: TState = {
    employeesList: [],
    employeesLoading: false,
}

export const schedulesReducer = createReducer(initialState, builder => builder
    .addCase(getEmployeesSchedule, (state, {payload}) => {
        return {...state, employeesList: payload};
    })
    .addCase(loadingEmployeesSchedule, (state, {payload}) => {
        return {...state, employeesLoading: payload};
    })
);