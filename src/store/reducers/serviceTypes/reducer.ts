import { TState } from "./types";
import { createReducer } from "@reduxjs/toolkit";
import {
  getFirstScreenOptionsByQuery,
  setFirstScreenOptionsLoading,
} from "./actions";

const initialState: TState = {
  firstScreenOptions: [],
  isLoading: false,
  withoutOptions: false,
};

export const firstScreenOptionsReducer = createReducer(
  initialState,
  (builder) =>
    builder
      .addCase(setFirstScreenOptionsLoading, (state, { payload }) => {
        return { ...state, isLoading: payload };
      })
      .addCase(getFirstScreenOptionsByQuery, (state, { payload }) => {
        return {
          ...state,
          firstScreenOptions: payload,
          withoutOptions: !payload.length,
        };
      }),
);
