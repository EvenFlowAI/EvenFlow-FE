import { createAction } from '@reduxjs/toolkit';
import {
  AppThunk,
  IOrder,
  IPageRequest,
  IPagingResponse,
  IPagingUpdatedResponse,
} from '../../../types/types';
import { GlobalRecallComponent, IGlobalRecall } from '../../../pages/admin/RecallDatabase/types';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import dayjs from 'dayjs';

export const setPaging = createAction<IPagingResponse>('RecallDatabase/SetPaging');
export const setLoading = createAction<boolean>('RecallDatabase/SetLoading');
export const setRecallsDatabase = createAction<IGlobalRecall[]>(
  'RecallDatabase/setRecallsDatabase'
);
export const setManufacturers = createAction<string[]>('RecallDatabase/setManufcaturers');

export const loadRecallsDatabase =
  (
    pageData: IPageRequest,
    order: IOrder<IGlobalRecall>,
    searchTerm: string,
    manufacturer: string[],
    date: [dayjs.Dayjs | null, dayjs.Dayjs | null]
  ): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    const { pageIndex, pageSize } = pageData;

    Api.call(Api.endpoints.GlobalRecalls.GetGlobalRecalls, {
      params: {
        pageIndex,
        pageSize,
        orderBy: order.orderBy,
        isAscending: order.isAscending,
        searchTerm: searchTerm ? searchTerm : undefined,
        manufacturers: manufacturer.length ? manufacturer.join('&') : undefined,
        startDate: date[0]?.isValid() ? date[0].format('YYYY-MM-DDTHH:mm:ss[Z]') : undefined,
        endDate: date[1]?.isValid() ? date[1].format('YYYY-MM-DDTHH:mm:ss[Z]') : undefined,
      },
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

export const getManufacturers = (): AppThunk => dispatch => {
  Api.call(Api.endpoints.GlobalRecalls.GetManufacturers)
    .then(response => {
      if (response?.data?.data) {
        dispatch(setManufacturers(response.data.data));
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const getRecallComponent =
  (id: number, onSuccess: (recall: GlobalRecallComponent) => void): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GlobalRecalls.GetRecallComponent, {
      urlParams: { id },
    })
      .then(response => {
        if (response.data.data) {
          onSuccess(response?.data?.data);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => dispatch(setLoading(false)));
  };
