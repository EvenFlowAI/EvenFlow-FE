import { createAction } from '@reduxjs/toolkit';
import {
  EDay,
  IDemandSegment,
  IDemandSegmentForm,
  ISetDemandSegmentRequest,
  ITimeWindow,
  IUnplannedDemand,
  IUnplannedDemandBySlot,
  IUnplannedDemandRequest,
  IUnplannedDemandSlotsRequest,
  IUnplannedSlotUpdateData,
} from './types';
import { AppThunk, TArgCallback, TCallback } from '../../../types/types';

import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import { DemandCapacityI } from '../../../features/admin/UnplannedDemand/types';

export const loadingDemandSegments = createAction<boolean>('DemandSegments/Loading');
export const getDemandSegments = createAction<IDemandSegment[]>('DemandSegments/GetDemandSegments');
export const loadDemandSegments =
  (serviceCenterId: number, podId?: number): AppThunk =>
  async dispatch => {
    try {
      dispatch(loadingDemandSegments(true));
      const { data } = await Api.call<IDemandSegment[]>(
        Api.endpoints.AppointmentAllocation.GetDemandSegments,
        { params: { serviceCenterId, podId } }
      );
      dispatch(loadingDemandSegments(false));
      dispatch(getDemandSegments(data));
    } catch (e) {
      dispatch(loadingDemandSegments(false));
      console.log('loadDemandSegments', e);
    }
  };
export const createDemandSegment =
  (data: IDemandSegmentForm): AppThunk =>
  async dispatch => {
    try {
      await Api.call(Api.endpoints.AppointmentAllocation.CreateDemandSegment, { data });
      dispatch(loadDemandSegments(data.serviceCenterId, data.podId));
    } catch (err) {
      console.log('create demand segment err', err);
    }
  };
export const setDemandSegments =
  (data: ISetDemandSegmentRequest): AppThunk =>
  async dispatch => {
    try {
      await Api.call(Api.endpoints.AppointmentAllocation.BatchUpdateDemandSegments, { data });
      dispatch(loadDemandSegments(data.serviceCenterId, data.podId));
    } catch (err) {
      console.log('set demand segments err', err);
    }
  };
export const getTimeWindow = createAction<ITimeWindow>('DemandSegments/GetTimeWindows');
export const setTimeWindowsLoading = createAction<boolean>('DemandSegments/SetTimeWindowsLoading');
export const loadTimeWindow =
  (serviceCenterId: number, podId?: number): AppThunk =>
  async dispatch => {
    dispatch(setTimeWindowsLoading(true));
    try {
      const { data } = await Api.call<ITimeWindow>(
        Api.endpoints.AppointmentAllocation.GetTimeWindows,
        { params: { serviceCenterId, podId } }
      );
      dispatch(getTimeWindow(data));
    } catch (err) {
      console.log('load time window err', err);
    } finally {
      dispatch(setTimeWindowsLoading(false));
    }
  };
export const setTimeWindow =
  (data: ITimeWindow): AppThunk =>
  async dispatch => {
    try {
      await Api.call(Api.endpoints.AppointmentAllocation.SetTimeWindows, { data });
      dispatch(loadTimeWindow(data.serviceCenterId, data.podId));
    } catch (err) {
      console.log('set time window err', err);
    }
  };

export const getUnplannedDemand = createAction<IUnplannedDemand[]>(
  'DemandSegments/GetUnplannedDemands'
);
export const getDemandCapacity = createAction<DemandCapacityI[]>(
  'DemandSegments/getDemandCapacity'
);
export const loadUnplannedDemand =
  (serviceCenterId: number, podId?: number, onSuccess?: () => void): AppThunk =>
  async dispatch => {
    try {
      const { data } = await Api.call<IUnplannedDemand[]>(
        Api.endpoints.AppointmentAllocation.GetUnplanned,
        { params: { serviceCenterId, podId } }
      );
      dispatch(getUnplannedDemand(data));
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log('load unplanned demand err', err);
    }
  };

export const loadDemandCapacity =
  (serviceCenterId: number, podId?: number, onSuccess?: () => void): AppThunk =>
  async dispatch => {
    try {
      const { data } = await Api.call<DemandCapacityI[]>(
        Api.endpoints.AppointmentAllocation.GetCapacity,
        { params: { serviceCenterId, podId } }
      );
      dispatch(getDemandCapacity(data));
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log('load unplanned demand err', err);
    }
  };

export const setUnplannedDemand =
  (data: IUnplannedDemandRequest): AppThunk =>
  async dispatch => {
    await Api.call(Api.endpoints.AppointmentAllocation.SetUnplanned, { data });
    dispatch(loadUnplannedDemand(data.serviceCenterId, data.podId));
  };

export const setUnplannedLoading = createAction<boolean>('DemandSegments/SetUnplannedLoading');
export const setUnplannedSlots = createAction<IUnplannedDemandBySlot[]>(
  'DemandSegments/SetUnplannedSlots'
);
export const loadUnplannedSlots =
  (data: IUnplannedDemandSlotsRequest): AppThunk =>
  dispatch => {
    dispatch(setUnplannedLoading(true));
    Api.call(Api.endpoints.AppointmentAllocation.GetUnplannedSlotsByDay, { params: { ...data } })
      .then(res => {
        if (res.data) dispatch(setUnplannedSlots(res.data));
      })
      .catch(err => {
        console.log('load unplanned demand slots by day error', err);
      })
      .finally(() => dispatch(setUnplannedLoading(false)));
  };

export const changeUnplannedSlots =
  (
    data: IUnplannedSlotUpdateData,
    onError: TArgCallback<{ err: string }>,
    onSuccess: TCallback
  ): AppThunk =>
  dispatch => {
    dispatch(setUnplannedLoading(true));
    Api.call(Api.endpoints.AppointmentAllocation.UpdateUnplannedSlots, { data })
      .then(res => {
        if (res.data) {
          dispatch(loadUnplannedDemand(data.serviceCenterId, data.podId));
          onSuccess();
        }
      })
      .catch(err => {
        console.log('load unplanned demand slots by day error', err);
        onError(err);
      })
      .finally(() => dispatch(setUnplannedLoading(false)));
  };

export const setRecalculationLoading = createAction<boolean>('DemandSegments/RecalculationLoading');
export const recalculateCapacity =
  (serviceCenterId: number, onSuccess: () => void, onError: (err: string) => void): AppThunk =>
  dispatch => {
    dispatch(setRecalculationLoading(true));
    Api.call(Api.endpoints.CapacityManagement.Reallocate, { data: { serviceCenterId } })
      .then(res => {
        if (res) onSuccess();
      })
      .catch(err => {
        onError(err);
        console.log('reallocate capacity error', err);
      })
      .finally(() => dispatch(setRecalculationLoading(false)));
  };
