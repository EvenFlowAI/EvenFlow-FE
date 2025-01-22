import { createReducer } from '@reduxjs/toolkit';
import { TState } from './types';
import {
  getRecalls,
  getRecallsByVin,
  setLoading,
  setRecallOrder,
  setRecallPageData,
  setRecallsCount,
  setRecallSearch,
} from './actions';

export const initialOrder = {
  orderBy: 'CampaignNumber',
  isAscending: true,
};

const initialState: TState = {
  recalls: [],
  isLoading: false,
  recallsCount: 0,
  recallPageData: {
    pageIndex: 0,
    pageSize: 10,
  },
  recallsByVin: [],
  order: initialOrder,
  searchTerm: '',
};

export const recallsReducer = createReducer(initialState, builder =>
  builder
    .addCase(getRecalls, (state, { payload }) => {
      return { ...state, recalls: payload };
    })
    .addCase(setRecallsCount, (state, { payload }) => {
      return { ...state, recallsCount: payload };
    })
    .addCase(setLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
    .addCase(setRecallPageData, (state, { payload }) => {
      return { ...state, recallPageData: { ...state.recallPageData, ...payload } };
    })
    .addCase(getRecallsByVin, (state, { payload }) => {
      return { ...state, recallsByVin: payload };
    })
    .addCase(setRecallOrder, (state, { payload }) => {
      return { ...state, order: payload };
    })
    .addCase(setRecallSearch, (state, { payload }) => {
      return { ...state, searchTerm: payload };
    })
);
