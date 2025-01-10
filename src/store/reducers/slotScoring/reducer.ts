import { createReducer } from "@reduxjs/toolkit";
import { TState } from "./types";
import {
  getDesirability,
  getOptimizationSettings,
  getProximity,
  getRange,
  setLoading,
} from "./actions";

const initialState: TState = {
  isLoading: false,
  proximity: [],
  desirability: [],
  optimizationSettings: [],
  slotRange: null,
};

export const slotScoringReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(getProximity, (state, { payload }) => {
      return { ...state, proximity: payload };
    })
    .addCase(getDesirability, (state, { payload }) => {
      return { ...state, desirability: payload };
    })
    .addCase(getOptimizationSettings, (state, { payload }) => {
      return { ...state, optimizationSettings: payload };
    })
    .addCase(getRange, (state, { payload }) => {
      return { ...state, slotRange: payload };
    })
    .addCase(setLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    }),
);
