import { createAction } from '@reduxjs/toolkit';
import {
  AppThunk,
  IOrder,
  IPageRequest,
  IPagingResponse,
  PaginatedAPIResponse,
} from '../../../types/types';
import { IGlobalRecall } from '../../../pages/admin/RecallDatabase/types';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import { globalRecalls } from '../../../pages/admin/RecallDatabase/utils';

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
    Api.call<PaginatedAPIResponse<IGlobalRecall>>(Api.endpoints.GlobalRecalls.GetGlobalRecalls, {
      params: { pageIndex, pageSize, orderBy: order.orderBy, isAscending: order.isAscending },
    })
      .then(res => {
        if (res?.data?.result) {
          dispatch(setRecallsDatabase(res.data.result));
        }
        if (res?.data?.paging) dispatch(setPaging(res.data.paging));
      })
      .catch(err => {
        console.log(err);
        dispatch(setRecallsDatabase(globalRecalls));
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
      .then(res => {
        console.log('res', res);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => dispatch(setLoading(false)));
  };
