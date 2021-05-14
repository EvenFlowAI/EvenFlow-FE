import {createReducer} from "@reduxjs/toolkit";
import {IAppointmentCutoff, IOptimizationWindow, IOverbookingFactor} from "./types";
import {getAppointmentCutoff, getOptimizationWindows, getOverbookingFactor} from "./actions";

type TState = {
    dataList: IOptimizationWindow[],
    overbookingFactor: IOverbookingFactor[],
    appointmentCutoff: IAppointmentCutoff[]
}

const initialState: TState = {
    dataList: [],
    overbookingFactor: [],
    appointmentCutoff: []
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
);