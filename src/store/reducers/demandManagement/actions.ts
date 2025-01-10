import { createAction } from '@reduxjs/toolkit';
import { IBaseDemandPrediction, IDemandPrediction } from './types';
import { AppThunk } from '../../../types/types';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

export const setLoading = createAction<boolean>('DemandManagement/SetLoading');
export const getSettings = createAction<IDemandPrediction[]>('DemandManagement/GetSettings');

export const loadDemandManagementSettings =
  (serviceCenterId: number): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.DemandManagement.GetSettings, { params: { serviceCenterId } })
      .then(res => {
        if (res.data) dispatch(getSettings(res.data));
      })
      .catch(err => {
        console.log('load demand management settings error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updateDemandManagementSettings =
  (data: IBaseDemandPrediction): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.DemandManagement.UpdateSettings, { data })
      .then(res => {
        if (data.serviceCenterId) dispatch(loadDemandManagementSettings(data.serviceCenterId));
      })
      .catch(err => {
        console.log('update demand management settings error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };
