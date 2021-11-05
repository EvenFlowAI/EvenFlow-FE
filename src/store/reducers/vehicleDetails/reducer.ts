import {IMake} from "../../../api/types";
import {createReducer} from "@reduxjs/toolkit";
import {getMakes, setCurrentMake} from "./actions";

type TState = {
    makes: IMake[];
    currentMake: IMake | null;
}

const initialState: TState = {
    makes: [],
    currentMake: null,
}

export const vehicleDetailsReducer = createReducer<TState>(initialState, builder => builder
    .addCase(getMakes, (state, {payload}) => {
        return { ...state, makes: payload }
    })
    .addCase(setCurrentMake, (state, {payload}) => {
        return { ...state, currentMake: payload }
    })
)