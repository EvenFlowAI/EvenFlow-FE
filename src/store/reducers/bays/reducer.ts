import { createReducer } from '@reduxjs/toolkit';
import {
  getAllBays,
  getBaysShort,
  getFilteredBays,
  loading,
  saving,
  setAllLoading,
  setAllPaging,
  setPageData,
  setPaging,
} from './actions';
import { TState } from './types';
import { defaultPageData, defaultPaging } from '../constants';

const initialState: TState = {
  allBays: [],
  bays: [],
  allLoading: false,
  allPaging: { ...defaultPaging },
  saving: false,
  loading: false,
  pageData: { ...defaultPageData },
  paging: { ...defaultPaging },
  baysShort: [],
};

export const baysReducer = createReducer<TState>(initialState, builder =>
  builder
    .addCase(getAllBays, (state, { payload }) => {
      return { ...state, allBays: payload };
    })
    .addCase(getFilteredBays, (state, { payload }) => {
      return { ...state, bays: payload };
    })
    .addCase(setPaging, (state, { payload }) => {
      return { ...state, paging: payload };
    })
    .addCase(setAllPaging, (state, { payload }) => {
      return { ...state, allPaging: payload };
    })
    .addCase(setAllLoading, (state, { payload }) => {
      return { ...state, allLoading: payload };
    })
    .addCase(setPageData, (state, { payload }) => {
      return { ...state, pageData: { ...state.pageData, ...payload } };
    })
    .addCase(loading, (state, { payload }) => {
      return { ...state, loading: payload };
    })
    .addCase(saving, (state, { payload }) => {
      return { ...state, saving: payload };
    })
    .addCase(getBaysShort, (state, { payload }) => {
      return { ...state, baysShort: payload };
    })
);
