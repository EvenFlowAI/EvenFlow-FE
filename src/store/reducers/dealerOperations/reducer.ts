import { TState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  getDashboardItems,
  getCustomerCommunicationPaging,
  setCustomerCommunicationDashboardPageData,
} from './actions';
import { defaultPaging } from '../constants';

const initialState: TState = {
  dashboardItems: [],
  customerCommunicationPageData: {
    pageSize: 5,
    pageIndex: 0,
  },
  customerCommunicationPaging: { ...defaultPaging },
};

export const dealerOperationsReducer = createReducer<TState>(initialState, builder =>
  builder
    .addCase(getDashboardItems, (state, { payload }) => {
      return { ...state, dashboardItems: payload };
    })
    .addCase(setCustomerCommunicationDashboardPageData, (state, { payload }) => {
      return {
        ...state,
        customerCommunicationPageData: { ...state.customerCommunicationPageData, ...payload },
      };
    })
    .addCase(getCustomerCommunicationPaging, (state, { payload }) => {
      return { ...state, customerCommunicationPaging: payload };
    })
);
