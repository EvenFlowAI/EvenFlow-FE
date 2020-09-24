import {createReducer} from "@reduxjs/toolkit";
import {IProximity} from "./types";
import {getProximity} from "./actions";

type TState = {
    proximity: IProximity[];
}
const initialState: TState = {
    proximity: []
};

export const slotScoringReducer = createReducer(initialState, builder => builder
    .addCase(getProximity, (state, {payload}) => {
        return {...state, proximity: payload};
    })
);