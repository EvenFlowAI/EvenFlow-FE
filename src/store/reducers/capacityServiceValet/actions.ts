import {createAction} from "@reduxjs/toolkit";
import {
    ICenterSettings,
    ITimeRangeAndCapacity,
    IZonesRoutingByDay,
    IZoneTimeReservation,
    IZoneTimeSlot
} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getZonesRouting = createAction<IZonesRoutingByDay[]>('ServiceValetCapacity/GetZonesRouting');
export const setZoneTimeWindows = createAction<IZoneTimeSlot[]>('ServiceValetCapacity/SetZoneTimeWindows');
export const setZoneCapacity = createAction<IZoneTimeReservation[]>('ServiceValetCapacity/SetZoneCapacity');
export const getTimeRangesAndCapacity = createAction<ITimeRangeAndCapacity[]>('ServiceValetCapacity/SetTimeRangesAndCapacity');
export const setLoading = createAction<boolean>('ServiceValetCapacity/SetLoading');
export const getCenterSettings = createAction<ICenterSettings|null>('ServiceValetCapacity/GetCenterSettings');

export const loadZonesRouting = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.ServiceValet.GetZoneRouting, {urlParams: {id}})
        .then(result => {
            if (result?.data) dispatch(getZonesRouting(result.data))
        })
        .catch(err => {
            console.log('load Zones Routing for Service Valet error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const updateZonesRouting = (id: number, data: IZonesRoutingByDay): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.ServiceValet.UpdateZoneRouting, {urlParams: {id}, data: {zoneRoutings: [data]}})
        .then(result => {
            if (result?.data) dispatch(getZonesRouting(result.data))
        })
        .catch(err => {
            console.log('load Zones Routing for Service Valet error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadCenterSettings = (serviceCenterId: number): AppThunk => dispatch => {

}


export const loadTimeRangesAndCapacity = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.GatAllCapacity, {urlParams: {id}})
        .then(result => {
            if (result) dispatch(getTimeRangesAndCapacity(result.data))
        })
        .catch(err => {
            console.log('get Time Ranges And Capacity error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const createTimeRange = (serviceCenterId: number, data: ITimeRangeAndCapacity, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.CreateCapacity, {data})
        .then(result => {
            if (result) {
                dispatch(getTimeRangesAndCapacity(result.data))
                onSuccess();
                dispatch(loadTimeRangesAndCapacity(serviceCenterId))
            }
        })
        .catch(err => {
            console.log('get Time Ranges And Capacity error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const updateTimeRange = (serviceCenterId:number, id: number, data: ITimeRangeAndCapacity, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.ServiceValet.UpdateCapacity, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(getTimeRangesAndCapacity(result.data))
                dispatch(loadTimeRangesAndCapacity(serviceCenterId))
                onSuccess();
            }
        })
        .catch(err => {
            onError(err)
            console.log('get Time Ranges And Capacity error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}