import { createAction } from '@reduxjs/toolkit';
import { DashboardItemI } from './types';
import { AppThunk, IPageRequest, IPagingResponse } from '../../../types/types';
import { data } from '../../../TEMP_DATA';
import { ActionCreator } from 'redux';

export const getDashboardItems = createAction<DashboardItemI[]>(
  'DealerOperations/GetDashboardItems'
);

export const setDealerOperationsPageData = createAction<Partial<IPageRequest>>(
  'Optimizer/DealerOperationsSetPageData'
);
export const getDealerOperationsPaging = createAction<IPagingResponse>(
  'Optimizer/GetDealerOperationsPaging'
);

export const loadDashboardItems =
  (serviceCenterId: number): AppThunk =>
  async (dispatch, getState) => {
    const { dealerOperationsPageData } = getState().dealerOperations;

    console.log('loadDashboardItems -> serviceCenterId', serviceCenterId);
    dispatch(getDashboardItems(data.result));
    dispatch(getDealerOperationsPaging(data.paging));
    if (
      data.paging.numberOfPages > 0 &&
      data.paging.numberOfPages < dealerOperationsPageData.pageIndex + 1
    ) {
      dispatch(
        setDealerOperationsPageData({
          ...dealerOperationsPageData,
          pageIndex: data.paging.numberOfPages - 1,
        })
      );
    }
  };

export const changeDealerOperationsPageData: ActionCreator<AppThunk> = (
  payload: Partial<IPageRequest>
) => {
  return async dispatch => {
    console.log(payload);
    await dispatch(setDealerOperationsPageData(payload));
  };
};
