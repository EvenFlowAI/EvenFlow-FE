import {InitialState} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getCapacitySettings, setLoading} from "./actions";

const initialState: InitialState = {
    capacitySettings: [],
    isLoading: false,
}

export const capacityManagementReducer = createReducer(initialState, builder => builder
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(getCapacitySettings, (state, {payload}) => {
        return {...state, capacitySettings: payload};
    })
)