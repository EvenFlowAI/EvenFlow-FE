import {createReducer} from "@reduxjs/toolkit";
import {IAppointmentCutoff, IOptimizationWindow, IOverbookingFactor} from "./types";
import {getAppointmentCutoff, getMaxPriceDateRange, getOptimizationWindows, getOverbookingFactor} from "./actions";

type TState = {
    dataList: IOptimizationWindow[],
    overbookingFactor: IOverbookingFactor[],
    appointmentCutoff: IAppointmentCutoff[],
    maxPriceDateRange: number | undefined,
}

const initialState: TState = {
    dataList: [],
    overbookingFactor: [],
    appointmentCutoff: [],
    maxPriceDateRange: undefined,
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
);