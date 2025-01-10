import { TState } from "./types";
import { createReducer } from "@reduxjs/toolkit";
import {
  getTransportationOptions,
  getTransportationOptionsShort,
  setTransportationLoading,
} from "./actions";

const initialState: TState = {
  options: [],
  isLoading: false,
  optionsShort: [],
};

export const transportationOptionsReducer = createReducer(
  initialState,
  (builder) =>
    builder
      .addCase(getTransportationOptions, (state, { payload }) => {
        return { ...state, options: payload };
      })
      .addCase(setTransportationLoading, (state, { payload }) => {
        return { ...state, isLoading: payload };
      })
      .addCase(getTransportationOptionsShort, (state, { payload }) => {
        return { ...state, optionsShort: payload };
      }),
);
