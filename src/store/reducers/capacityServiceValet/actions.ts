import { createAction } from '@reduxjs/toolkit';
import {
  ICenterSettings,
  IShowDropOffTime,
  ITimeRangeAndCapacity,
  IZonesRoutingByDay,
  TDmsAppointmentTime,
  TServiceValetRequestId,
  TZonesOpsCodesRequest,
} from './types';
import { AppThunk, TArgCallback, TCallback } from '../../../types/types';

import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

export const getZonesRouting = createAction<IZonesRoutingByDay[]>(
  'ServiceValetCapacity/GetZonesRouting'
);
export const getTimeRangesAndCapacity = createAction<ITimeRangeAndCapacity[]>(
  'ServiceValetCapacity/SetTimeRangesAndCapacity'
);
export const setLoading = createAction<boolean>('ServiceValetCapacity/SetLoading');
export const getCenterSettings = createAction<ICenterSettings | null>(
  'ServiceValetCapacity/GetCenterSettings'
);
export const setLeadDayCounter = createAction<number | null>(
  'ServiceValetCapacity/SetLeadDayCounter'
);
export const setAppointmentTimeToDMS = createAction<boolean>(
  'ServiceValetCapacity/SetAppointmentTimeToDMS'
);

export const loadZonesRouting =
  (id: number, serviceType: string): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.GetZoneRouting, {
      urlParams: { id, serviceType },
    })
      .then(result => {
        dispatch(getZonesRouting(result.data.zoneRouting));
      })
      .catch(err => {
        console.log('load Zones Routing for Service Valet error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updateZonesRouting =
  (id: number, data: IZonesRoutingByDay[], serviceType: string): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.UpdateZoneRouting, {
      urlParams: { id, serviceType },
      data: { serviceType, zoneRouting: data },
    })
      .then(result => {
        if (result?.data) dispatch(loadZonesRouting(id, serviceType));
      })
      .catch(err => {
        console.log('load Zones Routing for Service Valet error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const loadCenterSettings =
  (id: number): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.GetServiceValetSettings, { urlParams: { id } })
      .then(result => {
        if (result) dispatch(getCenterSettings(result.data));
      })
      .catch(err => {
        console.log('load service valet service center settings error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const loadTimeRangesAndCapacity =
  (id: number): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.GatAllCapacity, { urlParams: { id } })
      .then(result => {
        if (result) dispatch(getTimeRangesAndCapacity(result.data));
      })
      .catch(err => {
        console.log('get Time Ranges And Capacity error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const createTimeRange =
  (
    serviceCenterId: number,
    data: ITimeRangeAndCapacity,
    onError: (err: string) => void,
    onSuccess: () => void
  ): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.CreateCapacity, { data })
      .then(result => {
        if (result) {
          dispatch(loadTimeRangesAndCapacity(serviceCenterId));
          onSuccess();
        }
      })
      .catch(err => {
        onError(err);
        console.log('get Time Ranges And Capacity error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updateTimeRange =
  (
    serviceCenterId: number,
    id: number,
    data: ITimeRangeAndCapacity,
    onError: (err: string) => void,
    onSuccess: () => void
  ): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.UpdateCapacity, { urlParams: { id }, data })
      .then(result => {
        if (result) {
          onSuccess();
          dispatch(loadTimeRangesAndCapacity(serviceCenterId));
        }
      })
      .catch(err => {
        onError(err);
        console.log('get Time Ranges And Capacity error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updateShowDropOffTime =
  (
    id: number,
    data: IShowDropOffTime,
    onSuccess: () => void,
    onError: (err: string) => void
  ): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.ChangeShowDropOffTime, { urlParams: { id }, data })
      .then(result => {
        if (result) {
          dispatch(loadCenterSettings(id));
          onSuccess();
        }
      })
      .catch(err => {
        onError(err);
        console.log('update show drop off time error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updateDmsAppointmentTime =
  (
    id: number,
    data: TDmsAppointmentTime,
    onSuccess: () => void,
    onError: (err: string) => void
  ): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.ChangeDmsTimeStamp, { urlParams: { id }, data })
      .then(result => {
        if (result) {
          dispatch(loadCenterSettings(id));
          onSuccess();
        }
      })
      .catch(err => {
        onError(err);
        console.log('update dms appointment time error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updateServiceValetServiceRequest =
  (
    id: number,
    data: TServiceValetRequestId,
    onSuccess: () => void,
    onError: (err: string) => void
  ): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.ChangeServiceRequest, { urlParams: { id }, data })
      .then(result => {
        if (result) dispatch(loadCenterSettings(id));
        onSuccess();
      })
      .catch(err => {
        onError(err);
        console.log('update service valet service request error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updateServiceValetZonesOpsCodes =
  (
    id: number,
    serviceType: string,
    zoneServiceRequests: TZonesOpsCodesRequest[],
    onSuccess: TCallback,
    onError: TArgCallback<string>
  ): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.UpdateZonesServiceRequests, {
      urlParams: { id },
      data: { serviceType, zoneServiceRequests },
    })
      .then(result => {
        if (result) {
          onSuccess();
        }
      })
      .catch(err => {
        onError(err);
        console.log('update service valet zones service requests error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updateLeadTime = (id: number, value: number) => () => {
  console.log('id', id);
  console.log('value', value);
};

export const updateAppointmentTimeToDMS = (id: number, value: boolean) => () => {
  console.log('id', id);
  console.log('value', value);
};
