import {createAction} from "@reduxjs/toolkit";
import {
    ICenterSettings, IShowDropOffTime,
    ITimeRangeAndCapacity,
    IZonesRoutingByDay,
    IZoneTimeReservation,
    IZoneTimeSlot, TDmsAppointmentTime, TServiceValetRequestId
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
            if (result?.data) dispatch(getZonesRouting(result.data.zoneRoutings))
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
            if (result?.data) dispatch(loadZonesRouting(id))
        })
        .catch(err => {
            console.log('load Zones Routing for Service Valet error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadCenterSettings = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.ServiceValet.GetServiceValetSettings, {urlParams: {id}})
        .then(result => {
            if (result) dispatch(getCenterSettings(result.data))
        })
        .catch(err => {
            console.log('load service valet service center settings error', err)
        })
        .finally(() => () => dispatch(setLoading(false)))
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

export const updateShowDropOffTime = (id: number, data: IShowDropOffTime, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceValet.ChangeShowDropOffTime, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadCenterSettings(id))
                onSuccess()
            }
        })
        .catch(err => {
            onError(err)
            console.log('update show drop off time error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const updateDmsAppointmentTime = (id: number, data: TDmsAppointmentTime, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceValet.ChangeDmsTimeStamp, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadCenterSettings(id))
                onSuccess()
            }
        })
        .catch(err => {
            onError(err)
            console.log('update dms appointment time error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const updateServiceValetServiceRequest = (id: number, data: TServiceValetRequestId, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceValet.ChangeServiceRequest, {urlParams: {id}, data})
        .then(result => {
            if (result) dispatch(loadCenterSettings(id))
            onSuccess()
        })
        .catch(err => {
            onError(err)
            console.log('update service valet service request error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}