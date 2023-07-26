import {TServiceTypeSettings} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {
    setAdvisorAvailable, setAppointmentTimingAvailable,
    setBookingFlowConfig,
    setBookingFlowConfigLoading, setCurrentConfig,
    setTransportationAvailable
} from "./actions";

interface InitialState {
    config: TServiceTypeSettings[],
    isLoading: boolean;
    currentConfig: TServiceTypeSettings|null;
    isAdvisorAvailable: boolean;
    isTransportationAvailable: boolean;
    isAppointmentTimingAvailable: boolean;
}

const initialState: InitialState = {
    config: [],
    isLoading: false,
    currentConfig: null,
    isAdvisorAvailable: false,
    isTransportationAvailable: false,
    isAppointmentTimingAvailable: false,
}

export const bookingFlowConfigReducer = createReducer(initialState, builder => builder
    .addCase(setBookingFlowConfig, (state, {payload}) => {
        return {...state, config: payload};
    })
    .addCase(setBookingFlowConfigLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(setAdvisorAvailable, (state, {payload}) => {
        return {...state, isAdvisorAvailable: payload};
    })
    .addCase(setTransportationAvailable, (state, {payload}) => {
        return {...state, isTransportationAvailable: payload};
    })
    .addCase(setAppointmentTimingAvailable, (state, {payload}) => {
        return {...state, isAppointmentTimingAvailable: payload};
    })
    .addCase(setCurrentConfig, (state, {payload}) => {
        return {...state, currentConfig: payload};
    })
)