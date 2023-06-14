import {createAction} from "@reduxjs/toolkit";
import {
    IDemandSegment,
    IDemandSegmentForm,
    ISetDemandSegmentRequest,
    ITimeWindow,
    IUnplannedDemand, IUnplannedDemandBySlot,
    IUnplannedDemandRequest, IUnplannedDemandSlotsRequest, IUnplannedSlotUpdateData
} from "./types";
import {AppThunk, TArgCallback, TCallback} from "../../../types/types";
import {Api} from "../../../config/requests";

export const loadingDemandSegments = createAction<boolean>("DemandSegments/Loading");
export const getDemandSegments = createAction<IDemandSegment[]>("DemandSegments/GetDemandSegments");
export const loadDemandSegments = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    try {
        dispatch(loadingDemandSegments(true));
        const {data} = await Api.call<IDemandSegment[]>(
            Api.endpoints.AppointmentAllocation.GetDemandSegments,
            {params: {serviceCenterId, podId}}
        );
        dispatch(loadingDemandSegments(false));
        dispatch(getDemandSegments(data));
    } catch (e) {
        dispatch(loadingDemandSegments(false));
        throw e;
    }
}
export const createDemandSegment = (data: IDemandSegmentForm): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.AppointmentAllocation.CreateDemandSegment, {data});
    dispatch(loadDemandSegments(data.serviceCenterId, data.podId));
}
export const setDemandSegments = (data: ISetDemandSegmentRequest): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.AppointmentAllocation.BatchUpdateDemandSegments, {data});
    dispatch(loadDemandSegments(data.serviceCenterId, data.podId));
}
export const getTimeWindow = createAction<ITimeWindow>("DemandSegments/GetTimeWindows");
export const loadTimeWindow = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    const {data} = await Api.call<ITimeWindow>(
        Api.endpoints.AppointmentAllocation.GetTimeWindows,
        {params: {serviceCenterId, podId}}
    );
    dispatch(getTimeWindow(data));
}
export const setTimeWindow = (data: ITimeWindow): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.AppointmentAllocation.SetTimeWindows, {data});
    dispatch(loadTimeWindow(data.serviceCenterId, data.podId));
}

export const getUnplannedDemand = createAction<IUnplannedDemand[]>("DemandSegments/GetUnplannedDemands");
export const loadUnplannedDemand = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IUnplannedDemand[]>(
        Api.endpoints.AppointmentAllocation.GetUnplanned,
        {params: {serviceCenterId, podId}}
    );
    dispatch(getUnplannedDemand(data));
}
export const setUnplannedDemand = (data: IUnplannedDemandRequest): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.AppointmentAllocation.SetUnplanned, {data});
    dispatch(loadUnplannedDemand(data.serviceCenterId, data.podId));
}

export const setUnplannedLoading = createAction<boolean>("DemandSegments/SetUnplannedLoading");
export const setUnplannedSlots = createAction<IUnplannedDemandBySlot[]>("DemandSegments/SetUnplannedSlots");
export const loadUnplannedSlots = (data: IUnplannedDemandSlotsRequest): AppThunk => dispatch => {
    dispatch(setUnplannedLoading(true));
    Api.call(Api.endpoints.AppointmentAllocation.GetUnplannedSlotsByDay, {params: {...data}})
        .then(res => {
            if (res.data) dispatch(setUnplannedSlots(res.data))
        })
        .catch(err => {
            console.log('load unplanned demand slots by day error', err)
        })
        .finally(() => dispatch(setUnplannedLoading(false)));
}

export const changeUnplannedSlots = (data: IUnplannedSlotUpdateData, onError: TArgCallback<{err: string}>, onSuccess: TCallback): AppThunk => dispatch => {
    dispatch(setUnplannedLoading(true));
    Api.call(Api.endpoints.AppointmentAllocation.UpdateUnplannedSlots, {data})
        .then(res => {
            if (res.data) {
                dispatch(loadUnplannedDemand(data.serviceCenterId, data.podId))
                onSuccess()
            }
        })
        .catch(err => {
            console.log('load unplanned demand slots by day error', err)
            onError(err)
        })
        .finally(() => dispatch(setUnplannedLoading(false)));
}

export const setRecalculationLoading = createAction<boolean>("DemandSegments/RecalculationLoading")
export const recalculateCapacity = (serviceCenterId: number, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setRecalculationLoading(true))
    Api.call(Api.endpoints.CapacityManagement.Reallocate, {data: {serviceCenterId}})
        .then(res => {
            if (res) onSuccess()
        })
        .catch(err => {
            onError(err)
            console.log('reallocate capacity error', err)
        })
        .finally(() => dispatch(setRecalculationLoading(false)))
}