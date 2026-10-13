import { createReducer } from '@reduxjs/toolkit';
import { TState } from './types';
import {
  setDmsConfiguration,
  setDmsConfigurationLoading,
  setDmsConfigurationQuery,
} from './actions';

const initialState: TState = {
  configuration: null,
  query: null,
  isLoading: false,
};

export const dmsConfigurationReducer = createReducer(initialState, builder =>
  builder
    .addCase(setDmsConfigurationLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
    .addCase(setDmsConfiguration, (state, { payload }) => {
      return { ...state, configuration: payload };
    })
    .addCase(setDmsConfigurationQuery, (state, { payload }) => {
      return { ...state, query: payload };
    })
);
