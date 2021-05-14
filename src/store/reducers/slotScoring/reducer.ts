import {createReducer} from "@reduxjs/toolkit";
import {IDesirability, IOptimizationSetting, IProximity} from "./types";
import {getDesirability, getOptimizationSettings, getProximity} from "./actions";

type TState = {
    proximity: IProximity[];
    desirability: IDesirability[];
    optimizationSettings: IOptimizationSetting[];
}
const initialState: TState = {
    proximity: [],
    desirability: [],
    optimizationSettings: []
};

export const slotScoringReducer = createReducer(initialState, builder => builder
    .addCase(getProximity, (state, {payload}) => {
        return {...state, proximity: payload};
    })
    .addCase(getDesirability, (state, {payload}) => {
        return {...state, desirability: payload};
    })
    .addCase(getOptimizationSettings, (state, {payload}) => {
        return {...state, optimizationSettings: payload};
    })
);