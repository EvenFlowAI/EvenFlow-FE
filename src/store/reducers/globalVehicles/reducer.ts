import {TState} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getAllMakesOptions, getMakes, getMakesStatistics, setLoading, setPaging} from "./actions";
import {defaultPaging} from "../constants";

const initialState: TState = {
    makes: [],
    isLoading: false,
    allMakesOptions: [],
    makesPagination: defaultPaging,
    makesStatistic: null,
    modelsStatistic: null,
}

export const globalVehiclesReducer = createReducer(initialState, builder => builder
    .addCase(getMakes, (state, {payload}) => {
        return {...state, makes: payload};
    })
    .addCase(setPaging, (state, {payload}) => {
        return {...state, makesPagination: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(getAllMakesOptions, (state, {payload}) => {
        return {...state, allMakesOptions: payload};
    })
    .addCase(getMakesStatistics, (state, {payload}) => {
        return {...state, makesStatistic: payload};
    })
)