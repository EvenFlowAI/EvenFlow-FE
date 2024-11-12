import {TState} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getAllMakesOptions, getMakes, setLoading} from "./actions";

const initialState: TState = {
    makes: [],
    isLoading: false,
    allMakesOptions: [],
}

export const globalVehiclesReducer = createReducer(initialState, builder => builder
    .addCase(getMakes, (state, {payload}) => {
        return {...state, makes: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(getAllMakesOptions, (state, {payload}) => {
        return {...state, allMakesOptions: payload};
    })
)