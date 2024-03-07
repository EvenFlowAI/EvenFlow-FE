import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../types/types";
import {ICustomerConsent, TEmailRequirement} from "./types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";

export const getEmailRequirement = createAction<TEmailRequirement>("ScreenSettings/getEmailRequirement");
export const setEmailRequirementLoading = createAction<boolean>("ScreenSettings/SetEmailRequirementLoading");
export const setConsentLoading = createAction<boolean>("ScreenSettings/SetConsentLoading");
export const setConsentsList = createAction<ICustomerConsent[]>("ScreenSettings/SetConsentsList");

export const loadConsentsList = (serviceCenterId: number, podId?: number): AppThunk => (dispatch) => {
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