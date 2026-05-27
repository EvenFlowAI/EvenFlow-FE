import { createReducer } from '@reduxjs/toolkit';
import { TState } from './types';
import {
  getRecalls,
  getRecallsByVin,
  setLoading,
  setRecallAlerts,
  setRecallAlertsCount,
  setRecallAlertsOrder,
  setRecallAlertsPageData,
  setRecallCampaignInfo,
  setRecallOrder,
  setRecallPageData,
  setRecallsCount,
  setRecallSearch,
} from './actions';

export const initialOrder = {
  orderBy: 'CampaignNumber',
  isAscending: true,
};

export const initialOrderForRecallAlerts = {
  orderBy: 'Name',
  isAscending: true,
};

const initialState: TState = {
  recalls: [],
  recallAlerts: [],
  isLoading: false,
  recallsCount: 0,
  recallAlertsCount: 0,
  recallPageData: {
    pageIndex: 0,
    pageSize: 10,
  },
  recallAlertsPageData: {
    pageIndex: 0,
    pageSize: 10,
  },
  recallsByVin: [],
  order: initialOrder,
  recallAlertsOrder: initialOrderForRecallAlerts,
  searchTerm: '',
  recallCampaignInfo: [],
};

export const recallsReducer = createReducer(initialState, builder =>
  builder
    .addCase(getRecalls, (state, { payload }) => {
      return { ...state, recalls: payload };
    })
    .addCase(setRecallAlerts, (state, { payload }) => {
      return { ...state, recallAlerts: payload };
    })
    .addCase(setRecallsCount, (state, { payload }) => {
      return { ...state, recallsCount: payload };
    })
    .addCase(setRecallAlertsCount, (state, { payload }) => {
      return { ...state, recallAlertsCount: payload };
    })
    .addCase(setLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
    .addCase(setRecallPageData, (state, { payload }) => {
      return { ...state, recallPageData: { ...state.recallPageData, ...payload } };
    })
    .addCase(setRecallAlertsPageData, (state, { payload }) => {
      return { ...state, recallAlertsPageData: { ...state.recallAlertsPageData, ...payload } };
    })
    .addCase(getRecallsByVin, (state, { payload }) => {
      return { ...state, recallsByVin: payload };
    })
    .addCase(setRecallOrder, (state, { payload }) => {
      return { ...state, order: payload };
    })
    .addCase(setRecallAlertsOrder, (state, { payload }) => {
      return { ...state, recallAlertsOrder: payload };
    })
    .addCase(setRecallSearch, (state, { payload }) => {
      return { ...state, searchTerm: payload };
    })
    .addCase(setRecallCampaignInfo, (state, { payload }) => {
      return { ...state, recallCampaignInfo: payload };
    })
);
