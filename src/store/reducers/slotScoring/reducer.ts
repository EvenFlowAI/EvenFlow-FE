import {createReducer} from "@reduxjs/toolkit";
import {IDesirability, IOptimizationSetting, IProximity, ISlotRange} from "./types";
import {getDesirability, getOptimizationSettings, getProximity, getRange} from "./actions";

type TState = {
    proximity: IProximity[];
    desirability: IDesirability[];
    optimizationSettings: IOptimizationSetting[];
    slotRange: ISlotRange | null;
}
const initialState: TState = {
    proximity: [],
    desirability: [],
    optimizationSettings: [],
    slotRange: null,
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
    .addCase(getRange, (state, { payload }) => {
        return {...state, slotRange: payload};
    })
);