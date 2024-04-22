import {TState} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {setLoading} from "./actions";

const initialState: TState = {
    isLoading: false,
    advisors: [],
    technicians: [],
    capacityTypeOption: null,
}

export const employeesCapacity = createReducer(initialState, builder => builder
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
)