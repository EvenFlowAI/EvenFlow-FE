import {createReducer} from "@reduxjs/toolkit";
import {IOptimizationWindow} from "./types";
import {getOptimizationWindows} from "./actions";

type TState = {
    dataList: IOptimizationWindow[]
}

const initialState: TState = {
    dataList: []
}
export const optimizationWindowsReducer = createReducer(initialState, builder => builder
    .addCase(getOptimizationWindows, (state, {payload}) => {
        return {...state, dataList: payload};
    })
);