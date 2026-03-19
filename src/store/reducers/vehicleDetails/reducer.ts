import { createReducer } from '@reduxjs/toolkit';
import {
  getEngineType,
  getMakes,
  getMileage,
  setCurrentMake,
  setLoading,
  setPaging,
  setMakeOrder,
  setGlobalMakes,
  setGlobalModels,
  setPageData,
  setAllMakes,
  setMakeCodes,
} from './actions';
import { TState } from './types';
import { defaultPaging, defaultPageData } from '../constants';

const initialState: TState = {
  makes: [],
  allMakes: [],
  paging: { ...defaultPaging },
  pageData: { ...defaultPageData },
  order: { orderBy: 'OrderIndex', isAscending: true },
  currentMake: null,
  isLoading: false,
  mileage: [],
  engineTypes: [],
  globalMakes: [],
  globalModels: [],
  makesModels: [],
  makeCodes: [],
};

export const vehicleDetailsReducer = createReducer<TState>(initialState, builder =>
  builder
    .addCase(getMakes, (state, { payload }) => {
      return { ...state, makes: payload };
    })
    .addCase(setAllMakes, (state, { payload }) => {
      return { ...state, allMakes: payload };
    })
    .addCase(setCurrentMake, (state, { payload }) => {
      return { ...state, currentMake: payload };
    })
    .addCase(setPaging, (state, { payload }) => {
      return { ...state, paging: payload };
    })
    .addCase(setPageData, (state, { payload }) => {
      return { ...state, pageData: { ...state.pageData, ...payload } };
    })
    .addCase(setLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
    .addCase(getMileage, (state, { payload }) => {
      return { ...state, mileage: payload };
    })
    .addCase(getEngineType, (state, { payload }) => {
      return { ...state, engineTypes: payload };
    })
    .addCase(setMakeOrder, (state, { payload }) => {
      return { ...state, order: payload };
    })
    .addCase(setGlobalMakes, (state, { payload }) => {
      return { ...state, globalMakes: payload };
    })
    .addCase(setGlobalModels, (state, { payload }) => {
      return { ...state, globalModels: payload };
    })
    .addCase(setMakeCodes, (state, { payload }) => {
      return { ...state, makeCodes: payload };
    })
);
