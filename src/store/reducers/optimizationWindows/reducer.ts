import {createReducer} from "@reduxjs/toolkit";
import {IOptimizationWindow, IOverbookingFactor} from "./types";
import {getOptimizationWindows, getOverbookingFactor} from "./actions";

type TState = {
    dataList: IOptimizationWindow[],
    overbookingFactor: IOverbookingFactor[],
}

const initialState: TState = {
    dataList: [],
    overbookingFactor: []
}
export const optimizationWindowsReducer = createReducer(initialState, builder => builder
    .addCase(getOptimizationWindows, (state, {payload}) => {
        return {...state, dataList: payload};
    })
    .addCase(getOverbookingFactor, (state, {payload}) => {
        return {...state, overbookingFactor: payload};
    })
);