import {IMake} from "../../../api/types";
import {createReducer} from "@reduxjs/toolkit";
import {getMakes, setCurrentMake, setLoading} from "./actions";

type TState = {
    makes: IMake[];
    currentMake: IMake | null;
    isLoading: boolean;
}

const initialState: TState = {
    makes: [],
    currentMake: null,
    isLoading: false,
}

export const vehicleDetailsReducer = createReducer<TState>(initialState, builder => builder
    .addCase(getMakes, (state, {payload}) => {
        return { ...state, makes: payload }
    })
    .addCase(setCurrentMake, (state, {payload}) => {
        return { ...state, currentMake: payload }
    })
    .addCase(setLoading, (state, {payload}) => {
        return { ...state, isLoading: payload }
    })
)