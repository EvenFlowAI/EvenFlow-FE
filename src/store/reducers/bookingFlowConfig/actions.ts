import {createAction} from "@reduxjs/toolkit";
import {TServiceTypeSettings} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const setBookingFlowConfig = createAction<TServiceTypeSettings[]>("BookingFlowConfig/SetConfig");
export const setBookingFlowConfigLoading = createAction<boolean>("BookingFlowConfig/SetLoading");

export const loadBookingFlowConfig = (id: number): AppThunk => dispatch => {
    dispatch(setBookingFlowConfigLoading(true));
    Api.call(Api.endpoints.BookingFlowConfig.Get, {urlParams: {id}})
        .then(result => {
            if (result?.data) dispatch(setBookingFlowConfig(result.data))
        })
        .catch(err => {
            console.log('get booking flow config err', err)
        })
        .finally(() => dispatch(setBookingFlowConfigLoading(false)))
}

export const updateBookingFlowConfig = (id: number, config: TServiceTypeSettings[], onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setBookingFlowConfigLoading(true));
    Api.call(Api.endpoints.BookingFlowConfig.Update, {urlParams: {id}, data: {settings: config}})
        .then(result => {
            if (result) {
                dispatch(loadBookingFlowConfig(id));
                onSuccess();
            }
        })
        .catch(err => {
            console.log('update booking flow config err', err);
            onError(err);
        })
        .finally(() => dispatch(setBookingFlowConfigLoading(false)))
}