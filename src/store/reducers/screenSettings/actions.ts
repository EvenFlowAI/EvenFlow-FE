import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {TEmailRequirement} from "./types";

export const getEmailRequirement = createAction<TEmailRequirement>("ServiceCenters/getEmailRequirement");
export const setEmailRequirementLoading = createAction<boolean>("ServiceCenters/SetEmailRequirementLoading");

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