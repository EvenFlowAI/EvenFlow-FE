import {TState} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {setConsentsList, setLoading} from "./actions";

const initialState: TState = {
    consentsList: [],
    isLoading: false,
}

export const consentsReducer = createReducer(initialState, builder => builder
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(setConsentsList, (state, { payload }) => {
        return {...state, consentsList: payload};
    })
)