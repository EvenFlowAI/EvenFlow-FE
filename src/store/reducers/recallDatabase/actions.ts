import { createAction } from '@reduxjs/toolkit';
import {
  AppThunk,
  IOrder,
  IPageRequest,
  IPagingResponse,
  IPagingUpdatedResponse,
} from '../../../types/types';
import { IGlobalRecall } from '../../../pages/admin/RecallDatabase/types';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

export const setPaging = createAction<IPagingResponse>('RecallDatabase/SetPaging');
export const setLoading = createAction<boolean>('RecallDatabase/SetLoading');
export const setRecallsDatabase = createAction<IGlobalRecall[]>(
  'RecallDatabase/setRecallsDatabase'
);

export const loadRecallsDatabase =
  (pageData: IPageRequest, order: IOrder<IGlobalRecall>): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    const { pageIndex, pageSize } = pageData;
    Api.call(Api.endpoints.GlobalRecalls.GetGlobalRecalls, {
      params: { pageIndex, pageSize, orderBy: order.orderBy, isAscending: order.isAscending },
    })
      .then(response => {
        if (response?.data?.data) {
          dispatch(setRecallsDatabase(response.data.data));
        }
        if (response?.data?.meta?.paging) {
          const paging: IPagingUpdatedResponse = response?.data?.meta?.paging;
          dispatch(
            setPaging({
              numberOfPages: paging.numberOfPages,
              numberOfRecords: paging.total,
            })
          );
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const upsertBookingRecallComponent =
  (id: number, recallComponentBookingFlow: string): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GlobalRecalls.GlobalRecallCampaign, {
      urlParams: { id },
      data: { recallComponentBookingFlow },
    })
      .then(() => {})
      .catch(err => {
        console.log(err);
      })
      .finally(() => dispatch(setLoading(false)));
  };
