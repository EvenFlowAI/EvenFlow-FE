import {createReducer} from "@reduxjs/toolkit";
import {IAppointmentCutoff, IOptimizationWindow, IOverbookingFactor, IWaitlistConfig} from "./types";
import {
    getAppointmentCutoff,
    getMaxPriceDateRange,
    getOptimizationWindows,
    getOverbookingFactor, getWaitListSettings,
    setWaitListLoading
} from "./actions";

type TState = {
    dataList: IOptimizationWindow[],
    overbookingFactor: IOverbookingFactor[],
    appointmentCutoff: IAppointmentCutoff[],
    maxPriceDateRange: number | undefined,
    waitListSettings: IWaitlistConfig;
    isWaitListLoading: boolean;
}

const initialState: TState = {
    dataList: [],
    overbookingFactor: [],
    appointmentCutoff: [],
    maxPriceDateRange: undefined,
    waitListSettings: {
        isEnabled: false,
        slotSettings: null
    },
    isWaitListLoading: false
}
export const optimizationWindowsReducer = createReducer(initialState, builder => builder
    .addCase(getOptimizationWindows, (state, {payload}) => {
        return {...state, dataList: payload};
    })
    .addCase(getOverbookingFactor, (state, {payload}) => {
        return {...state, overbookingFactor: payload};
    })
    .addCase(getAppointmentCutoff, (state, {payload}) => {
        return {...state, appointmentCutoff: payload};
    })
    .addCase(getMaxPriceDateRange, (state, {payload}) => {
        return {...state, maxPriceDateRange: payload};
    })
    .addCase(setWaitListLoading, (state, {payload}) => {
        return {...state, isWaitListLoading: payload};
    })
    .addCase(getWaitListSettings, (state, {payload}) => {
        return {...state, waitListSettings: payload};
    })
);