import { createReducer } from "@reduxjs/toolkit";
import { TState } from "./types";
import { getSettings, setSettingsLoading } from "./actions";

const initialState: TState = {
  settings: [],
  isLoading: false,
};
export const generalSettingsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(getSettings, (state, { payload }) => {
      return { ...state, settings: payload };
    })
    .addCase(setSettingsLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    }),
);
