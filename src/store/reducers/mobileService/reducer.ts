import {createReducer} from "@reduxjs/toolkit";
import {setCurrentZone, setLoading, setZones} from "./actions";
import {TZone} from "./types";

type TState = {
    isLoading: Boolean;
    currentZone: any;
    zones: TZone[];
}

const initialState: TState = {
    isLoading: false,
    currentZone: null,
    zones: [],
}

export const mobileServiceReducer = createReducer<TState>(initialState, builder => builder
    .addCase(setCurrentZone, (state, {payload}) => {
        return {...state, currentZone: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload}
    })
    .addCase(setZones, (state, {payload}) => {
        return {...state, zones: payload}
    })
)