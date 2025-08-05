import { createAction } from '@reduxjs/toolkit';
import { DashboardItemI } from './types';
import { AppThunk, IPageRequest, IPagingResponse } from '../../../types/types';
import { ActionCreator } from 'redux';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

export const getDashboardItems = createAction<DashboardItemI[]>(
  'DealerOperations/GetDashboardItems'
);

export const setCustomerCommunicationDashboardPageData = createAction<Partial<IPageRequest>>(
  'Optimizer/setCustomerCommunicationDashboardPageData'
);
export const getCustomerCommunicationPaging = createAction<IPagingResponse>(
  'Optimizer/getCustomerCommunicationPaging'
);

export const loadDashboardItems =
  (serviceCenterId: number): AppThunk =>
  async (dispatch, getState) => {
    const { customerCommunicationPageData } = getState().dealerOperations;
    const data = {
      serviceCenterId,
      pageIndex: customerCommunicationPageData.pageIndex,
      pageSize: customerCommunicationPageData.pageSize,
    };

    Api.call(Api.endpoints.DealerOperations.GetEvents, { params: data })
      .then(response => {
        if (response?.data) {
          dispatch(getDashboardItems(response.data.result));
          dispatch(getCustomerCommunicationPaging(response.data.paging));
          if (
            response.data.paging.numberOfPages > 0 &&
            response.data.paging.numberOfPages < customerCommunicationPageData.pageIndex + 1
          ) {
            dispatch(
              setCustomerCommunicationDashboardPageData({
                ...customerCommunicationPageData,
                pageIndex: response.data.paging.numberOfPages - 1,
              })
            );
          }
        } else {
          console.log('No data with events');
        }
      })
      .catch(e => {
        console.log('Loading dashboard items error', e);
      });
  };

export const createCustomerEvent =
  (data: { serviceCenterId: number; name: string }, onClose: () => void): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.DealerOperations.CreateEvent, {
      data,
    })
      .then(() => {
        dispatch(loadDashboardItems(data.serviceCenterId));
        onClose();
      })
      .catch(e => {
        console.log('Creating Customer Event error', e);
      });
  };

export const changeDealerOperationsPageData: ActionCreator<AppThunk> = (
  payload: Partial<IPageRequest>
) => {
  return async dispatch => {
    await dispatch(setCustomerCommunicationDashboardPageData(payload));
  };
};
