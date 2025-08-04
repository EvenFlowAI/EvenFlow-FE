import { TState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import { getDashboardItems, getDealerOperationsPaging } from './actions';
import { setPageData } from '../packages/actions';
import { defaultPaging } from '../constants';

const initialState: TState = {
  dashboardItems: [],
  dealerOperationsPageData: {
    pageSize: 5,
    pageIndex: 0,
  },
  dealerOperationsPaging: { ...defaultPaging },
};

export const dealerOperationsReducer = createReducer<TState>(initialState, builder =>
  builder
    .addCase(getDashboardItems, (state, { payload }) => {
      return { ...state, dashboardItems: payload };
    })
    .addCase(setPageData, (state, { payload }) => {
      return {
        ...state,
        dealerOperationsPageData: { ...state.dealerOperationsPageData, ...payload },
      };
    })
    .addCase(getDealerOperationsPaging, (state, { payload }) => {
      return { ...state, dealerOperationsPaging: payload };
    })
);
