import { TState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  getAllMakes,
  getAllModels,
  getMakes,
  getMakesStatistics,
  getModels,
  getModelsStatistics,
  setLoading,
  setModelsPaging,
  setPaging,
} from './actions';
import { defaultPaging } from '../constants';

const initialState: TState = {
  allMakesOptions: [],
  allModelsOptions: [],
  isLoading: false,
  makes: [],
  makesPagination: defaultPaging,
  makesStatistic: null,
  models: [],
  modelsPagination: defaultPaging,
  modelsStatistic: null,
};

export const globalVehiclesReducer = createReducer(initialState, builder =>
  builder
    .addCase(getMakes, (state, { payload }) => {
      return { ...state, makes: payload };
    })
    .addCase(setPaging, (state, { payload }) => {
      return { ...state, makesPagination: payload };
    })
    .addCase(setLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
    .addCase(getAllMakes, (state, { payload }) => {
      return { ...state, allMakesOptions: payload };
    })
    .addCase(getMakesStatistics, (state, { payload }) => {
      return { ...state, makesStatistic: payload };
    })
    .addCase(getModels, (state, { payload }) => {
      return { ...state, models: payload };
    })
    .addCase(getAllModels, (state, { payload }) => {
      return { ...state, allModelsOptions: payload };
    })
    .addCase(getModelsStatistics, (state, { payload }) => {
      return { ...state, modelsStatistic: payload };
    })
    .addCase(setModelsPaging, (state, { payload }) => {
      return { ...state, modelsPagination: payload };
    })
);
