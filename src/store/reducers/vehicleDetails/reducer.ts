import {IMake} from "../../../api/types";
import {createReducer} from "@reduxjs/toolkit";
import {getMakes, getMileage, setCurrentMake, setLoading} from "./actions";
import {IMileage} from "./types";

type TState = {
    makes: IMake[];
    currentMake: IMake | null;
    isLoading: boolean;
    mileage: IMileage[];
}

const initialState: TState = {
    makes: [],
    currentMake: null,
    isLoading: false,
    mileage: [],
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
    .addCase(getMileage, (state, {payload}) => {
        return { ...state, mileage: payload }
    })
)