import { TState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  getDashboardItems,
  getCustomerCommunicationPaging,
  setCustomerCommunicationDashboardPageData,
  setNewEventName,
  getTextIntegrationSettings,
  getAvailablePhoneNumberList,
} from './actions';
import { defaultPaging } from '../constants';

const initialState: TState = {
  dashboardItems: [],
  customerCommunicationPageData: {
    pageSize: 15,
    pageIndex: 0,
  },
  customerCommunicationPaging: { ...defaultPaging },
  newEventName: '',
  textIntegrationSettings: null,
  availablePhoneNumberList: [],
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
    .addCase(setNewEventName, (state, { payload }) => {
      return { ...state, newEventName: payload };
    })
    .addCase(getTextIntegrationSettings, (state, { payload }) => {
      return { ...state, textIntegrationSettings: payload };
    })
    .addCase(getAvailablePhoneNumberList, (state, { payload }) => {
      return { ...state, availablePhoneNumberList: payload };
    })
);
