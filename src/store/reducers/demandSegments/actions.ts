import {createAction} from "@reduxjs/toolkit";
import {
    IDemandSegment,
    IDemandSegmentForm,
    ISetDemandSegmentRequest,
    ITimeWindow,
    IUnplannedDemand,
    IUnplannedDemandRequest
} from "./types";
import {AppThunk} from "../../../types/types";
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