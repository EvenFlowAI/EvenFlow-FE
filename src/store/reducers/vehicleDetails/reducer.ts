import {IMake, IMakeExtended} from "../../../api/types";
import {createReducer} from "@reduxjs/toolkit";
import {getMakes, getMileage, setCurrentMake, setLoading, setPodsMakes} from "./actions";
import {IMileage} from "./types";

type TState = {
    makes: IMake[];
    currentMake: IMake | null;
    isLoading: boolean;
    mileage: IMileage[];
    makesModels: IMakeExtended[];
}

const initialState: TState = {
    makes: [],
    currentMake: null,
    isLoading: false,
    mileage: [],
    makesModels: [],
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
    .addCase(setPodsMakes, (state, {payload}) => {
        return { ...state, makesModels: payload }
    })
)