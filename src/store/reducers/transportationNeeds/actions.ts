import { createAction } from '@reduxjs/toolkit';
import {
  ITransportationOptionFull,
  ITransportationOptionRules,
  TTransportationShort,
} from './types';
import { AppThunk, TArgCallback, TCallback } from '../../../types/types';

import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import { enqueueSnackbar } from 'notistack';
export const getTransportationOptionsShort = createAction<TTransportationShort[]>(
  'TransportationNeeds/GetOptionsShort'
);
export const setTransportationLoading = createAction<boolean>('TransportationNeeds/SetLoading');
export const getTransportationOptions = createAction<ITransportationOptionFull[]>(
  'TransportationNeeds/GetOptions'
);


export const loadTransportationOptions =
  (serviceCenterId: number): AppThunk =>
  dispatch => {
    dispatch(setTransportationLoading(true));
    Api.call(Api.endpoints.TransportationOptions.Get, { params: { serviceCenterId } })
      .then(result => {
        if (result.data) {
          dispatch(getTransportationOptions(result.data));
        }
      })
      .catch(err => {
        console.log('load transportation needs error', err);
      })
      .finally(() => dispatch(setTransportationLoading(false)));
  };

export const updateTransportationOption =
  (data: ITransportationOptionFull): AppThunk =>
  dispatch => {
    Api.call(Api.endpoints.TransportationOptions.Edit, { data })
      .then(result => {
        if (result) {
          dispatch(loadTransportationOptions(data.serviceCenterId));
        }
      })
      .catch(err => {
        enqueueSnackbar(
          (err as any).response?.data?.message || 'An error occurred while processing your request',
          {
            variant: 'error',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          }
        );
      });
  };

export const editTransportationOptionRules =
  (
    optionId: number,
    serviceCenterId: number,
    data: ITransportationOptionRules,
    successCallback = () => {},
    errorCallback = (err: { code: number; errorMessage: string }) => {}
  ): AppThunk =>
  dispatch => {
    Api.call(Api.endpoints.TransportationOptions.Rules, { urlParams: { id: optionId }, data })
      .then(result => {
        if (result) {
          dispatch(loadTransportationOptions(serviceCenterId));
          successCallback();
        }
      })
      .catch(err => {
        errorCallback(err);
        console.log('edit transportation option rules error', err);
      });
  };

export const updateTransportationDescription =
  (
    optionId: number,
    data: ITransportationOptionFull,
    onSuccess: () => void,
    onError: TArgCallback<any>
  ): AppThunk =>
  dispatch => {
    Api.call(Api.endpoints.TransportationOptions.UpdateById, { urlParams: { id: optionId }, data })
      .then(result => {
        if (result) {
          dispatch(loadTransportationOptions(data.serviceCenterId));
          onSuccess();
        }
      })
      .catch(err => {
        onError(err);
        console.log('update transportation description error', err);
      });
  };

export const loadTransportationOptionsShort =
  (serviceCenterId: number, podId?: number): AppThunk =>
  dispatch => {
    dispatch(setTransportationLoading(true));
    Api.call(Api.endpoints.TransportationOptions.GetShort, { params: { serviceCenterId, podId } })
      .then(result => {
        if (result.data) {
          dispatch(getTransportationOptionsShort(result.data));
        }
      })
      .catch(err => {
        console.log('load transportation options short error', err);
      })
      .finally(() => dispatch(setTransportationLoading(false)));
  };

export const updateTransportationIcon =
  (
    id: number,
    serviceCenterId: number,
    file: File,
    onError: TArgCallback<any>,
    onSuccess: TCallback
  ): AppThunk =>
  dispatch => {
    const data = new FormData();
    data.append('file', file, file.name);
    Api.call(Api.endpoints.TransportationOptions.UpdateIcon, { urlParams: { id }, data })
      .then(result => {
        if (result) {
          dispatch(loadTransportationOptions(serviceCenterId));
          onSuccess();
        }
      })
      .catch(err => {
        onError(err);
        console.log('update transportation option icon error', err);
      });
  };
