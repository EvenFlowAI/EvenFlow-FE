import {createAction} from "@reduxjs/toolkit";
import {IBookingFlowConfig} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const setBookingFlowConfig = createAction<IBookingFlowConfig>("BookingFlowConfig/SetConfig");
export const setBookingFlowConfigLoading = createAction<boolean>("BookingFlowConfig/SetLoading");

export const loadBookingFlowConfig = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(setBookingFlowConfigLoading(true));
    Api.call(Api.endpoints.BookingFlowConfig.Get, {urlParams: {serviceCenterId}})
        .then(result => {
            if (result?.data) setBookingFlowConfig(result.data)
        })
        .catch(err => {
            console.log('get booking flow config err', err)
        })
        .finally(() => dispatch(setBookingFlowConfigLoading(false)))
}

export const updateBookingFlowConfig = (serviceCenterId: number, config: IBookingFlowConfig): AppThunk => dispatch => {
    dispatch(setBookingFlowConfigLoading(true));
    Api.call(Api.endpoints.BookingFlowConfig.Update, {urlParams: {serviceCenterId}, data: config})
        .then(result => {
            if (result) dispatch(loadBookingFlowConfig(serviceCenterId));
        })
        .catch(err => {
            console.log('update booking flow config err', err)
        })
        .finally(() => dispatch(setBookingFlowConfigLoading(false)))
}