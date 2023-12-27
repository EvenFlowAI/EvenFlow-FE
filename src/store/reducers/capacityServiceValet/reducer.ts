import {InitialState,} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getCenterSettings, getTimeRangesAndCapacity, getZonesRouting, setLoading} from "./actions";

const initialState: InitialState = {
    zonesRouting: [],
    timeRangesAndCapacity: [],
    isLoading: false,
    centerSettings: null,
}

export const capacityServiceValetReducer = createReducer(initialState, builder => builder
    .addCase(getZonesRouting, (state, {payload}) => {
        return {...state, zonesRouting: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(getTimeRangesAndCapacity, (state, {payload}) => {
        return {...state, timeRangesAndCapacity: payload};
    })
    .addCase(getCenterSettings, (state, {payload}) => {
        return {...state, centerSettings: payload};
    })
)