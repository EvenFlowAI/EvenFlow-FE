import {createAction} from "@reduxjs/toolkit";
import {TServiceTypeSettings} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {setMobileServiceAvailability, setPickUpDropOffAvailability} from "../appointmentFrameReducer/actions";
import {EServiceType} from "../appointmentFrameReducer/types";
import {IFirstScreenOption} from "../serviceTypes/types";

export const setBookingFlowConfig = createAction<TServiceTypeSettings[]>("BookingFlowConfig/SetConfig");
export const setBookingFlowConfigLoading = createAction<boolean>("BookingFlowConfig/SetLoading");
export const setAdvisorAvailable = createAction<boolean>("BookingFlowConfig/SetAdvisorAvailable");
export const setTransportationAvailable = createAction<boolean>("BookingFlowConfig/SetTransportationAvailable");
export const setAppointmentTimingAvailable = createAction<boolean>("BookingFlowConfig/SetAppointmentTimingAvailable");
export const setCurrentConfig = createAction<TServiceTypeSettings|null>("BookingFlowConfig/SetCurrentConfig");

export const setConfiguration = (config: TServiceTypeSettings, serviceOption: IFirstScreenOption|null): AppThunk => dispatch => {
    let transportation = config.transportationNeeds;
    if (serviceOption?.transportationOption) transportation = false
    const data = {
        ...config,
        isTransportationAvailable: transportation
    }
    dispatch(setCurrentConfig(data))
}

export const loadBookingFlowConfig = (id: number): AppThunk => dispatch => {
    dispatch(setBookingFlowConfigLoading(true));
    Api.call<TServiceTypeSettings[]>(Api.endpoints.BookingFlowConfig.Get, {urlParams: {id}})
        .then(result => {
            if (result?.data) {
                const mobileServiceIsAvailable = result.data
                    .find(item => item.serviceType == EServiceType.MobileService && item.available);
                const pickUpDropOffIsAvailable = result.data
                    .find(item => item.serviceType == EServiceType.PickUpDropOff && item.available);
                dispatch(setMobileServiceAvailability(Boolean(mobileServiceIsAvailable)));
                dispatch(setPickUpDropOffAvailability(Boolean(pickUpDropOffIsAvailable)));
                dispatch(setBookingFlowConfig(result.data))
            }
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