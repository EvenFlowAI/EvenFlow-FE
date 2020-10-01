import {createReducer} from "@reduxjs/toolkit";
import {IDesirability, IProximity} from "./types";
import {getProximity} from "./actions";

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
);