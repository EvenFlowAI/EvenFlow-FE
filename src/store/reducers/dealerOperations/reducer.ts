import { TState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  getDashboardItems,
  getCustomerCommunicationPaging,
  setCustomerCommunicationDashboardPageData,
  setNewEventName,
  getTextIntegrationSettings,
  getAvailablePhoneNumberList,
  setTextMessage,
  setEventForTextConfiguration,
  setEventIdForRulesConfiguration,
  setUpdatedEventsName,
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
  textMessage: '',
  eventForTextConfiguration: null,
  eventIdForRulesConfiguration: null,
  updatedEventsName: [],
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
    .addCase(setTextMessage, (state, { payload }) => {
      return { ...state, textMessage: payload };
    })
    .addCase(setEventForTextConfiguration, (state, { payload }) => {
      return { ...state, eventForTextConfiguration: payload };
    })
    .addCase(setEventIdForRulesConfiguration, (state, { payload }) => {
      return { ...state, eventIdForRulesConfiguration: payload };
    })
    .addCase(setUpdatedEventsName, (state, { payload }) => {
      return { ...state, updatedEventsName: payload };
    })
);
