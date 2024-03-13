import {createAction} from "@reduxjs/toolkit";
import {AppThunk, TArgCallback, TCallback} from "../../../types/types";
import {
    IBaseCustomerConsent,
    ICustomerConsent,
    ICustomerConsentById,
    TEmailRequirement,
    TGeographicZone
} from "./types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import {EServiceType} from "../appointmentFrameReducer/types";
import {setMobileZonesShort} from "../mobileService/actions";
import {setSVZonesShort} from "../serviceValet/actions";

export const getEmailRequirement = createAction<TEmailRequirement>("ScreenSettings/getEmailRequirement");
export const setEmailRequirementLoading = createAction<boolean>("ScreenSettings/SetEmailRequirementLoading");
export const setConsentLoading = createAction<boolean>("ScreenSettings/SetConsentLoading");
export const setLoading = createAction<boolean>("ScreenSettings/SetLoading");
export const setConsentsList = createAction<ICustomerConsent[]>("ScreenSettings/SetConsentsList");
export const getCurrentConsent = createAction<ICustomerConsentById|null>("ScreenSettings/SetConsentById")

export const loadConsentsList = (serviceCenterId: number, podId?: number|null): AppThunk => (dispatch) => {
    dispatch(setConsentLoading(true));
    Api.call<ICustomerConsent[]>(Api.endpoints.CustomerConsent.GetAll, {params: {serviceCenterId, podId}})
        .then(result => {
            if (result) {
                dispatch(setConsentsList(result.data))
            }
        })
        .catch(err => {
            console.log('get categories by page error', err)
        })
        .finally(() => {
            dispatch(setConsentLoading(false));
        })
}

export const loadConsentById = (id: number): AppThunk => (dispatch) => {
    dispatch(setConsentLoading(true));
    Api.call<ICustomerConsentById>(Api.endpoints.CustomerConsent.GetById, {urlParams: {id}})
        .then(result => {
            if (result) {
                dispatch(getCurrentConsent(result.data))
            }
        })
        .catch(err => {
            console.log('get categories by page error', err)
        })
        .finally(() => {
            dispatch(setConsentLoading(false));
        })
}

export const loadEmailRequirement = (id: number): AppThunk => dispatch => {
    dispatch(setEmailRequirementLoading(true))
    Api.call<TEmailRequirement>(Api.endpoints.BookingFlowScreenSettings.GetEmailRequirement, {urlParams: {id}})
        .then(res => {
            if (res) dispatch(getEmailRequirement(res.data))
        })
        .catch(err => {
            console.log("load email requirement error", err)
        })
        .finally(() => dispatch(setEmailRequirementLoading(false)))
}

export const updateEmailRequirement = (serviceCenterId: number, data: TEmailRequirement, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setEmailRequirementLoading(true))
    const payload = {
        ...data,
        serviceCenterId,
    }
    Api.call(Api.endpoints.BookingFlowScreenSettings.UpdateEmailRequirement, {urlParams: {id: serviceCenterId}, data: payload})
        .then(res => {
            if (res) {
                dispatch(loadEmailRequirement(serviceCenterId));
                onSuccess()
            }
        })
        .catch(err => {
            console.log("update email requirement error", err)
            onError(err)
        })
        .finally(() => dispatch(setEmailRequirementLoading(false)))
}

export const loadZonesByServiceType = (serviceCenterId: number, serviceType: EServiceType, podId?: number): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call<TGeographicZone[]>(Api.endpoints.GeographicZones.GetShort, {params: {serviceType, serviceCenterId, podId}})
        .then(res => {
            if (res?.data) {
                if (serviceType === EServiceType.MobileService) {
                    dispatch(setMobileZonesShort(res.data))
                } else if (serviceType === EServiceType.PickUpDropOff) {
                    dispatch(setSVZonesShort(res.data))
                }
            }
        })
        .catch(err => {
            console.log("load zoneserror", err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const createCustomerConsent = (data: IBaseCustomerConsent, onError: TArgCallback<any>, onSuccess: TCallback): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.CustomerConsent.Create, {data})
        .then(res => {
            if (res) dispatch(loadConsentsList(data.serviceCenterId, data.podId))
            onSuccess()
        })
        .catch(err => {
            console.log('create customer consent error', err)
            onError(err)
        })
}

export const updateCustomerConsent = (data: ICustomerConsentById, onError: TArgCallback<any>, onSuccess: TCallback): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.CustomerConsent.Update, {data})
        .then(res => {
            if (res) dispatch(loadConsentsList(data.serviceCenterId, data.podId))
            onSuccess()
        })
        .catch(err => {
            console.log('update customer consent error', err)
            onError(err)
        })
}