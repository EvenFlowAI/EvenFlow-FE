import { createReducer } from "@reduxjs/toolkit";
import { TState } from "./types";
import {
  getEmployeesSchedule,
  getScheduleByDate,
  getScheduleCalendar,
  loadingEmployeesSchedule,
  setScheduleFilters,
  switchScheduleFilters,
} from "./actions";

const initialState: TState = {
  employeesList: [],
  employeesLoading: false,
  filtersOpened: false,
  filters: {},
  calendarData: [],
  scheduleByDate: [],
};

export const schedulesReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(getEmployeesSchedule, (state, { payload }) => {
      return { ...state, employeesList: payload };
    })
    .addCase(loadingEmployeesSchedule, (state, { payload }) => {
      return { ...state, employeesLoading: payload };
    })
    .addCase(switchScheduleFilters, (state, { payload }) => {
      return { ...state, filtersOpened: payload };
    })
    .addCase(setScheduleFilters, (state, { payload }) => {
      return { ...state, filters: { ...state.filters, ...payload } };
    })
    .addCase(getScheduleCalendar, (state, { payload }) => {
      return { ...state, calendarData: payload };
    })
    .addCase(getScheduleByDate, (state, { payload }) => {
      return { ...state, scheduleByDate: payload };
    }),
);
