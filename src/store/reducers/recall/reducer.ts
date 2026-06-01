import { createReducer } from '@reduxjs/toolkit';
import { TState } from './types';
import {
  getRecalls,
  getRecallsByVin,
  setIsEditName,
  setIsRecallAlertsTableLoading,
  setLoading,
  setRecallAlerts,
  setRecallAlertsCount,
  setRecallAlertsOrderStats,
  setRecallAlertsOrderWorkflow,
  setRecallAlertsPageData,
  setRecallCampaignInfo,
  setRecallOrder,
  setRecallPageData,
  setRecallsCount,
  setRecallSearch,
  setSelectedRecallAlert,
  setSelectedStatus,
  setUpdatedAlerts,
} from './actions';
import { RECALL_ALERTS_STATUSES } from '../../../pages/admin/DealerOperations/helper';

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
  recallAlertsOrderStats: initialOrderForRecallAlerts,
  recallAlertsOrderWorkflow: initialOrderForRecallAlerts,
  searchTerm: '',
  recallCampaignInfo: [],
  selectedStatus: RECALL_ALERTS_STATUSES[0],
  updatedAlerts: [],
  isEditName: false,
  isRecallAlertsTableLoading: false,
  selectedRecallAlert: null,
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
    .addCase(setRecallAlertsOrderStats, (state, { payload }) => {
      return { ...state, recallAlertsOrderStats: payload };
    })
    .addCase(setRecallAlertsOrderWorkflow, (state, { payload }) => {
      return { ...state, recallAlertsOrderWorkflow: payload };
    })
    .addCase(setRecallSearch, (state, { payload }) => {
      return { ...state, searchTerm: payload };
    })
    .addCase(setRecallCampaignInfo, (state, { payload }) => {
      return { ...state, recallCampaignInfo: payload };
    })
    .addCase(setSelectedStatus, (state, { payload }) => {
      return { ...state, selectedStatus: payload };
    })
    .addCase(setUpdatedAlerts, (state, { payload }) => {
      return { ...state, updatedAlerts: payload };
    })
    .addCase(setIsEditName, (state, { payload }) => {
      return { ...state, isEditName: payload };
    })
    .addCase(setIsRecallAlertsTableLoading, (state, { payload }) => {
      return { ...state, isRecallAlertsTableLoading: payload };
    })
    .addCase(setSelectedRecallAlert, (state, { payload }) => {
      return { ...state, selectedRecallAlert: payload };
    })
);
