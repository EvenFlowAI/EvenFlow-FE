import { TState } from "./types";
import { createReducer } from "@reduxjs/toolkit";
import {
  getAdvisorsCapacity,
  getCapacityTypeOption,
  getTechniciansCapacity,
  setDateRange,
  setLoading,
  setSettingLoading,
} from "./actions";

const initialState: TState = {
  isLoading: false,
  advisors: [],
  technicians: [],
  capacityTypeOption: null,
  isSettingLoading: false,
  dateRange: {
    from: null,
    to: null,
  },
};

export const employeesCapacity = createReducer(initialState, (builder) =>
  builder
    .addCase(setLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
    .addCase(setSettingLoading, (state, { payload }) => {
      return { ...state, isSettingLoading: payload };
    })
    .addCase(setDateRange, (state, { payload }) => {
      return { ...state, dateRange: payload };
    })
    .addCase(getAdvisorsCapacity, (state, { payload }) => {
      return { ...state, advisors: payload };
    })
    .addCase(getTechniciansCapacity, (state, { payload }) => {
      return { ...state, technicians: payload };
    })
    .addCase(getCapacityTypeOption, (state, { payload }) => {
      return { ...state, capacityTypeOption: payload };
    }),
);
