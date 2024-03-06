import {createAction} from "@reduxjs/toolkit";
import {AppThunk, TArgCallback, TCallback} from "../../../types/types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import {ICustomerConsent} from "./types";

export const setLoading = createAction<boolean>("CustomerConsent/SetLoading");
export const setConsentsList = createAction<ICustomerConsent[]>("CustomerConsent/SetConsentsList");

export const loadConsentsList = (serviceCenterId: number, podId?: number): AppThunk => (dispatch) => {
    dispatch(setLoading(true));
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
            dispatch(setLoading(false));
        })
}