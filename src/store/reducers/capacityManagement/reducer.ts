import { InitialState } from "./types";
import { createReducer } from "@reduxjs/toolkit";
import { getCapacitySettings, setCurrentSetting, setLoading } from "./actions";

const initialState: InitialState = {
  capacitySettings: [],
  currentSetting: null,
  isLoading: false,
};

export const capacityManagementReducer = createReducer(
  initialState,
  (builder) =>
    builder
      .addCase(setLoading, (state, { payload }) => {
        return { ...state, isLoading: payload };
      })
      .addCase(getCapacitySettings, (state, { payload }) => {
        return { ...state, capacitySettings: payload };
      })
      .addCase(setCurrentSetting, (state, { payload }) => {
        return { ...state, currentSetting: payload };
      }),
);
