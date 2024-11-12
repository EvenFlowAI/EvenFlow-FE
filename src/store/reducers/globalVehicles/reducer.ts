import {TState} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getMakes} from "./actions";

const initialState: TState = {
    makes: [],
}

export const globalVehiclesReducer = createReducer(initialState, builder => builder
    .addCase(getMakes, (state, {payload}) => {
        return {...state, makes: payload};
    })
)