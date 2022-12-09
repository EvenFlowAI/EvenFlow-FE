import {createReducer} from "@reduxjs/toolkit";
import {IRecall} from "./types";
import {getRecalls} from "./actions";

type TState = {
    recalls: IRecall[];
}
const initialState: TState = {
    recalls: [],
}

export const recallsReducer = createReducer(initialState, builder => builder
    .addCase(getRecalls, (state, {payload}) => {
        return {...state, recalls: payload};
    })
)