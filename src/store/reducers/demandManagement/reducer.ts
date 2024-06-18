import {TState} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getSettings, setLoading} from "./actions";

const initialState: TState = {
    isLoading: false,
    settings: [],
}

export const demandManagementReducer = createReducer(initialState, builder => builder
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(getSettings, (state, {payload})=> {
    return {...state, settings: payload};
}))