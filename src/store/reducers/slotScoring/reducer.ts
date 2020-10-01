import {createReducer} from "@reduxjs/toolkit";
import {IDesirability, IProximity} from "./types";
import {getDesirability, getProximity} from "./actions";

type TState = {
    proximity: IProximity[];
    desirability: IDesirability[];
}
const initialState: TState = {
    proximity: [],
    desirability: []
};

export const slotScoringReducer = createReducer(initialState, builder => builder
    .addCase(getProximity, (state, {payload}) => {
        return {...state, proximity: payload};
    })
    .addCase(getDesirability, (state, {payload}) => {
        return {...state, desirability: payload};
    })
);